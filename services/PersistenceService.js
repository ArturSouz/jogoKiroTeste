// PersistenceService - Handles save/load
export class PersistenceService {
  constructor(gameState) {
    this.gameState = gameState;
    this.SAVE_KEY = 'software_dev_game_save';
  }

  /**
   * Save game to localStorage
   */
  saveGame() {
    try {
      const saveData = {
        player: this.gameState.player,
        agents: this.gameState.agents,
        establishments: this.gameState.establishments,
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
      return { success: true };
    } catch (error) {
      console.error('Failed to save game:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load game from localStorage
   * @returns {Object|null} - Loaded data or null
   */
  loadGame() {
    try {
      const saveData = localStorage.getItem(this.SAVE_KEY);
      
      if (!saveData) {
        return null;
      }
      
      return JSON.parse(saveData);
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * Check if save exists
   * @returns {boolean} - True if save exists
   */
  hasSavedGame() {
    return localStorage.getItem(this.SAVE_KEY) !== null;
  }

  /**
   * Clear save
   */
  clearSave() {
    localStorage.removeItem(this.SAVE_KEY);
  }
}
