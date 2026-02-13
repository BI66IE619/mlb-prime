/**
 * ARCHITECT PRIME - STADIUM GENERATOR
 * Generates unique MLB field geometry based on team-specific dimensions.
 */

class StadiumGenerator {
    constructor(scene) {
        this.scene = scene;
        this.wallMaterial = new THREE.MeshStandardMaterial({ color: 0x013220, roughness: 0.8 });
        this.grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
    }

    /**
     * Builds a team-specific stadium.
     * @param {string} teamID - e.g., 'BOS', 'NYY'
     */
    generate(teamID, teamData) {
        const d = teamData.dim; // {lf, cf, rf}
        
        // 1. Create Infield/Outfield Surface
        const fieldGeo = new THREE.CircleGeometry(this.ftToM(450), 64);
        const field = new THREE.Mesh(fieldGeo, this.grassMaterial);
        field.rotation.x = -Math.PI / 2;
        field.receiveShadow = true;
        this.scene.add(field);

        // 2. Procedural Wall Construction
        // We use a Quadratic Bezier Curve to interpolate between LF, CF, and RF points.
        const wallPath = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(-this.ftToM(d.lf), 0, this.ftToM(d.lf)), // LF Pole
            new THREE.Vector3(0, 0, this.ftToM(d.cf + 20)),            // CF "Apex"
            new THREE.Vector3(this.ftToM(d.rf), 0, this.ftToM(d.rf))   // RF Pole
        );

        // Extrude the wall based on height (Handle Fenway/Green Monster logic)
        const wallHeight = (teamID === 'BOS') ? this.ftToM(37) : this.ftToM(8);
        
        const points = wallPath.getPoints(50);
        const wallGeo = new THREE.BufferGeometry().setFromPoints(points);
        
        // Create the wall mesh using a simple extrusion of the path
        const wallMesh = this.createWallMesh(points, wallHeight);
        this.scene.add(wallMesh);
        
        this.addFoulPoles(d);
    }

    createWallMesh(points, height) {
        const vertices = [];
        const indices = [];

        points.forEach((p, i) => {
            // Bottom vertex
            vertices.push(p.x, 0, p.z);
            // Top vertex
            vertices.push(p.x, height, p.z);

            if (i < points.length - 1) {
                const base = i * 2;
                indices.push(base, base + 1, base + 2);
                indices.push(base + 1, base + 3, base + 2);
            }
        });

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();

        return new THREE.Mesh(geo, this.wallMaterial);
    }

    addFoulPoles(d) {
        const poleGeo = new THREE.CylinderGeometry(0.2, 0.2, 20);
        const poleMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        const lfPole = new THREE.Mesh(poleGeo, poleMat);
        lfPole.position.set(-this.ftToM(d.lf), 10, this.ftToM(d.lf));
        
        const rfPole = new THREE.Mesh(poleGeo, poleMat);
        rfPole.position.set(this.ftToM(d.rf), 10, this.ftToM(d.rf));
        
        this.scene.add(lfPole, rfPole);
    }

    ftToM(ft) { return ft * 0.3048; }
}

export { StadiumGenerator };

