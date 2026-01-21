/**
 * Water Ripple Effect using Three.js (Buffer Geometry / Shader Approach)
 * - Mouse trail waves (movement)
 * - Click droplets
 * - Scroll droplets (waves on scroll)
 * - Transparent overlay
 */


if (typeof THREE !== "undefined") {
  initWaterRipple();
} else {
  console.error("THREE.js is not loaded! Water effect cannot start.");
}

function initWaterRipple() {
  const container = document.getElementById("water-bg");
  if (!container) return;

  // Cleanup existing
  container.innerHTML = "";

  // 1. Setup Scene
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 2. Setup Simulation (Ping-Pong)
  const width = window.innerWidth >> 1;
  const height = window.innerHeight >> 1;
  const simRes = new THREE.Vector2(width, height);

  const options = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    depthBuffer: false,
    stencilBuffer: false
  };

  let currentTarget = new THREE.WebGLRenderTarget(width, height, options);
  let prevTarget = new THREE.WebGLRenderTarget(width, height, options);

  // 3. Simulation Material
  const simVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const simFragmentShader = `
    precision highp float;
    
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform float uMouseSize;
    uniform float uViscosity;
    uniform int uClick;
    
    varying vec2 vUv;

    void main() {
      vec2 cellSize = 1.0 / uResolution;
      vec2 uv = vUv;

      float up = texture2D(uTexture, uv + vec2(0.0, cellSize.y)).r;
      float down = texture2D(uTexture, uv - vec2(0.0, cellSize.y)).r;
      float left = texture2D(uTexture, uv - vec2(cellSize.x, 0.0)).r;
      float right = texture2D(uTexture, uv + vec2(cellSize.x, 0.0)).r;

      vec4 data = texture2D(uTexture, uv);
      float height = data.r;
      float vel = data.g;

      float avg = (up + down + left + right) * 0.25;

      float stiffness = 0.5;
      vel += (avg - height) * stiffness;
      vel *= uViscosity;
      height += vel;

      // Mouse interaction
      vec2 distVec = uv - uMouse;
      distVec.x *= (uResolution.x / uResolution.y);
      float dist = length(distVec);
      
      if (dist < uMouseSize) {
         float force = (uMouseSize - dist) / uMouseSize;
         // Combined click/move logic
         // uClick = 1 (click), 2 (scroll/strong), 0 (move/weak)
    
         if (uClick == 1) {
             height -= force * 1.5; // Click
         } else if (uClick == 2) {
             height -= force * 1.0; // Scroll
         } else {
             height -= force * 0.1; // Regular move trail
         }
      }

      gl_FragColor = vec4(height, vel, 0.0, 1.0);
    }
  `;

  const simMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uResolution: { value: simRes },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uMouseSize: { value: 0.03 },
      uViscosity: { value: 0.98 },
      uClick: { value: 0 }
    },
    vertexShader: simVertexShader,
    fragmentShader: simFragmentShader
  });

  const simGeometry = new THREE.PlaneGeometry(2, 2);
  const simMesh = new THREE.Mesh(simGeometry, simMaterial);
  const simScene = new THREE.Scene();
  simScene.add(simMesh);

  // 4. Render Material
  const renderVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const renderFragmentShader = `
    precision highp float;
    
    uniform sampler2D uTexture;
    uniform vec2 uResolution;
    
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 pixel = 1.0 / uResolution;
      
      float h = texture2D(uTexture, uv).r;
      float h_right = texture2D(uTexture, uv + vec2(pixel.x, 0.0)).r;
      float h_up = texture2D(uTexture, uv + vec2(0.0, pixel.y)).r;
      
      // Use slightly stronger normal calculation
      vec3 normal = normalize(vec3(h - h_right, h - h_up, 0.02)); // Lower Z = steeper waves
      
      vec3 lightDir = normalize(vec3(-0.5, 0.5, 1.0));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfDir = normalize(lightDir + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 30.0); // Broader highlight
      
      // Color
      vec3 waterColor = vec3(0.0, 0.6, 0.8);
      vec3 col = waterColor * 0.15 + vec3(spec * 0.8);
      
      float turbulence = 1.0 - normal.z;
      // Transparency based on turbulence, but with a tiny base visibility
      float alpha = min(smoothstep(0.0, 0.002, turbulence) * 0.8 + 0.02, 1.0);
      
      gl_FragColor = vec4(col, alpha);
    }
  `;

  const renderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: null },
      uResolution: { value: simRes }
    },
    vertexShader: renderVertexShader,
    fragmentShader: renderFragmentShader,
    transparent: true
  });

  const renderMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), renderMaterial);
  scene.add(renderMesh);

  // 5. Input Handling
  const mouse = new THREE.Vector2(-10, -10);
  let clickState = 0; // 0=none/move, 1=click, 2=scroll

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX / window.innerWidth;
    mouse.y = 1.0 - e.clientY / window.innerHeight;
  });

  window.addEventListener('mousedown', () => {
    clickState = 1;
    setTimeout(() => { if (clickState === 1) clickState = 0; }, 100);
  });

  // Scroll Interaction
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    // When scrolling, act as if we are creating ripples at the mouse location
    // Or a stronger ripple.
    clickState = 2; // trigger stronger ripple

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (clickState === 2) clickState = 0;
    }, 100);
  });

  // 6. Resize
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    simMaterial.uniforms.uResolution.value.set(w >> 1, h >> 1);
  });

  // 7. Loop
  function animate() {
    requestAnimationFrame(animate);

    // Update Uniforms
    simMaterial.uniforms.uTexture.value = prevTarget.texture;
    simMaterial.uniforms.uMouse.value.copy(mouse);
    simMaterial.uniforms.uClick.value = clickState;

    // Simulation Pass
    renderer.setRenderTarget(currentTarget);
    renderer.render(simScene, camera);

    // Final Render Pass
    renderer.setRenderTarget(null);
    renderMaterial.uniforms.uTexture.value = currentTarget.texture;
    renderer.render(scene, camera);

    // Swap
    let temp = currentTarget;
    currentTarget = prevTarget;
    prevTarget = temp;
  }

  animate();
}
