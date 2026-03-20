document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Animation
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 150;

        reveals.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            } else {
                reveal.classList.remove('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger once on load
    revealOnScroll();

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
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
            const openTime = 15 * 60; // 15:00
            const warningTime = 21 * 60 + 30; // 21:30
            const closeTime = 22 * 60 + 30; // 22:30

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
});
