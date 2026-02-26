// Agent entity - represents a worker that can complete activities
export class Agent {
  constructor(id, playerId, name) {
    this.id = id;
    this.playerId = playerId;
    this.name = name;
    this.version = 1;
    this.logicPoints = 1;
    this.dataStructurePoints = 1;
    this.abstractionPoints = 1;
    this.isBusy = false;
    this.currentActivityId = null;
  }

  /**
   * Upgrade logic attribute
   */
  upgradeLogic() {
    this.logicPoints++;
    this.version++;
  }

  /**
   * Upgrade data structure attribute
   */
  upgradeDataStructure() {
    this.dataStructurePoints++;
    this.version++;
  }

  /**
   * Upgrade abstraction attribute
   */
  upgradeAbstraction() {
    this.abstractionPoints++;
    this.version++;
  }

  /**
   * Assign agent to an activity
   * @param {string} activityId - ID of the activity
   */
  assignToActivity(activityId) {
    this.isBusy = true;
    this.currentActivityId = activityId;
  }

  /**
   * Mark agent as available after completing work
   */
  completeWork() {
    this.isBusy = false;
    this.currentActivityId = null;
  }

  /**
   * Check if agent is available for assignment
   * @returns {boolean} - True if available
   */
  isAvailable() {
    return !this.isBusy;
  }
}
