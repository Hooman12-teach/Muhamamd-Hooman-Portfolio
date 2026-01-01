// Three.js 3D Models Setup

// Hero Section 3D Model
function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create geometric shapes
    const geometry1 = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const material1 = new THREE.MeshStandardMaterial({ 
        color: 0x01eefe,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x01eefe,
        emissiveIntensity: 0.3
    });
    const torus = new THREE.Mesh(geometry1, material1);
    scene.add(torus);

    const geometry2 = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const material2 = new THREE.MeshStandardMaterial({ 
        color: 0x01eefe,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6
    });
    const cube = new THREE.Mesh(geometry2, material2);
    cube.position.set(2, 0, 0);
    scene.add(cube);

    const geometry3 = new THREE.OctahedronGeometry(1);
    const material3 = new THREE.MeshStandardMaterial({ 
        color: 0x01eefe,
        metalness: 0.6,
        roughness: 0.4,
        wireframe: true
    });
    const octahedron = new THREE.Mesh(geometry3, material3);
    octahedron.position.set(-2, 0, 0);
    scene.add(octahedron);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x01eefe, 1, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x01eefe, 0.5, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Animation
    function animate() {
        requestAnimationFrame(animate);

        torus.rotation.x += 0.01;
        torus.rotation.y += 0.01;
        cube.rotation.x += 0.02;
        cube.rotation.y += 0.02;
        octahedron.rotation.x -= 0.015;
        octahedron.rotation.y -= 0.015;

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    animate();
}

// About Section 3D Model
function initAbout3D() {
    const container = document.getElementById('about-3d-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Create sphere
    const geometry = new THREE.SphereGeometry(1.5, 32, 32);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0x01eefe,
        metalness: 0.7,
        roughness: 0.3,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add inner geometry
    const innerGeometry = new THREE.IcosahedronGeometry(1, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x01eefe,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5
    });
    const icosahedron = new THREE.Mesh(innerGeometry, innerMaterial);
    scene.add(icosahedron);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x01eefe, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 4;

    function animate() {
        requestAnimationFrame(animate);

        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.01;
        icosahedron.rotation.x -= 0.01;
        icosahedron.rotation.y -= 0.005;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    animate();
}

// Work Item 3D Models
function initWork3D(containerId, type = 'default') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(200, 200);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    let mesh;

    switch(type) {
        case 'ui':
            const uiGeometry = new THREE.BoxGeometry(1, 1, 1);
            const uiMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x667eea,
                metalness: 0.6,
                roughness: 0.4
            });
            mesh = new THREE.Mesh(uiGeometry, uiMaterial);
            break;
        case 'ux':
            const uxGeometry = new THREE.ConeGeometry(0.8, 1.5, 8);
            const uxMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x01eefe,
                metalness: 0.7,
                roughness: 0.3
            });
            mesh = new THREE.Mesh(uxGeometry, uxMaterial);
            break;
        case 'web':
            const webGeometry = new THREE.CylinderGeometry(0.7, 0.7, 1.2, 8);
            const webMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x764ba2,
                metalness: 0.5,
                roughness: 0.5
            });
            mesh = new THREE.Mesh(webGeometry, webMaterial);
            break;
        default:
            const defaultGeometry = new THREE.TetrahedronGeometry(1);
            const defaultMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x01eefe,
                metalness: 0.8,
                roughness: 0.2
            });
            mesh = new THREE.Mesh(defaultGeometry, defaultMaterial);
    }

    scene.add(mesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x01eefe, 0.8, 100);
    pointLight.position.set(2, 2, 2);
    scene.add(pointLight);

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }

    animate();
}

// Initialize all 3D models when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for containers to be properly sized
    setTimeout(() => {
        initHero3D();
        initAbout3D();
        
        // Initialize work item 3D models
        initWork3D('work-3d-1', 'ui');
        initWork3D('work-3d-2', 'ux');
        initWork3D('work-3d-3', 'ui');
        initWork3D('work-3d-4', 'web');
        initWork3D('work-3d-5', 'ux');
        initWork3D('work-3d-6', 'web');
    }, 500);
});

