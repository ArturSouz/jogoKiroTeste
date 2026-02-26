// Activity entity - base class for Bug and Enhancement
export class Activity {
  constructor(id, name, systemId, type) {
    this.id = id;
    this.name = name;
    this.systemId = systemId;
    this.type = type; // 'bug' or 'enhancement'
    this.logicPoints = 0;
    this.dataStructurePoints = 0;
    this.abstractionPoints = 0;
    this.initialLogicPoints = 0;
    this.initialDataStructurePoints = 0;
    this.initialAbstractionPoints = 0;
    this.reward = 0;
    this.isCompleted = false;
  }

  /**
   * Set initial difficulty points
   * @param {number} logic - Logic points
   * @param {number} dataStructure - Data structure points
   * @param {number} abstraction - Abstraction points
   */
  setPoints(logic, dataStructure, abstraction) {
    this.logicPoints = logic;
    this.dataStructurePoints = dataStructure;
    this.abstractionPoints = abstraction;
    this.initialLogicPoints = logic;
    this.initialDataStructurePoints = dataStructure;
    this.initialAbstractionPoints = abstraction;
  }

  /**
   * Apply agent's work to reduce activity points
   * @param {Agent} agent - Agent performing the work
   * @returns {Object} - New state with updated points
   */
  applyWork(agent) {
    // Calculate new points using max(0, current - agent)
    const newLogic = Math.max(0, this.logicPoints - agent.logicPoints);
    const newDataStructure = Math.max(0, this.dataStructurePoints - agent.dataStructurePoints);
    const newAbstraction = Math.max(0, this.abstractionPoints - agent.abstractionPoints);

    // Update activity points
    this.logicPoints = newLogic;
    this.dataStructurePoints = newDataStructure;
    this.abstractionPoints = newAbstraction;

    return {
      logicPoints: newLogic,
      dataStructurePoints: newDataStructure,
      abstractionPoints: newAbstraction
    };
  }

  /**
   * Check if activity is completed (all points are 0)
   * @returns {boolean} - True if completed
   */
  checkCompletion() {
    return this.logicPoints === 0 && 
           this.dataStructurePoints === 0 && 
           this.abstractionPoints === 0;
  }

  /**
   * Mark activity as completed (idempotent)
   */
  markCompleted() {
    this.isCompleted = true;
  }

  /**
   * Calculate reward based on initial points
   * @returns {number} - Reward amount
   */
  calculateReward() {
    return (this.initialLogicPoints + 
            this.initialDataStructurePoints + 
            this.initialAbstractionPoints) * 2;
  }
}
