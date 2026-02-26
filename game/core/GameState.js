// GameState - Central state container for the game
export class GameState {
  constructor() {
    this.player = null;
    this.agents = [];
    this.establishments = [];
    this.shop = {
      agentCreationCost: 200,
      logicUpgradeCost: 100,
      dataStructureUpgradeCost: 100,
      abstractionUpgradeCost: 100
    };
  }

  /**
   * Get agent by ID
   * @param {string} id - Agent ID
   * @returns {Agent|null} - Agent or null if not found
   */
  getAgentById(id) {
    return this.agents.find(agent => agent.id === id) || null;
  }

  /**
   * Get establishment by ID
   * @param {string} id - Establishment ID
   * @returns {Establishment|null} - Establishment or null if not found
   */
  getEstablishmentById(id) {
    return this.establishments.find(est => est.id === id) || null;
  }

  /**
   * Get system by ID (searches all establishments)
   * @param {string} id - System ID
   * @returns {System|null} - System or null if not found
   */
  getSystemById(id) {
    for (const establishment of this.establishments) {
      const system = establishment.systems.find(sys => sys.id === id);
      if (system) return system;
    }
    return null;
  }

  /**
   * Get activity by ID (searches all systems)
   * @param {string} id - Activity ID
   * @returns {Activity|null} - Activity or null if not found
   */
  getActivityById(id) {
    for (const establishment of this.establishments) {
      for (const system of establishment.systems) {
        const activity = [...system.bugs, ...system.enhancements].find(act => act.id === id);
        if (activity) return activity;
      }
    }
    return null;
  }

  /**
   * Add agent to state
   * @param {Agent} agent - Agent to add
   */
  addAgent(agent) {
    this.agents.push(agent);
  }

  /**
   * Update agent in state
   * @param {Agent} agent - Agent to update
   */
  updateAgent(agent) {
    const index = this.agents.findIndex(a => a.id === agent.id);
    if (index !== -1) {
      this.agents[index] = agent;
    }
  }

  /**
   * Update activity in state
   * @param {Activity} activity - Activity to update
   */
  updateActivity(activity) {
    const system = this.getSystemById(activity.systemId);
    if (!system) return;

    if (activity.type === 'bug') {
      const index = system.bugs.findIndex(b => b.id === activity.id);
      if (index !== -1) {
        system.bugs[index] = activity;
      }
    } else {
      const index = system.enhancements.findIndex(e => e.id === activity.id);
      if (index !== -1) {
        system.enhancements[index] = activity;
      }
    }
  }

  /**
   * Unlock establishment by ID
   * @param {string} id - Establishment ID
   */
  unlockEstablishment(id) {
    const establishment = this.getEstablishmentById(id);
    if (establishment) {
      establishment.unlock();
    }
  }
}
