import os
from PIL import Image
import shutil

# Configuration
IMAGE_DIR = 'imagenes'
BACKUP_DIR = 'respaldo_originales'
MAX_SIZE_KB = 300  # Target size in KB
QUALITY = 80       # Initial JPEG quality
MAX_DIMENSION = 1920 # Max width/height

def compress_images():
    # Create backup directory
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created backup directory: {BACKUP_DIR}")

    total_saved = 0
    
    for filename in os.listdir(IMAGE_DIR):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            filepath = os.path.join(IMAGE_DIR, filename)
            filesize = os.path.getsize(filepath) / 1024 # KB
            
            # Only compress if larger than 500KB
            if filesize > 500:
                print(f"Processing {filename} ({filesize:.2f} KB)...")
                
                # Backup original
                shutil.copy2(filepath, os.path.join(BACKUP_DIR, filename))
                
                try:
                    with Image.open(filepath) as img:
                        # Convert to RGB if necessary (for PNG to JPG conversion or transparency issues)
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        
                        # Resize if too large
                        if max(img.size) > MAX_DIMENSION:
                            img.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
                        
                        # Save with optimization
                        output_path = filepath # Overwrite
                        img.save(output_path, "JPEG", optimize=True, quality=QUALITY)
                        
                        new_filesize = os.path.getsize(output_path) / 1024
                        saved = filesize - new_filesize
                        total_saved += saved
                        
                        print(f"  -> Compressed to {new_filesize:.2f} KB (Saved {saved:.2f} KB)")
                except Exception as e:
                    print(f"  -> Error processing {filename}: {e}")

    print(f"\nTotal space saved: {total_saved/1024:.2f} MB")
    print(f"Originals backed up in '{BACKUP_DIR}/'")

if __name__ == "__main__":
    compress_images()
