// cosmic-scene.js - Standalone Cosmic/Space Three.js Scene
// Usage: Include Three.js CDN, then this script, then call initCosmicScene('container-id')

function initCosmicScene(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }

    // Scene setup
    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x0a0a1a); // Removed to allow transparency
    // scene.fog = new THREE.FogExp2(0x0a0a1a, 0.015);


    const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );
    camera.position.set(0, 5, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting setup - Cosmic theme
    const ambientLight = new THREE.AmbientLight(0x4a4a8a, 0.4);
    scene.add(ambientLight);

    // Purple rim light
    const purpleLight = new THREE.DirectionalLight(0x9333ea, 1.5);
    purpleLight.position.set(-10, 10, -10);
    scene.add(purpleLight);

    // Cyan accent light
    const cyanLight = new THREE.PointLight(0x06b6d4, 2, 50);
    cyanLight.position.set(15, 8, 10);
    scene.add(cyanLight);

    // Pink accent light
    const pinkLight = new THREE.PointLight(0xec4899, 2, 50);
    pinkLight.position.set(-15, 8, -10);
    scene.add(pinkLight);

    // Main spotlight
    const spotlight = new THREE.SpotLight(0xffffff, 1);
    spotlight.position.set(0, 20, 0);
    spotlight.angle = Math.PI / 6;
    spotlight.penumbra = 0.3;
    spotlight.castShadow = true;
    scene.add(spotlight);

    // Create animated objects array
    const animatedObjects = [];

    // Central floating sphere with rings (planet-like)
    const createPlanetSphere = () => {
        const geometry = new THREE.SphereGeometry(3, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: 0x4a5568,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x3730a3,
            emissiveIntensity: 0.3
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        sphere.position.set(0, 5, 0);
        scene.add(sphere);
        animatedObjects.push({ mesh: sphere, type: 'planet' });

        // Add rings around the sphere
        const ringGeometry = new THREE.TorusGeometry(4.5, 0.15, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x06b6d4,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x06b6d4,
            emissiveIntensity: 0.4,
            side: THREE.DoubleSide
        });
        const ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
        ring1.rotation.x = Math.PI / 2;
        ring1.rotation.z = Math.PI / 6;
        ring1.position.copy(sphere.position);
        scene.add(ring1);
        animatedObjects.push({ mesh: ring1, type: 'ring' });

        const ring2 = new THREE.Mesh(ringGeometry, ringMaterial);
        ring2.rotation.x = Math.PI / 2;
        ring2.rotation.z = -Math.PI / 6;
        ring2.position.copy(sphere.position);
        scene.add(ring2);
        animatedObjects.push({ mesh: ring2, type: 'ring' });

        return sphere;
    };

    const planet = createPlanetSphere();

    // Orbiting glowing orbs
    const createOrbitingOrb = (radius, color, distance, speed, height) => {
        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.7,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.6
        });
        const orb = new THREE.Mesh(geometry, material);
        orb.castShadow = true;

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(radius * 1.3, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        orb.add(glow);

        orb.userData = {
            distance,
            speed,
            angle: Math.random() * Math.PI * 2,
            height,
            glowPulse: Math.random() * Math.PI * 2
        };
        scene.add(orb);
        animatedObjects.push({ mesh: orb, type: 'orb' });
        return orb;
    };

    // Create multiple orbiting orbs with different colors
    createOrbitingOrb(0.6, 0x06b6d4, 8, 0.6, 5);
    createOrbitingOrb(0.5, 0xec4899, 10, 0.4, 6);
    createOrbitingOrb(0.7, 0x8b5cf6, 9, 0.5, 4);
    createOrbitingOrb(0.4, 0x10b981, 11, 0.7, 5.5);
    createOrbitingOrb(0.5, 0xf59e0b, 7, 0.8, 6.5);

    // Floating geometric crystals
    const createFloatingCrystal = (x, y, z, color, scale) => {
        const geometry = new THREE.OctahedronGeometry(scale);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.9,
            roughness: 0.1,
            emissive: color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.9
        });
        const crystal = new THREE.Mesh(geometry, material);
        crystal.position.set(x, y, z);
        crystal.castShadow = true;
        crystal.userData = {
            floatSpeed: 0.3 + Math.random() * 0.4,
            floatOffset: Math.random() * Math.PI * 2,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        scene.add(crystal);
        animatedObjects.push({ mesh: crystal, type: 'crystal' });
        return crystal;
    };

    // Create scattered crystals
    for (let i = 0; i < 15; i++) {
        const x = (Math.random() - 0.5) * 40;
        const y = Math.random() * 15 + 2;
        const z = (Math.random() - 0.5) * 40;
        const colors = [0x06b6d4, 0xec4899, 0x8b5cf6, 0x10b981, 0xf59e0b, 0x3b82f6];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = 0.5 + Math.random() * 1;
        createFloatingCrystal(x, y, z, color, scale);
    }

    // Particle systems - Stars and cosmic dust
    const createStarField = () => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        for (let i = 0; i < 5000; i++) {
            const x = (Math.random() - 0.5) * 200;
            const y = (Math.random() - 0.5) * 200;
            const z = (Math.random() - 0.5) * 200;
            vertices.push(x, y, z);

            // Random star colors
            const colorChoice = Math.random();
            if (colorChoice < 0.3) {
                colors.push(0.4, 0.7, 0.8); // Cyan
            } else if (colorChoice < 0.6) {
                colors.push(0.9, 0.3, 0.6); // Pink
            } else {
                colors.push(0.9, 0.9, 1); // White
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const stars = new THREE.Points(geometry, material);
        scene.add(stars);
        animatedObjects.push({ mesh: stars, type: 'stars' });
        return stars;
    };

    const stars = createStarField();

    // Floating dust particles
    const createDustParticles = () => {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];

        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            vertices.push(x, y, z);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        const dust = new THREE.Points(geometry, material);
        scene.add(dust);
        animatedObjects.push({ mesh: dust, type: 'dust' });
        return dust;
    };

    const dust = createDustParticles();

    // Ground plane with grid (cosmic floor)
    const createCosmicFloor = () => {
        const geometry = new THREE.PlaneGeometry(200, 200, 100, 100);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.8,
            roughness: 0.4,
            wireframe: false
        });
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -5;
        floor.receiveShadow = true;
        scene.add(floor);

        // Glowing grid
        const gridHelper = new THREE.GridHelper(200, 100, 0x8b5cf6, 0x4a1d96);
        gridHelper.position.y = -4.99;
        gridHelper.material.opacity = 0.4;
        gridHelper.material.transparent = true;
        scene.add(gridHelper);
    };

    createCosmicFloor();

    // Add floating rings in the distance
    const createDistantRings = () => {
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.TorusGeometry(2 + i * 2, 0.1, 16, 100);
            const material = new THREE.MeshStandardMaterial({
                color: i % 2 === 0 ? 0x06b6d4 : 0xec4899,
                metalness: 0.9,
                roughness: 0.1,
                emissive: i % 2 === 0 ? 0x06b6d4 : 0xec4899,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.6
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.position.set(
                (Math.random() - 0.5) * 50,
                Math.random() * 20 + 10,
                (Math.random() - 0.5) * 50
            );
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            ring.userData = {
                rotationSpeed: (Math.random() - 0.5) * 0.01
            };
            scene.add(ring);
            animatedObjects.push({ mesh: ring, type: 'distantRing' });
        }
    };

    createDistantRings();

    // Cursor Follower Component
    const createCursorFollower = () => {
        const geometry = new THREE.IcosahedronGeometry(0.8, 1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00ffd1,
            emissive: 0x00ffd1,
            emissiveIntensity: 3,
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Add a point light to the cursor mesh
        const light = new THREE.PointLight(0x00ffd1, 5, 20);
        mesh.add(light);

        animatedObjects.push({ mesh: mesh, type: 'cursorFollower' });
        return mesh;
    };

    const cursorFollower = createCursorFollower();

    // Mouse interaction
    const mouse = { x: 0, y: 0 };
    let targetCameraX = 0;
    let targetCameraY = 5;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

        targetCameraX = mouse.x * 5;
        targetCameraY = 5 + mouse.y * 3;

        // Interactive reactivity for planet and rings
        if (planet) {
            planet.userData.targetRotationX = mouse.y * 0.5;
            planet.userData.targetRotationZ = -mouse.x * 0.5;
        }
    });

    // Initialize planet user data
    planet.userData.targetRotationX = 0;
    planet.userData.targetRotationZ = 0;

    // Scroll/wheel zoom
    container.addEventListener('wheel', (event) => {
        event.preventDefault();
        camera.position.z += event.deltaY * 0.02;
        camera.position.z = Math.max(15, Math.min(40, camera.position.z));
    });

    // Animation loop
    let time = 0;
    let animationId;

    function animate() {
        animationId = requestAnimationFrame(animate);
        time += 0.01;

        // Animate each object based on its type
        animatedObjects.forEach((obj, index) => {
            const mesh = obj.mesh;

            switch (obj.type) {
                case 'planet':
                    mesh.rotation.y = time * 0.2;
                    mesh.position.y = 5 + Math.sin(time * 0.5) * 0.3;
                    break;

                case 'ring':
                    mesh.rotation.z += 0.005;
                    mesh.position.y = 5 + Math.sin(time * 0.5) * 0.3;
                    break;

                case 'orb':
                    const userData = mesh.userData;
                    userData.angle += userData.speed * 0.01;
                    mesh.position.x = Math.cos(userData.angle) * userData.distance;
                    mesh.position.z = Math.sin(userData.angle) * userData.distance;
                    mesh.position.y = userData.height + Math.sin(time * 2 + index) * 0.5;
                    mesh.rotation.y += 0.02;

                    // Pulse glow
                    userData.glowPulse += 0.05;
                    if (mesh.children[0]) {
                        mesh.children[0].material.opacity = 0.3 + Math.sin(userData.glowPulse) * 0.2;
                    }
                    break;

                case 'crystal':
                    const crystalData = mesh.userData;
                    mesh.position.y += Math.sin(time * crystalData.floatSpeed + crystalData.floatOffset) * 0.01;
                    mesh.rotation.x += crystalData.rotationSpeed.x;
                    mesh.rotation.y += crystalData.rotationSpeed.y;
                    mesh.rotation.z += crystalData.rotationSpeed.z;
                    break;

                case 'stars':
                    mesh.rotation.y += 0.0002;
                    break;

                case 'dust':
                    mesh.rotation.y += 0.0005;
                    mesh.rotation.x += 0.0003;
                    break;

                case 'distantRing':
                    mesh.rotation.z += mesh.userData.rotationSpeed;
                    mesh.rotation.y += mesh.userData.rotationSpeed * 0.5;
                    break;

                case 'cursorFollower':
                    // Map mouse to 3D space
                    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
                    vector.unproject(camera);
                    const dir = vector.sub(camera.position).normalize();
                    const distance_val = -camera.position.z / dir.z;
                    const pos = camera.position.clone().add(dir.multiplyScalar(distance_val));

                    mesh.position.lerp(pos, 0.1);
                    mesh.rotation.x += 0.05;
                    mesh.rotation.y += 0.05;
                    mesh.scale.setScalar(1 + Math.sin(time * 5) * 0.2);
                    break;
            }
        });

        // Specific reactivity for planet
        if (planet) {
            planet.rotation.x = THREE.MathUtils.lerp(planet.rotation.x, planet.userData.targetRotationX, 0.05);
            planet.rotation.z = THREE.MathUtils.lerp(planet.rotation.z, planet.userData.targetRotationZ, 0.05);
        }

        // Animate lights
        cyanLight.position.x = Math.sin(time * 0.5) * 15;
        cyanLight.position.z = Math.cos(time * 0.5) * 15;
        cyanLight.intensity = 2 + Math.sin(time * 2) * 0.5;

        pinkLight.position.x = Math.cos(time * 0.7) * 15;
        pinkLight.position.z = Math.sin(time * 0.7) * 15;
        pinkLight.intensity = 2 + Math.cos(time * 2) * 0.5;

        // Smooth camera movement
        camera.position.x += (targetCameraX - camera.position.x) * 0.05;
        camera.position.y += (targetCameraY - camera.position.y) * 0.05;
        camera.lookAt(0, 5, 0);

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
    module.exports = initCosmicScene;
}
