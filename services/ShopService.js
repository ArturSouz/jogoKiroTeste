import { Agent } from '../entities/Agent.js';

// ShopService - Handles agent creation and upgrades
export class ShopService {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Create a new agent for the player
   * @param {string} playerId - Player ID
   * @param {string} name - Agent name
   * @returns {Object} - Result object {success, error?, agent?}
   */
  createAgent(playerId, name) {
    const player = this.gameState.player;
    const cost = this.gameState.shop.agentCreationCost;

    // Validate sufficient funds
    if (!player.hasSufficientFunds(cost)) {
      return {
        success: false,
        error: `Insufficient funds. Need ${cost}, have ${player.money}`,
        code: 'INSUFFICIENT_FUNDS'
      };
    }

    // Deduct money
    const deducted = player.deductMoney(cost);
    if (!deducted) {
      return {
        success: false,
        error: 'Failed to deduct money',
        code: 'DEDUCTION_FAILED'
      };
    }

    // Create agent
    const agentId = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agent = new Agent(agentId, playerId, name);
    this.gameState.addAgent(agent);

    return {
      success: true,
      agent: agent
    };
  }

  /**
   * Upgrade agent's logic attribute
   * @param {string} agentId - Agent ID
   * @returns {Object} - Result object {success, error?, agent?}
   */
  upgradeAgentLogic(agentId) {
    return this._upgradeAgent(agentId, 'logic', this.gameState.shop.logicUpgradeCost);
  }

  /**
   * Upgrade agent's data structure attribute
   * @param {string} agentId - Agent ID
   * @returns {Object} - Result object {success, error?, agent?}
   */
  upgradeAgentDataStructure(agentId) {
    return this._upgradeAgent(agentId, 'dataStructure', this.gameState.shop.dataStructureUpgradeCost);
  }

  /**
   * Upgrade agent's abstraction attribute
   * @param {string} agentId - Agent ID
   * @returns {Object} - Result object {success, error?, agent?}
   */
  upgradeAgentAbstraction(agentId) {
    return this._upgradeAgent(agentId, 'abstraction', this.gameState.shop.abstractionUpgradeCost);
  }

  /**
   * Internal method to upgrade agent attribute
   * @private
   */
  _upgradeAgent(agentId, attribute, cost) {
    const player = this.gameState.player;
    const agent = this.gameState.getAgentById(agentId);

    if (!agent) {
      return {
        success: false,
        error: 'Agent not found',
        code: 'AGENT_NOT_FOUND'
      };
    }

    // Validate sufficient funds
    if (!player.hasSufficientFunds(cost)) {
      return {
        success: false,
        error: `Insufficient funds. Need ${cost}, have ${player.money}`,
        code: 'INSUFFICIENT_FUNDS'
      };
    }

    // Deduct money
    const deducted = player.deductMoney(cost);
    if (!deducted) {
      return {
        success: false,
        error: 'Failed to deduct money',
        code: 'DEDUCTION_FAILED'
      };
    }

    // Upgrade attribute
    if (attribute === 'logic') {
      agent.upgradeLogic();
    } else if (attribute === 'dataStructure') {
      agent.upgradeDataStructure();
    } else if (attribute === 'abstraction') {
      agent.upgradeAbstraction();
    }

    this.gameState.updateAgent(agent);

    return {
      success: true,
      agent: agent
    };
  }
}
