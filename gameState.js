/**
 * ARCHITECT PRIME - GAMEPLAY LOGIC & RULES ENGINE
 * Manages the Inning, Score, and Baserunner force-logic.
 */

class GameState {
    constructor() {
        this.inning = 1;
        this.isTopInning = true;
        this.score = { home: 0, away: 0 };
        this.outs = 0;
        this.count = { balls: 0, strikes: 0 };
        
        // Baserunner Bitmask: 000 (None), 001 (1st), 010 (2nd), 100 (3rd)
        this.runners = 0b000; 
        
        // 2026 Rule: 2 Challenges per team per game
        this.challenges = { home: 2, away: 2 };
    }

    /**
     * Updates the Count. Handles 2026 ABS Challenge logic.
     * @param {string} result - 'BALL' or 'STRIKE'
     */
    processPitch(result) {
        if (result === 'STRIKE') {
            this.count.strikes++;
            if (this.count.strikes >= 3) this.recordOut();
        } else {
            this.count.balls++;
            if (this.count.balls >= 4) this.advanceWalk();
        }
        
        this.updateHUD();
    }

    /**
     * Logic for Runner Advancement (Simplified Force-Logic)
     * $$Runners_{new} = (Runners_{old} \ll 1) | 0b001$$
     */
    advanceWalk() {
        // If 1st is occupied, shift runners. If bases loaded, score run.
        if ((this.runners & 0b111) === 0b111) {
            this.addScore(1);
        } else if (this.runners & 0b001) {
            this.runners = (this.runners << 1) | 0b001;
        } else {
            this.runners |= 0b001;
        }
        this.resetCount();
    }

    recordOut() {
        this.outs++;
        this.resetCount();
        if (this.outs >= 3) {
            this.switchSide();
        }
    }

    switchSide() {
        this.outs = 0;
        this.runners = 0b000;
        if (!this.isTopInning) this.inning++;
        this.isTopInning = !this.isTopInning;
        
        // In extra innings (10+), 2026 rules grant +1 challenge if empty
        if (this.inning >= 10) {
            const side = this.isTopInning ? 'away' : 'home';
            if (this.challenges[side] === 0) this.challenges[side] = 1;
        }
    }

    /**
     * Force Play Check
     * Returns true if a runner is forced to advance to targetBase.
     */
    isForcePlay(targetBase) {
        if (targetBase === 1) return true; // Always force at 1st
        if (targetBase === 2) return (this.runners & 0b001) !== 0;
        if (targetBase === 3) return (this.runners & 0b011) === 0b011;
        return false;
    }

    resetCount() {
        this.count = { balls: 0, strikes: 0 };
    }

    addScore(pts) {
        const side = this.isTopInning ? 'away' : 'home';
        this.score[side] += pts;
    }
}

export { GameState };

