/**
 * ARCHITECT PRIME - UI & STATE MANAGER
 * Handles Glassmorphism, Menu Orchestration, and Roster Injection.
 */

class UIManager {
    constructor(gameEngine) {
        this.engine = gameEngine;
        this.selectedTeam = 'NYY';
        this.selectedJersey = 'HOME';
        this.currentScreen = 'INTRO';
    }

    /**
     * Initializes the Menu Orchestration.
     * Uses GSAP for "smooth-entry" UI transitions.
     */
    init() {
        this.showIntro();
    }

    showIntro() {
        // Logic to play logo animation (from index.html)
        gsap.to("#intro-logo", { 
            scale: 1.1, 
            duration: 2, 
            repeat: -1, 
            yoyo: true, 
            ease: "sine.inOut" 
        });
    }

    /**
     * Team Selection Logic: Renders all 30 MLB Teams
     * Dynamically pulls Logos from MLB's 2026 Static CDN.
     */
    renderTeamSelection() {
        const container = document.getElementById('team-grid');
        container.innerHTML = ''; // Clear previous

        Object.keys(TEAMS).forEach(id => {
            const team = TEAMS[id];
            const card = document.createElement('div');
            card.className = 'team-card glass-panel';
            card.style.borderTop = `4px solid ${team.color}`;
            
            card.innerHTML = `
                <img src="https://www.mlbstatic.com/team-logos/${id}.svg" class="team-logo">
                <h3>${team.city}</h3>
                <p>${team.name}</p>
            `;

            card.onclick = () => this.selectTeam(id);
            container.appendChild(card);
        });
    }

    /**
     * Jersey Selection: Handles Home, Away, and V2 City Connects.
     */
    renderJerseyOptions(teamID) {
        const team = TEAMS[teamID];
        const jerseyContainer = document.getElementById('jersey-selection');
        
        // 2026 Specific Logic: Every team has a CC, some have V2
        const options = ['HOME', 'AWAY', 'CITY_CONNECT'];
        if (team.hasCityConnectV2) options.push('CITY_CONNECT_V2');

        jerseyContainer.innerHTML = options.map(opt => `
            <button class="menu-btn" onclick="ui.setJersey('${opt}')">
                ${opt.replace('_', ' ')}
            </button>
        `).join('');
    }

    setJersey(type) {
        this.selectedJersey = type;
        console.log(`Jersey set to: ${type}`);
        // This hooks into playerEngine.js to update the shader uniforms
        this.engine.playerManager.updateJerseyType(type);
    }

    startMatch(mode) {
        this.currentScreen = 'GAMEPLAY';
        
        // transition: Close UI -> Load Stadium -> Position Players
        gsap.to(".glass-panel", { 
            opacity: 0, 
            y: 50, 
            duration: 0.8, 
            onComplete: () => {
                document.getElementById('ui-layer').style.display = 'none';
                this.engine.initMatch(this.selectedTeam);
            }
        });
    }
}

const ui = new UIManager(window.engine);

