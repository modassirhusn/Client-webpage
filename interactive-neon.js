/**
 * interactive-neon.js
 * A Three.js based neon background with interactive floating geometries.
 */

function initNeonBackground() {
    const container = document.getElementById('neon-bg');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Light Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00ffd1, 2, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    // Geometries - Restored all shapes
    const geometries = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.TorusGeometry(1.5, 0.4, 16, 100),
        new THREE.OctahedronGeometry(2),
        new THREE.SphereGeometry(1.5, 32, 32)
    ];

    const material = new THREE.MeshStandardMaterial({
        color: 0x00ffd1,
        emissive: 0x00ffd1,
        emissiveIntensity: 2,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
    });

    const objects = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const mesh = new THREE.Mesh(geo, material.clone());

        // Random position
        mesh.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 50
        );

        // Random rotation
        mesh.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );

        // Store initial data
        mesh.userData = {
            originalPos: mesh.position.clone(),
            rotationSpeed: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            velocity: new THREE.Vector3(0, 0, 0)
        };

        scene.add(mesh);
        objects.push(mesh);
    }

    // Mouse Tracking
    const mouse = new THREE.Vector2(-1000, -1000);

    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Update mouse position in 3D space (approximate z-plane)
        const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        pointLight.position.lerp(pos, 0.1);

        objects.forEach(obj => {
            // Apply constant rotation
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;

            // Interaction: Pushing away from mouse
            const dist = obj.position.distanceTo(pos);
            const forceLimit = 25;

            if (dist < forceLimit) {
                const force = (forceLimit - dist) / forceLimit;
                const direction = new THREE.Vector3().subVectors(obj.position, pos).normalize();

                // Add to velocity
                obj.userData.velocity.add(direction.multiplyScalar(force * 0.5));

                // Increase rotation speed temporarily
                obj.rotation.x += force * 0.1;
                obj.rotation.y += force * 0.1;

                // Pulsing emissive
                obj.material.emissiveIntensity = 2 + force * 5;
            } else {
                // Return to base emissive
                obj.material.emissiveIntensity = THREE.MathUtils.lerp(obj.material.emissiveIntensity, 2, 0.05);
            }

            // Apply velocity and drag
            obj.position.add(obj.userData.velocity);
            obj.userData.velocity.multiplyScalar(0.95);

            // Returning to original position (gentle spring)
            const returnForce = obj.userData.originalPos.clone().sub(obj.position).multiplyScalar(0.01);
            obj.position.add(returnForce);
        });

        renderer.render(scene, camera);
    }

    animate();
}

// Export if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = initNeonBackground;
}
