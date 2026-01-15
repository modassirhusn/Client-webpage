console.log("Initializing Water Ripple Shader...");

if (typeof THREE !== "undefined") {
  const container = document.getElementById("water-bg");

  if (!container) {
    console.error("water-bg container missing!");
  } else {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const geometry = new THREE.PlaneGeometry(2, 2);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;

        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;

        float ripple(vec2 uv, vec2 c) {
          float d = distance(uv, c) * 12.0;
          return sin(d - uTime * 3.0) / (d + 1.0);
        }

        void main() {
          vec2 uv = vUv;
          float r = ripple(uv, uMouse);
          vec3 base = vec3(0.0, 0.2, 0.25);
          vec3 col = base + vec3(r * 0.1, r * 0.25, r * 0.4);
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // MOUSE TRACKING
    window.addEventListener("mousemove", (e) => {
      uniforms.uMouse.value.x = e.clientX / window.innerWidth;
      uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
    });

    // RESIZE FIX
    window.addEventListener("resize", () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    });

    // ANIMATION LOOP
    function animate() {
      uniforms.uTime.value += 0.02;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }

    animate();
  }
} else {
  console.error("THREE.js is not loaded!");
}
