/**
 * ARCHITECT PRIME - PHYSICS & BALLISTICS
 * Implements Drag, Magnus Effect, and Elastic Collisions.
 */

class BaseballPhysics {
    constructor() {
        // Physical Constants (SI Units)
        this.G = 9.80665;        // Gravity (m/s^2)
        this.RHO = 1.225;       // Air density at sea level (kg/m^3)
        this.CIRC = 0.232;      // Ball circumference (meters)
        this.MASS = 0.145;      // Ball mass (kg)
        this.AREA = 0.00426;    // Cross-sectional area (m^2)
        this.CD = 0.35;         // Drag coefficient (approx for baseball)
    }

    /**
     * Magnus Force Calculation:
     * $$F_M = \frac{1}{2} C_L \rho A v^2 \frac{\omega \times v}{|\omega \times v|}$$
     * Where C_L is the lift coefficient derived from spin rate.
     */
    calculateMagnusForce(velocity, spin) {
        const speed = velocity.length();
        if (speed < 0.1) return new THREE.Vector3(0, 0, 0);

        // Spin parameter (S) = (radius * angular_velocity) / velocity
        const radius = this.CIRC / (2 * Math.PI);
        const spinParameter = (radius * spin.length()) / speed;
        const CL = 1.5 * spinParameter; // Linear approximation for MLB ranges

        const forceMag = 0.5 * CL * this.RHO * this.AREA * Math.pow(speed, 2);
        
        // Direction is the cross product of spin axis and velocity
        const forceDir = new THREE.Vector3().crossVectors(spin, velocity).normalize();
        return forceDir.multiplyScalar(forceMag);
    }

    /**
     * Trajectory Integration (Runge-Kutta 4 or Semi-Implicit Euler)
     * Calculated every frame for the ball's position.
     */
    computeStep(ball, dt) {
        const vel = ball.velocity;
        const speed = vel.length();

        // 1. Drag Force: Fd = -1/2 * Cd * rho * A * v^2
        const dragMag = 0.5 * this.CD * this.RHO * this.AREA * Math.pow(speed, 2);
        const dragForce = vel.clone().normalize().multiplyScalar(-dragMag);

        // 2. Magnus Force (The Break)
        const magnusForce = this.calculateMagnusForce(vel, ball.spin);

        // 3. Gravity Force
        const gravityForce = new THREE.Vector3(0, -this.G * this.MASS, 0);

        // Net Acceleration: a = F / m
        const netForce = new THREE.Vector3()
            .add(dragForce)
            .add(magnusForce)
            .add(gravityForce);
        
        const acceleration = netForce.divideScalar(this.MASS);

        // Update Velocity & Position
        ball.velocity.add(acceleration.multiplyScalar(dt));
        ball.position.add(ball.velocity.clone().multiplyScalar(dt));

        // Ground Collision Check
        if (ball.position.y < 0.1) {
            ball.position.y = 0.1;
            ball.velocity.y *= -0.5; // Simple bounce damping
            ball.velocity.multiplyScalar(0.9); // Friction
        }
    }

    /**
     * Bat-Ball Collision (Impulse-Based)
     * Handles exit velocity and launch angle.
     */
    resolveHit(ball, batVelocity, swingPlane) {
        // COR (Coefficient of Restitution) - approx 0.55 for wood bats
        const COR = 0.55;
        
        // exit_vel = (pitch_vel * COR) + bat_speed * (1 + COR)
        // Simplified vector reflection with momentum transfer
        const relativeVel = ball.velocity.clone().sub(batVelocity);
        const impulse = relativeVel.multiplyScalar(-(1 + COR) * 0.5);
        
        ball.velocity.add(impulse);
        
        // Add "Backspin" based on swing plane for lift
        ball.spin.set(swingPlane.x * 200, 0, 0); 
    }
}

export { BaseballPhysics };

