document.addEventListener('DOMContentLoaded', () => {
    // === OPTIMIZED SCROLL REVEAL with IntersectionObserver ===
    // Uses IntersectionObserver instead of scroll events for zero-jank reveals
    const reveals = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Once revealed, stop observing (no re-hide on scroll up = no jank)
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        reveals.forEach(reveal => revealObserver.observe(reveal));
    } else {
        // Fallback: just show everything immediately
        reveals.forEach(reveal => reveal.classList.add('active'));
    }

    // === OPTIMIZED GLASSMORPHISM HEADER ===
    // Uses requestAnimationFrame to avoid scroll jank
    const header = document.querySelector('header');
    let lastScrollY = 0;
    let ticking = false;

    const updateHeader = () => {
        if (lastScrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Dynamic Hours Status Indicator
    const hoursWidget = document.querySelector('.hours-widget');
    if (hoursWidget) {
        const dot = document.createElement('span');
        dot.className = 'status-dot';
        hoursWidget.prepend(dot);

        const updateStatus = () => {
            const options = { timeZone: 'America/Mexico_City', hour: '2-digit', minute: '2-digit', hour12: false };
            const timeParts = new Intl.DateTimeFormat('en-US', options).formatToParts(new Date());
            let hour = 0, minute = 0;
            timeParts.forEach(p => {
                if (p.type === 'hour') hour = parseInt(p.value);
                if (p.type === 'minute') minute = parseInt(p.value);
            });
            
            const timeInMinutes = hour * 60 + minute;
            const openTime = 15 * 60;
            const warningTime = 21 * 60 + 30;
            const closeTime = 22 * 60 + 30;

            dot.classList.remove('open', 'closing', 'closed');

            if (timeInMinutes >= openTime && timeInMinutes < warningTime) {
                dot.classList.add('open');
                hoursWidget.setAttribute('title', 'Abierto ahora');
            } else if (timeInMinutes >= warningTime && timeInMinutes < closeTime) {
                dot.classList.add('closing');
                hoursWidget.setAttribute('title', 'Cierra pronto');
            } else {
                dot.classList.add('closed');
                hoursWidget.setAttribute('title', 'Cerrado');
            }
        };

        updateStatus();
        setInterval(updateStatus, 60000);
    }

    // --- Premium Menu Tabs Logic ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-tab');
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // --- Clickable Blog Cards ---
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const link = card.querySelector('a');
            if (link && e.target !== link) {
                window.location.href = link.href;
            }
        });
    });
});
