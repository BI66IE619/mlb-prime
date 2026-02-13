/**
 * ARCHITECT PRIME - BROADCAST POST-PROCESSING
 * Implements Bloom, Film Grain, and Color Grading.
 */

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

class PostProcessor {
    constructor(renderer, scene, camera) {
        this.composer = new EffectComposer(renderer);
        this.composer.addPass(new RenderPass(scene, camera));

        // 1. Unreal Bloom: Creates that "Night Game" stadium light glow
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.6,  // Strength
            0.4,  // Radius
            0.85  // Threshold: Only bright lights glow
        );
        this.composer.addPass(bloomPass);

        // 2. Custom Film Grain Shader: Simulates a 4K broadcast camera
        const filmGrainShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "amount": { value: 0.05 },
                "time": { value: 0.0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                uniform float amount;
                uniform float time;
                uniform sampler2D tDiffuse;
                varying vec2 vUv;
                float random(vec2 co) {
                    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
                }
                void main() {
                    vec4 color = texture2D(tDiffuse, vUv);
                    float diff = (random(vUv + time) - 0.5) * amount;
                    gl_FragColor = vec4(color.rgb + diff, color.a);
                }`
        };

        this.grainPass = new ShaderPass(filmGrainShader);
        this.composer.addPass(this.grainPass);
    }

    render(delta) {
        this.grainPass.uniforms.time.value += delta;
        this.composer.render();
    }
}

export { PostProcessor };

