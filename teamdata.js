/**
 * ARCHITECT PRIME - MLB COMPREHENSIVE REGISTRY (2026 SEASON)
 * High-performance data structure for 30-team simulation.
 */

const TEAMS = {
    // --- AL EAST ---
    BAL: { name: "Orioles", city: "Baltimore", color: "#DF4601", stadium: "Oriole Park", dim: {lf:333, cf:410, rf:318}, jerseys: ["Home", "Away", "City Connect"] },
    BOS: { name: "Red Sox", city: "Boston", color: "#BD3039", stadium: "Fenway Park", dim: {lf:310, cf:390, rf:302}, jerseys: ["Home", "Away", "Yellow CC"] },
    NYY: { name: "Yankees", city: "New York", color: "#002D72", stadium: "Yankee Stadium", dim: {lf:318, cf:408, rf:314}, jerseys: ["Home", "Away"] },
    TB: { name: "Rays", city: "Tampa Bay", color: "#092C5C", stadium: "Tropicana Field", dim: {lf:315, cf:404, rf:322}, jerseys: ["Home", "Away", "Grit CC"] },
    TOR: { name: "Blue Jays", city: "Toronto", color: "#134A8E", stadium: "Rogers Centre", dim: {lf:328, cf:400, rf:328}, jerseys: ["Home", "Away", "Night Jay CC"] },

    // --- AL CENTRAL ---
    CWS: { name: "White Sox", city: "Chicago", color: "#27251F", stadium: "Guaranteed Rate Field", dim: {lf:330, cf:400, rf:335}, jerseys: ["Home", "Away", "Southside CC"] },
    CLE: { name: "Guardians", city: "Cleveland", color: "#00385D", stadium: "Progressive Field", dim: {lf:325, cf:400, rf:325}, jerseys: ["Home", "Away", "City Connect"] },
    DET: { name: "Tigers", city: "Detroit", color: "#0C2340", stadium: "Comerica Park", dim: {lf:342, cf:412, rf:330}, jerseys: ["Home", "Away", "Motor City CC"] },
    KC: { name: "Royals", city: "Kansas City", color: "#004687", stadium: "Kauffman Stadium", dim: {lf:330, cf:410, rf:330}, jerseys: ["Home", "Away", "Fountain CC"] },
    MIN: { name: "Twins", city: "Minnesota", color: "#002B5C", stadium: "Target Field", dim: {lf:339, cf:404, rf:328}, jerseys: ["Home", "Away", "Lake CC"] },

    // --- AL WEST ---
    HOU: { name: "Astros", city: "Houston", color: "#002D62", stadium: "Daikin Park", dim: {lf:315, cf:409, rf:326}, jerseys: ["Home", "Away", "Space City CC"] },
    LAA: { name: "Angels", city: "Anaheim", color: "#BA0021", stadium: "Angel Stadium", dim: {lf:330, cf:400, rf:330}, jerseys: ["Home", "Away", "Surf CC"] },
    ATH: { name: "Athletics", city: "Sacramento", color: "#003831", stadium: "Sutter Health Park", dim: {lf:330, cf:400, rf:330}, jerseys: ["Home", "Away", "Gold V2"] },
    SEA: { name: "Mariners", city: "Seattle", color: "#0C2C56", stadium: "T-Mobile Park", dim: {lf:331, cf:401, rf:326}, jerseys: ["Home", "Away", "City Connect"] },
    TEX: { name: "Rangers", city: "Arlington", color: "#003278", stadium: "Globe Life Field", dim: {lf:329, cf:407, rf:326}, jerseys: ["Home", "Away", "2026 CC"] },

    // --- NL EAST ---
    ATL: { name: "Braves", city: "Atlanta", color: "#13274F", stadium: "Truist Park", dim: {lf:335, cf:400, rf:325}, jerseys: ["Home", "Away", "The A CC"] },
    MIA: { name: "Marlins", city: "Miami", color: "#00A3E0", stadium: "LoanDepot Park", dim: {lf:344, cf:400, rf:335}, jerseys: ["Home", "Away", "Sugar Kings CC"] },
    NYM: { name: "Mets", city: "New York", color: "#002D72", stadium: "Citi Field", dim: {lf:335, cf:408, rf:330}, jerseys: ["Home", "Away", "NYC CC"] },
    PHI: { name: "Phillies", city: "Philadelphia", color: "#E81828", stadium: "Citizens Bank Park", dim: {lf:329, cf:401, rf:330}, jerseys: ["Home", "Away", "City Connect"] },
    WSH: { name: "Nationals", city: "Washington", color: "#AB0003", stadium: "Nationals Park", dim: {lf:337, cf:402, rf:335}, jerseys: ["Home", "Away", "Bloom CC"] },

    // --- NL CENTRAL ---
    CHC: { name: "Cubs", city: "Chicago", color: "#0E3386", stadium: "Wrigley Field", dim: {lf:355, cf:400, rf:353}, jerseys: ["Home", "Away", "Wrigleyville CC"] },
    CIN: { name: "Reds", city: "Cincinnati", color: "#C6011F", stadium: "Great American Ball Park", dim: {lf:328, cf:404, rf:325}, jerseys: ["Home", "Away", "City Connect"] },
    MIL: { name: "Brewers", city: "Milwaukee", color: "#12284B", stadium: "American Family Field", dim: {lf:344, cf:400, rf:345}, jerseys: ["Home", "Away", "Brew Crew CC"] },
    PIT: { name: "Pirates", city: "Pittsburgh", color: "#27251F", stadium: "PNC Park", dim: {lf:325, cf:399, rf:320}, jerseys: ["Home", "Away", "PGH CC"] },
    STL: { name: "Cardinals", city: "St. Louis", color: "#C41E3A", stadium: "Busch Stadium", dim: {lf:336, cf:400, rf:335}, jerseys: ["Home", "Away", "The Lou CC"] },

    // --- NL WEST ---
    ARI: { name: "Diamondbacks", city: "Phoenix", color: "#A71930", stadium: "Chase Field", dim: {lf:330, cf:407, rf:334}, jerseys: ["Home", "Away", "Serpientes CC"] },
    COL: { name: "Rockies", city: "Denver", color: "#333366", stadium: "Coors Field", dim: {lf:347, cf:415, rf:350}, jerseys: ["Home", "Away", "Mountain CC"] },
    LAD: { name: "Dodgers", city: "Los Angeles", color: "#005A9C", stadium: "Dodger Stadium", dim: {lf:330, cf:395, rf:330}, jerseys: ["Home", "Away", "Los Dodgers V2"] },
    SD: { name: "Padres", city: "San Diego", color: "#2F241D", stadium: "Petco Park", dim: {lf:334, cf:396, rf:322}, jerseys: ["Home", "Away", "2026 CC"] },
    SF: { name: "Giants", city: "San Francisco", color: "#FD5A1E", stadium: "Oracle Park", dim: {lf:339, cf:391, rf:309}, jerseys: ["Home", "Away", "Fog City CC"] }
};

/**
 * Dynamic Asset Resolver
 * Maps team IDs to official MLB static assets for logos and jersey patterns.
 */
const getTeamLogo = (id) => `https://www.mlbstatic.com/team-logos/${id}.svg`;

export { TEAMS, getTeamLogo };
