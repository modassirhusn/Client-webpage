/**
 * contact-animations.js
 * 3D icon animations and typing effect for Contact page
 */

document.addEventListener('DOMContentLoaded', function () {
    // Typing effect for contact details
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }

        type();
    }

    // Start typing animation after icons animate in
    setTimeout(() => {
        const emailElement = document.getElementById('email-text');
        const phoneElement = document.getElementById('phone-text');

        if (emailElement) {
            const emailText = emailElement.getAttribute('data-text');
            typeWriter(emailElement, emailText, 80);
        }

        if (phoneElement) {
            setTimeout(() => {
                const phoneText = phoneElement.getAttribute('data-text');
                typeWriter(phoneElement, phoneText, 120);
            }, 2000); // Start phone typing after email
        }
    }, 1500); // Wait for icons to animate in

    // Add 3D rotation to icons on hover
    const icons = document.querySelectorAll('.contact-icon-3d');

    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.2) rotateY(360deg)';
            this.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1) rotateY(0deg)';
        });
    });

    // Trigger animations on scroll/view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-animate]').forEach(el => {
        observer.observe(el);
    });
});
