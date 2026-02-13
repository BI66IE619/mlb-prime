/**
 * ARCHITECT PRIME - CONTROL & INTERACTION SYSTEM
 * Manages Pitching, Batting, and Advanced Fielding (Diving, Cutoffs).
 */

class GameControls {
    constructor(engine, physics, players) {
        this.engine = engine;
        this.physics = physics;
        this.players = players;
        
        this.inputState = {
            isSwinging: false,
            pitchPower: 0,
            fieldingTarget: new THREE.Vector3(),
            keys: {}
        };

        this.initListeners();
    }

    initListeners() {
        // Keyboard mapping for Fielding/Running
        window.addEventListener('keydown', (e) => this.inputState.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.inputState.keys[e.code] = false);

        // Mouse/Touch for Pitching & Batting
        window.addEventListener('mousedown', (e) => this.handleActionStart(e));
        window.addEventListener('mouseup', (e) => this.handleActionEnd(e));
    }

    /**
     * Pitching & Batting Logic
     * Uses a Charge-up mechanic for Pitching and a Timing-window for Batting.
     */
    handleActionStart(e) {
        if (this.engine.gameState === 'PITCHING') {
            this.inputState.pitchPower = 0;
            this.chargeTimer = setInterval(() => {
                this.inputState.pitchPower = Math.min(this.inputState.pitchPower + 0.05, 1.0);
            }, 50);
        } else if (this.engine.gameState === 'BATTING') {
            this.executeSwing();
        }
    }

    handleActionEnd(e) {
        if (this.engine.gameState === 'PITCHING') {
            clearInterval(this.chargeTimer);
            this.executePitch(this.inputState.pitchPower);
        }
    }

    /**
     * Advanced Fielding Mechanics:
     * Logic for 'Running to Ball' and 'Throwing to Cutoff/Base'
     */
    updateFielding(delta) {
        const activeFielder = this.players.getActiveFielder();
        if (!activeFielder) return;

        // WASD Movement for Fielder
        const moveDir = new THREE.Vector3();
        if (this.inputState.keys['KeyW']) moveDir.z -= 1;
        if (this.inputState.keys['KeyS']) moveDir.z += 1;
        if (this.inputState.keys['KeyA']) moveDir.x -= 1;
        if (this.inputState.keys['KeyD']) moveDir.x += 1;

        if (moveDir.length() > 0) {
            moveDir.normalize().multiplyScalar(activeFielder.stats.spd * delta);
            activeFielder.instance.position.add(moveDir);
            this.players.transitionAnimation(activeFielder, 'SPRINT');
        }

        // Action Keys: Space = Dive, Shift = Throw to 1st
        if (this.inputState.keys['Space']) {
            this.players.transitionAnimation(activeFielder, 'DIVE');
            this.checkBallCapture(activeFielder);
        }
    }

    /**
     * Pitch Execution: Velocity calculation
     * $$v_{pitch} = v_{max} \times P_{power}$$
     */
    executePitch(power) {
        const pitcher = this.players.getPitcher();
        const maxVel = pitcher.stats.vel * 0.45; // m/s conversion
        const velocity = new THREE.Vector3(0, 0, -maxVel * power);
        
        this.physics.launchBall(velocity, new THREE.Vector3(0, 0, 500)); // 500 RPM backspin
        this.engine.gameState = 'BALL_IN_FLIGHT';
    }

    executeSwing() {
        const batter = this.players.getBatter();
        this.players.transitionAnimation(batter, 'SWING');
        
        // Physics check is handled by the main loop in physics.js
        // detecting the intersection of the Bat Mesh and Ball Mesh.
        this.inputState.isSwinging = true;
        setTimeout(() => this.inputState.isSwinging = false, 150);
    }
}

export { GameControls };

