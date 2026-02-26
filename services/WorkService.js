// WorkService - Handles agent work on activities
export class WorkService {
  constructor(gameState) {
    this.gameState = gameState;
  }

  /**
   * Assign agent to activity and process work
   * @param {string} agentId - Agent ID
   * @param {string} activityId - Activity ID
   * @returns {Object} - Result object {success, error?, workTime?}
   */
  assignAgentToActivity(agentId, activityId) {
    const agent = this.gameState.getAgentById(agentId);
    const activity = this.gameState.getActivityById(activityId);
    const player = this.gameState.player;

    // Validate agent exists
    if (!agent) {
      return {
        success: false,
        error: 'Agent not found',
        code: 'AGENT_NOT_FOUND'
      };
    }

    // Validate agent ownership
    if (agent.playerId !== player.id) {
      return {
        success: false,
        error: 'Agent does not belong to player',
        code: 'INVALID_OWNERSHIP'
      };
    }

    // Validate activity exists
    if (!activity) {
      return {
        success: false,
        error: 'Activity not found',
        code: 'ACTIVITY_NOT_FOUND'
      };
    }

    // Validate activity not completed
    if (activity.isCompleted) {
      return {
        success: false,
        error: 'Activity is already completed',
        code: 'ACTIVITY_COMPLETED'
      };
    }

    // Validate agent available
    if (!agent.isAvailable()) {
      return {
        success: false,
        error: 'Agent is currently busy with another activity',
        code: 'AGENT_BUSY'
      };
    }

    // Mark agent as busy
    agent.assignToActivity(activityId);
    this.gameState.updateAgent(agent);

    // Calculate work time based on total points
    // Formula: time = totalPoints * randomFactor
    // randomFactor between 0.01 (10ms per point) and 1.0 (1000ms per point)
    const totalPoints = agent.logicPoints + agent.dataStructurePoints + agent.abstractionPoints;
    const randomFactor = Math.random() * 0.99 + 0.01; // 0.01 to 1.0
    const workTime = totalPoints * randomFactor * 1000; // Convert to milliseconds

    return {
      success: true,
      workTime: workTime,
      agent: agent,
      activity: activity
    };
  }

  /**
   * Process agent work on activity
   * @param {Agent} agent - Agent performing work
   * @param {Activity} activity - Activity being worked on
   * @returns {Object} - Result object {success, completed, pointsReduced}
   */
  processWork(agent, activity) {
    // Apply agent's points to activity
    const result = activity.applyWork(agent);
    
    // Update activity in state
    this.gameState.updateActivity(activity);

    // Check if activity is completed
    const isCompleted = activity.checkCompletion();
    
    if (isCompleted) {
      // Complete activity and pay reward
      this.completeActivity(activity);
    }

    return {
      success: true,
      completed: isCompleted,
      pointsReduced: {
        logic: result.logicPoints,
        dataStructure: result.dataStructurePoints,
        abstraction: result.abstractionPoints
      }
    };
  }

  /**
   * Complete activity and pay reward
   * @param {Activity} activity - Activity to complete
   */
  completeActivity(activity) {
    // Mark as completed
    activity.markCompleted();
    
    // Calculate and pay reward
    const reward = activity.calculateReward();
    this.gameState.player.addMoney(reward);
    
    // Update activity in state
    this.gameState.updateActivity(activity);

    return {
      success: true,
      reward: reward
    };
  }
}
