/**
 * ARCHITECT PRIME - MLB ABSOLUTE ENGINE
 * Core Render Pipeline & Scene Management
 */

class BaseballEngine {
    constructor() {
        this.canvas = document.getElementById('render-target');
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.clock = new THREE.Clock();
        this.entities = { players: [], stadium: null, ball: null };
        
        this.init();
    }

    init() {
        // 1. Renderer Configuration (High Fidelity)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;

        // 2. Scene & Environment
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // 3. Lighting Rig (Day/Night Stadium setup)
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambient);

        const stadiumLights = new THREE.DirectionalLight(0xffffff, 2.5);
        stadiumLights.position.set(50, 100, 50);
        stadiumLights.castShadow = true;
        stadiumLights.shadow.mapSize.set(2048, 2048);
        stadiumLights.shadow.camera.far = 500;
        this.scene.add(stadiumLights);

        // 4. Camera Setup (Broadcast Perspective)
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.setCameraView('PITCHING');

        // 5. Lifecycle Management
        window.addEventListener('resize', () => this.onResize());
        this.animate();
    }

    setCameraView(type) {
        const views = {
            'PITCHING': { pos: [0, 1.5, 18], look: [0, 1, 0] },
            'BATTING': { pos: [0, 2.2, -6], look: [0, 1, 15] },
            'FIELDING': { pos: [30, 40, 30], look: [0, 0, 0] }
        };
        const v = views[type];
        gsap.to(this.camera.position, {
            x: v.pos[0], y: v.pos[1], z: v.pos[2],
            duration: 1.5, ease: "expo.inOut"
        });
        this.camera.lookAt(...v.look);
    }

    // Mathematical Rigor: The Render Loop O(n) where n = entities
    animate() {
        requestAnimationFrame(() => this.animate());
        const delta = this.clock.getDelta();

        // Update Physics (Hook for physics.js)
        if (this.physicsWorld) {
            this.physicsWorld.step(1/60, delta);
        }

        // Update Entities (Animations, Uniforms)
        this.entities.players.forEach(p => p.update(delta));

        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Instantiate the Core
const engine = new BaseballEngine();

