// Validator - Validation functions
export class Validator {
  /**
   * Validate agent ownership
   * @param {Agent} agent - Agent to validate
   * @param {string} playerId - Player ID
   * @returns {boolean} - True if valid
   */
  static validateAgentOwnership(agent, playerId) {
    return agent && agent.playerId === playerId;
  }

  /**
   * Validate sufficient funds
   * @param {Player} player - Player
   * @param {number} cost - Cost
   * @returns {boolean} - True if valid
   */
  static validateSufficientFunds(player, cost) {
    return player && player.hasSufficientFunds(cost);
  }

  /**
   * Validate activity not completed
   * @param {Activity} activity - Activity
   * @returns {boolean} - True if valid
   */
  static validateActivityNotCompleted(activity) {
    return activity && !activity.isCompleted;
  }

  /**
   * Validate agent available
   * @param {Agent} agent - Agent
   * @returns {boolean} - True if valid
   */
  static validateAgentAvailable(agent) {
    return agent && agent.isAvailable();
  }

  /**
   * Validate points non-negative
   * @param {number} points - Points value
   * @returns {boolean} - True if valid
   */
  static validatePointsNonNegative(points) {
    return points >= 0;
  }
}
