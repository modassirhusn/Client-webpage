// bridge-3d.js - Standalone Three.js 3D Scene
// Usage: Include Three.js CDN, then this script, then call initBridge3D('container-id')

function initBridge3D(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 50);

    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 15;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const pointLight1 = new THREE.PointLight(0xf59e0b, 1.5, 20);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 1, 20);
    pointLight2.position.set(5, 3, -5);
    scene.add(pointLight2);

    const rimLight = new THREE.DirectionalLight(0xf59e0b, 0.5);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    // Create central pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(2, 2.5, 0.5, 32);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        metalness: 0.8,
        roughness: 0.2
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.y = -2;
    pedestal.castShadow = true;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Create floating geometric shapes
    const shapes = [];

    // Main centerpiece - rotating torus
    const torusGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0xf59e0b,
        emissiveIntensity: 0.2
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.y = 0;
    // torus.castShadow = true;
    scene.add(torus);
    shapes.push(torus);

    // Orbiting spheres
    const createOrbitingSphere = (radius, color, distance, speed) => {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.7,
            roughness: 0.3,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.userData = {
            distance,
            speed,
            angle: Math.random() * Math.PI * 2
        };
        scene.add(sphere);
        shapes.push(sphere);
        return sphere;
    };

    createOrbitingSphere(0.5, 0xff6b6b, 4, 0.5);
    createOrbitingSphere(0.4, 0x4ecdc4, 5, 0.7);
    createOrbitingSphere(0.6, 0xffe66d, 4.5, 0.6);
    createOrbitingSphere(0.3, 0x95e1d3, 5.5, 0.8);

    // Floating cubes
    const createFloatingCube = (size, color, x, y, z) => {
        const geometry = new THREE.BoxGeometry(size, size, size);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.6,
            roughness: 0.4,
            emissive: color,
            emissiveIntensity: 0.1
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = true;
        cube.userData = {
            floatSpeed: 0.5 + Math.random() * 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01 + Math.random() * 0.02
        };
        scene.add(cube);
        shapes.push(cube);
        return cube;
    };

    createFloatingCube(0.8, 0xf59e0b, -6, 2, -3);
    createFloatingCube(0.6, 0x3b82f6, 6, 1, -2);
    createFloatingCube(0.7, 0xec4899, -5, -1, 2);
    createFloatingCube(0.5, 0x10b981, 5, 3, 3);

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        metalness: 0.5,
        roughness: 0.8
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.5;
    // ground.receiveShadow = true;
    scene.add(ground);

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 50, 0xf59e0b, 0x333333);
    gridHelper.position.y = -2.49;
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;
    });

    // Scroll zoom
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        camera.position.z += event.deltaY * 0.01;
        camera.position.z = Math.max(8, Math.min(25, camera.position.z));
    });

    // Animation loop
    let time = 0;
    let animationId;

    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.01;

        // Rotate main torus
        torus.rotation.x = time * 0.5;
        torus.rotation.y = time * 0.3;

        // Animate shapes
        shapes.forEach((shape, index) => {
            if (shape.userData.distance) {
                shape.userData.angle += shape.userData.speed * 0.01;
                shape.position.x = Math.cos(shape.userData.angle) * shape.userData.distance;
                shape.position.z = Math.sin(shape.userData.angle) * shape.userData.distance;
                shape.position.y = Math.sin(time * 2 + index) * 0.5;
                shape.rotation.x += 0.02;
                shape.rotation.y += 0.02;
            }

            if (shape.userData.floatSpeed) {
                shape.position.y += Math.sin(time * shape.userData.floatSpeed + shape.userData.floatOffset) * 0.01;
                shape.rotation.x += shape.userData.rotationSpeed;
                shape.rotation.y += shape.userData.rotationSpeed;
                shape.rotation.z += shape.userData.rotationSpeed * 0.5;
            }
        });

        // Animate particles
        particlesMesh.rotation.y += 0.0005;

        // Animate lights
        pointLight1.position.x = Math.sin(time * 0.7) * 8;
        pointLight1.position.z = Math.cos(time * 0.7) * 8;
        pointLight2.position.x = Math.cos(time * 0.5) * 8;
        pointLight2.position.z = Math.sin(time * 0.5) * 8;

        // Camera follow mouse
        camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 2 + 2 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    // Handle resize
    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Start animation
    console.log("Bridge 3D Initialized");
    animate();

    // Return cleanup function
    return {
        destroy: () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        }
    };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initBridge3D;
}
