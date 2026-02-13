/**
 * ARCHITECT PRIME - MASTER BOOTSTRAP
 * Integrates all modules and initiates the 2026 MLB season simulation.
 */

import { BaseballEngine } from './main.js';
import { MLB_REGISTRY } from './teamData.js';
import { BaseballPhysics } from './physics.js';
import { StadiumGenerator } from './stadium.js';
import { PlayerManager } from './playerEngine.js';
import { GameControls } from './controls.js';
import { GameState } from './gameState.js';

class MLBPrimeApp {
    constructor() {
        this.engine = new BaseballEngine();
        this.physics = new BaseballPhysics();
        this.state = new GameState();
        this.stadium = new StadiumGenerator(this.engine.scene);
        this.players = new PlayerManager(this.engine.scene, this.engine.mixer);
        
        this.init();
    }

    async init() {
        // 1. Prepare Athletes (Asynchronous GLTF load)
        await this.players.loadBaseModel();

        // 2. Setup Controls
        this.controls = new GameControls(this.engine, this.physics, this.players);

        // 3. Define the 2026 Game Loop
        this.engine.setUpdateCallback((delta) => this.update(delta));

        console.log("Architect Prime: Systems Online. 2026 Season Ready.");
    }

    /**
     * The Master Loop: Decouples Physics from Rendering
     * Ensures consistent ball flight at any frame rate.
     */
    update(delta) {
        // A. Update Physics (Multiple sub-steps for precision)
        const subSteps = 4;
        const subDelta = delta / subSteps;
        for(let i = 0; i < subSteps; i++) {
            this.physics.computeStep(this.engine.ball, subDelta);
            this.checkCollisions();
        }

        // B. Update Player AI & Controls
        this.controls.updateFielding(delta);
        
        // C. Update 2026 Rule Constraints (ABS System)
        if (this.state.isABSChallenged) {
            this.processABSChallenge();
        }
    }

    /**
     * Core Match Initialization
     * Loads the specific stadium and rosters for the selected matchup.
     */
    initMatch(homeTeamID, awayTeamID) {
        const homeData = MLB_REGISTRY[homeTeamID];
        
        // Generate the specific 3D field (e.g., Yankee Stadium vs Fenway)
        this.stadium.generate(homeTeamID, homeData);
        
        // Spawn Pitcher and Batter
        this.players.spawnPlayer(homeTeamID, homeData.roster[2].id, new THREE.Vector3(0, 0, 0)); // Pitcher
        this.players.spawnPlayer(awayTeamID, "ohtani17", new THREE.Vector3(0, 0, 18.44)); // Batter
        
        this.engine.setCameraView('PITCHING');
    }

    processABSChallenge() {
        // Hawk-Eye logic: Check if ball center (x,y) was inside strike zone 2D plane
        const isStrike = this.physics.checkStrikeZone(this.engine.ball);
        this.state.resolveChallenge(isStrike);
        this.state.isABSChallenged = false;
    }
}

// Global Launch
window.mlbApp = new MLBPrimeApp();

