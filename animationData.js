/**
 * ARCHITECT PRIME - KINEMATIC REGISTRY
 * Defines raw keyframe tracks for skeletal animation.
 */

const BASEBALL_ANIMS = {
    /**
     * Pitching Delivery (Windup -> Release -> Follow-through)
     * Time is in seconds.
     */
    PITCH_WINDUP: {
        duration: 2.1,
        tracks: [
            {
                name: ".bones[RightArm].quaternion",
                times: [0, 0.5, 1.0, 1.5, 2.1],
                values: [
                    0, 0, 0, 1,           // Neutral
                    -0.5, 0.5, 0, 0.7,    // Back-back
                    0.7, 0, 0, 0.7,       // Cocked
                    -0.9, 0, 0, 0.1,      // Release
                    -0.3, 0.2, 0, 0.9     // Follow
                ]
            },
            {
                name: ".bones[LeftLeg].quaternion",
                times: [0, 0.8, 1.5],
                values: [0,0,0,1, 0.6,0,0,0.8, 0,0,0,1] // Kick
            }
        ]
    },

    /**
     * Batting Swing (Load -> Contact -> Extension)
     */
    BAT_SWING: {
        duration: 0.6,
        tracks: [
            {
                name: ".bones[Hips].quaternion",
                times: [0, 0.2, 0.4, 0.6],
                values: [
                    0, 0.2, 0, 0.98,  // Load (Turn away)
                    0, 0, 0, 1,       // Neutral
                    0, -0.6, 0, 0.8,  // Contact (Hip fire)
                    0, -0.8, 0, 0.6   // Extension
                ]
            }
        ]
    }
};

class AnimationFactory {
    /**
     * Converts raw registry data into Three.js AnimationClips.
     */
    static createClip(animKey) {
        const data = BASEBALL_ANIMS[animKey];
        const tracks = data.tracks.map(t => {
            return new THREE.QuaternionKeyframeTrack(t.name, t.times, t.values);
        });
        return new THREE.AnimationClip(animKey, data.duration, tracks);
    }

    /**
     * Stat-Adjusted Playback
     * Higher "vel" or "spd" stats result in a faster timeScale.
     */
    static getAdjustedRate(baseRate, statValue) {
        // Linear scaling: 99 stat = 1.2x speed, 50 stat = 0.8x speed
        return baseRate * (0.5 + (statValue / 100));
    }
}

export { BASEBALL_ANIMS, AnimationFactory };

