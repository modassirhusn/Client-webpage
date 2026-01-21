// Footer year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// IntersectionObserver for blur/fade page transitions
const animatedEls = document.querySelectorAll("[data-animate]");

if ("IntersectionObserver" in window && animatedEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          // Remove the next line if you want animations to replay
          // observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  animatedEls.forEach((el) => observer.observe(el));
} else {
  animatedEls.forEach((el) => el.classList.add("in-view"));
}

// Mouse-based parallax on the noise overlay (subtle effect)
const noiseLayer = document.querySelector(".noise");
if (noiseLayer) {
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20; // -10 to +10
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    noiseLayer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}


// Initialize 3D Bridge if container exists
if (typeof initBridge3D === 'function') {
  initBridge3D('bridge-3d-container');
}

// Initialize Cosmic Scene if container exists
if (typeof initCosmicScene === 'function') {
  initCosmicScene('cosmic-scene-container');
}

// Initialize Neon Background if container exists
if (typeof initNeonBackground === 'function') {
  initNeonBackground();
}

console.log("Main script loaded.");


