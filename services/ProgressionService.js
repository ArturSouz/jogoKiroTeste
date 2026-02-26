// ProgressionService - Handles unlocks and progression
export class ProgressionService {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Check for unlocks
   * @returns {Object|null} - Unlocked establishment or null
   */
  checkUnlocks() {
    // Check each unlocked establishment
    for (const establishment of this.gameState.establishments) {
      if (establishment.isUnlocked && establishment.isFullyCompleted()) {
        // Try to unlock next establishment
        return this.unlockNextEstablishment();
      }
    }
    return null;
  }

  /**
   * Unlock next locked establishment
   * @returns {Establishment|null} - Unlocked establishment or null
   */
  unlockNextEstablishment() {
    const locked = this.gameState.establishments.find(e => !e.isUnlocked);
    
    if (locked) {
      locked.unlock();
      return locked;
    }
    
    return null;
  }

  /**
   * Check if there are locked establishments
   * @returns {boolean} - True if locked establishments exist
   */
  hasLockedEstablishments() {
    return this.gameState.establishments.some(e => !e.isUnlocked);
  }
}
