/**
 * skills-animations.js
 * Enhanced 3D animations for tech stack skills
 */

document.addEventListener('DOMContentLoaded', function () {
    const skillItems = document.querySelectorAll('.skill-item');

    // Add 3D tilt effect on mouse move
    skillItems.forEach(item => {
        item.addEventListener('mousemove', function (e) {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 8;
            const rotateY = (centerX - x) / 8;

            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.1)`;
        });

        item.addEventListener('mouseleave', function () {
            item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // Add click animation for skill items
    skillItems.forEach(item => {
        item.addEventListener('click', function () {
            // Pulse animation on click
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'skillPulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            }, 10);
        });
    });

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // Trigger stagger animation for skill items
                const items = entry.target.querySelectorAll('.skill-item');
                items.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) rotateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    }, { threshold: 0.2 });

    // Observe skills container
    const skillsContainer = document.querySelector('.skills-container-full');
    if (skillsContainer) {
        observer.observe(skillsContainer);
    }

    // Add parallax effect on scroll
    let ticking = false;

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const skillsSection = document.querySelector('.page-skills');
                if (skillsSection) {
                    const rect = skillsSection.getBoundingClientRect();
                    const scrollPercent = (window.innerHeight - rect.top) / window.innerHeight;

                    if (scrollPercent > 0 && scrollPercent < 1) {
                        skillItems.forEach((item, index) => {
                            const offset = Math.sin(scrollPercent * Math.PI + index * 0.5) * 10;
                            item.style.transform = `translateY(${offset}px)`;
                        });
                    }
                }
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes skillPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 10px 30px rgba(0, 255, 209, 0.3);
    }
    50% {
      transform: scale(1.15);
      box-shadow: 0 20px 60px rgba(0, 255, 209, 0.6);
    }
  }
`;
document.head.appendChild(style);
