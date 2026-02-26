// Establishment entity - container for systems
export class Establishment {
  constructor(id, name, isUnlocked = false) {
    this.id = id;
    this.name = name;
    this.isUnlocked = isUnlocked;
    this.systems = [];
  }

  /**
   * Add system to establishment
   * @param {System} system - System to add
   */
  addSystem(system) {
    this.systems.push(system);
  }

  /**
   * Unlock establishment
   */
  unlock() {
    this.isUnlocked = true;
  }

  /**
   * Check if all systems are fully completed
   * @returns {boolean} - True if fully completed
   */
  isFullyCompleted() {
    return this.systems.length > 0 && this.systems.every(sys => sys.isFullyCompleted());
  }
}
