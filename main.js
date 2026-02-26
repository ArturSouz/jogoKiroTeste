/**
 * Software Dev Management Game
 * Main entry point
 */

import { GameEngine } from './core/GameEngine.js';

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function init() {
    const canvas = document.getElementById('gameCanvas');
    const engine = new GameEngine(canvas);
    
    engine.init();
    engine.start();
    
    console.log('=== Game Started ===');
    console.log('Click on establishments to view systems');
    console.log('Click on activities to assign agents');
    console.log('Create agents to work on activities');
}
