/**
 * ARCHITECT PRIME - ATHLETE SIMULATION ENGINE
 * Handles skeletal animation blending and dynamic jersey styling via GLSL.
 */

class PlayerManager {
    constructor(scene, animationSystem) {
        this.scene = scene;
        this.mixer = animationSystem; // Reference to main.js AnimationMixer
        this.baseModel = null;
        this.players = [];
    }

    /**
     * Loads the base GLTF athlete and prepares the "Dynamic Jersey" Shader.
     */
    async loadBaseModel() {
        const loader = new THREE.GLTFLoader();
        const gltf = await loader.loadAsync('assets/models/base_athlete.glb');
        this.baseModel = gltf.scene;
        
        // Inject Custom Shader for Color Swapping (Home/Away/City Connect)
        this.baseModel.traverse(child => {
            if (child.isMesh && child.name.includes("Jersey")) {
                this.applyJerseyShader(child);
            }
        });
    }

    /**
     * Mathematical Rigor: Linear Interpolation for Animation Blending
     * Blends between 'IDLE', 'SPRINT', and 'DIVING' states.
     */
    transitionAnimation(player, nextState, duration = 0.5) {
        const currentAction = player.actions[player.currentState];
        const nextAction = player.actions[nextState];

        nextAction.enabled = true;
        nextAction.setEffectiveTimeScale(1);
        nextAction.setEffectiveWeight(1);
        nextAction.crossFadeFrom(currentAction, duration, true);
        nextAction.play();
        player.currentState = nextState;
    }

    /**
     * Dynamic Jersey Styling
     * Swaps primary/secondary colors without re-loading textures.
     */
    applyJerseyShader(mesh) {
        mesh.material.onBeforeCompile = (shader) => {
            shader.uniforms.teamColorPrimary = { value: new THREE.Color(0x002D72) };
            shader.uniforms.teamColorSecondary = { value: new THREE.Color(0xFFFFFF) };
            
            shader.fragmentShader = shader.fragmentShader.replace(
                `#include <common>`,
                `#include <common>
                 uniform vec3 teamColorPrimary;
                 uniform vec3 teamColorSecondary;`
            );

            shader.fragmentShader = shader.fragmentShader.replace(
                `vec4 diffuseColor = vec4( diffuse, opacity );`,
                `
                // Mask logic: Use Red channel of texture to apply Primary, Blue for Secondary
                vec3 finalColor = mix(diffuse, teamColorPrimary, texture2D(map, vUv).r);
                finalColor = mix(finalColor, teamColorSecondary, texture2D(map, vUv).b);
                vec4 diffuseColor = vec4( finalColor, opacity );
                `
            );
        };
    }

    /**
     * Spawns a specific MLB player with accurate stats and visuals.
     */
    spawnPlayer(teamID, playerID, position) {
        const team = TEAMS[teamID];
        const playerData = team.roster.find(p => p.id === playerID);
        
        const instance = THREE.SkeletonUtils.clone(this.baseModel);
        instance.position.copy(position);
        
        // Update Shader Uniforms for this specific instance
        instance.traverse(child => {
            if (child.material && child.material.userData.shader) {
                child.material.userData.shader.uniforms.teamColorPrimary.value.set(team.color);
            }
        });

        this.scene.add(instance);
        return { instance, stats: playerData.stats, state: 'IDLE' };
    }
}

export { PlayerManager };

