// Dashboard - Renders system details and actions
export class Dashboard {
  constructor(renderer) {
    this.renderer = renderer;
  }

  /**
   * Render dashboard
   * @param {GameState} gameState - Game state
   * @param {string} establishmentId - Selected establishment ID
   * @param {string} selectedSystemId - Selected system ID
   * @param {string} selectedActivityId - Selected activity ID
   * @param {number} scrollOffset - Scroll offset for activities
   * @param {number} agentScrollOffset - Scroll offset for agents
   */
  render(gameState, establishmentId, selectedSystemId = null, selectedActivityId = null, scrollOffset = 0, agentScrollOffset = 0) {
    const ctx = this.renderer.ctx;
    const colors = this.renderer.colors;
    const establishment = gameState.getEstablishmentById(establishmentId);
    
    if (!establishment) return;
    
    // Player money - top right
    this.renderer.ctx.fillStyle = colors.success;
    this.renderer.ctx.font = 'bold 20px "Courier New"';
    this.renderer.ctx.textAlign = 'right';
    this.renderer.ctx.fillText(`💰 $${gameState.player.money.toFixed(0)}`, this.renderer.canvas.width - 20, 40);
    this.renderer.ctx.textAlign = 'left';
    
    // Back button
    this.renderer.renderButton('← Back to Map', 20, 20, 150, 40);
    
    // Establishment title
    this.renderer.renderText(
      establishment.name,
      20, 80,
      colors.purple,
      '20px "Courier New"'
    );
    
    // Systems list
    this.renderer.renderText(
      'Systems:',
      20, 120,
      colors.white,
      '18px "Courier New"'
    );
    
    let y = 160;
    establishment.systems.forEach(system => {
      const isSelected = system.id === selectedSystemId;
      const bgColor = isSelected ? colors.purple : colors.grayDark;
      
      // System card
      this.renderer.renderRect(20, y, 350, 50, bgColor);
      this.renderer.renderRectOutline(20, y, 350, 50, colors.purple, 2);
      
      // Name
      this.renderer.renderText(
        system.name,
        30, y + 20,
        colors.white
      );
      
      // Activities count
      const completed = system.getCompletedActivities().length;
      const total = system.getActivities().length;
      this.renderer.renderText(
        `Activities: ${completed}/${total}`,
        30, y + 40,
        colors.gray,
        '12px "Courier New"'
      );
      
      y += 70;
    });
    
    // If system selected, show activities
    if (selectedSystemId) {
      this.renderSystemDetails(gameState, selectedSystemId, selectedActivityId, scrollOffset);
    }
    
    // If activity selected, show agents
    if (selectedActivityId) {
      this.renderAgentSelection(gameState, selectedActivityId, agentScrollOffset);
    }
  }

  /**
   * Render system details with activities
   */
  renderSystemDetails(gameState, systemId, selectedActivityId, scrollOffset = 0) {
    const system = gameState.getSystemById(systemId);
    if (!system) return;
    
    const colors = this.renderer.colors;
    const startX = 400;
    let y = 80 - scrollOffset; // Apply scroll offset
    
    // System name
    this.renderer.renderText(
      system.name,
      startX, y,
      colors.purple,
      '18px "Courier New"'
    );
    
    y += 40;
    
    // Bugs section
    this.renderer.renderText('Bugs:', startX, y, colors.warning, '16px "Courier New"');
    y += 30;
    
    const pendingBugs = system.bugs.filter(b => !b.isCompleted);
    const completedBugs = system.bugs.filter(b => b.isCompleted);
    
    pendingBugs.forEach(bug => {
      y = this.renderActivity(bug, startX, y, selectedActivityId === bug.id);
    });
    
    if (completedBugs.length > 0) {
      this.renderer.renderText('✓ Completed:', startX, y, colors.success, '14px "Courier New"');
      y += 25;
      completedBugs.forEach(bug => {
        y = this.renderActivity(bug, startX, y, false, true);
      });
    }
    
    y += 20;
    
    // Enhancements section
    this.renderer.renderText('Enhancements:', startX, y, colors.success, '16px "Courier New"');
    y += 30;
    
    const pendingEnhancements = system.enhancements.filter(e => !e.isCompleted);
    const completedEnhancements = system.enhancements.filter(e => e.isCompleted);
    
    pendingEnhancements.forEach(enhancement => {
      y = this.renderActivity(enhancement, startX, y, selectedActivityId === enhancement.id);
    });
    
    if (completedEnhancements.length > 0) {
      this.renderer.renderText('✓ Completed:', startX, y, colors.success, '14px "Courier New"');
      y += 25;
      completedEnhancements.forEach(enhancement => {
        y = this.renderActivity(enhancement, startX, y, false, true);
      });
    }
    
    // If activity selected, show agents
    if (selectedActivityId) {
      this.renderAgentSelection(gameState, selectedActivityId);
    }
  }

  /**
   * Render single activity
   */
  renderActivity(activity, x, y, isSelected, isCompleted = false) {
    const colors = this.renderer.colors;
    const bgColor = isSelected ? colors.purple : (isCompleted ? colors.grayDark : '#1a202c');
    
    // Activity card
    this.renderer.renderRect(x, y, 450, 90, bgColor);
    this.renderer.renderRectOutline(x, y, 450, 90, colors.purple, 1);
    
    // Name
    this.renderer.renderText(
      activity.name,
      x + 10, y + 20,
      isCompleted ? colors.gray : colors.white,
      '14px "Courier New"'
    );
    
    // Points with full names
    if (!isCompleted) {
      this.renderer.renderText(
        `Logic: ${activity.logicPoints}`,
        x + 10, y + 45,
        colors.purpleLight,
        '12px "Courier New"'
      );
      
      this.renderer.renderText(
        `Data Structure: ${activity.dataStructurePoints}`,
        x + 10, y + 65,
        colors.purpleLight,
        '12px "Courier New"'
      );
      
      this.renderer.renderText(
        `Abstraction: ${activity.abstractionPoints}`,
        x + 220, y + 45,
        colors.purpleLight,
        '12px "Courier New"'
      );
      
      // Reward
      this.renderer.renderText(
        `💰 $${activity.reward}`,
        x + 220, y + 65,
        colors.success,
        '14px "Courier New"'
      );
    } else {
      this.renderer.renderText(
        '✓ Completed',
        x + 10, y + 45,
        colors.success,
        '12px "Courier New"'
      );
      
      // Show reward earned
      this.renderer.renderText(
        `💰 +${activity.reward}`,
        x + 10, y + 65,
        colors.success,
        '14px "Courier New"'
      );
    }
    
    return y + 105;
  }

  /**
   * Render agent selection panel
   */
  renderAgentSelection(gameState, activityId, agentScrollOffset = 0) {
    const colors = this.renderer.colors;
    const startX = 900;
    const startY = 80;
    
    // Title - fixed position (not scrolled)
    this.renderer.renderText('Your Agents:', startX, startY, colors.white, '18px "Courier New"');
    
    // Shop button - fixed position (not scrolled)
    const buttonY = startY + 35;
    this.renderer.renderRect(startX, buttonY, 220, 40, colors.purple);
    this.renderer.renderRectOutline(startX, buttonY, 220, 40, colors.purpleLight, 2);
    this.renderer.ctx.fillStyle = colors.white;
    this.renderer.ctx.font = 'bold 14px "Courier New"';
    this.renderer.ctx.textAlign = 'center';
    this.renderer.ctx.fillText('+ Create Agent ($200)', startX + 110, buttonY + 25);
    this.renderer.ctx.textAlign = 'left';
    
    // Define scrollable area
    const clipY = buttonY + 50;
    const clipHeight = 550; // Visible height for agents
    
    // Clear the scrollable area background FIRST (before clipping)
    this.renderer.renderRect(startX, clipY, 360, clipHeight, colors.background);
    
    // Save context for clipping
    this.renderer.ctx.save();
    
    // Create clipping region for scrollable area
    this.renderer.ctx.beginPath();
    this.renderer.ctx.rect(startX, clipY, 360, clipHeight);
    this.renderer.ctx.clip();
    
    // Agents list - scrollable
    let y = clipY - agentScrollOffset;
    gameState.agents.forEach((agent, index) => {
      this.renderAgentCard(agent, startX, y, gameState);
      y += 175;
    });
    
    // Restore context
    this.renderer.ctx.restore();
  }

  /**
   * Render individual agent card with progress
   */
  renderAgentCard(agent, x, y, gameState) {
    const colors = this.renderer.colors;
    const bgColor = agent.isBusy ? '#2d3748' : '#1a202c';
    
    // Card background
    this.renderer.renderRect(x, y, 360, 160, bgColor);
    this.renderer.renderRectOutline(x, y, 360, 160, agent.isBusy ? colors.warning : colors.purple, 3);
    
    // Agent name and version - larger and bolder
    this.renderer.ctx.fillStyle = colors.white;
    this.renderer.ctx.font = 'bold 18px "Courier New"';
    this.renderer.ctx.fillText(`${agent.name} v${agent.version}`, x + 12, y + 25);
    
    // Attributes with better spacing and larger font
    this.renderer.ctx.fillStyle = '#e9d5ff'; // Lighter purple for better contrast
    this.renderer.ctx.font = '14px "Courier New"';
    this.renderer.ctx.fillText(`🧠 Logic: ${agent.logicPoints}`, x + 12, y + 52);
    this.renderer.ctx.fillText(`📊 Data: ${agent.dataStructurePoints}`, x + 12, y + 72);
    this.renderer.ctx.fillText(`🎯 Abstract: ${agent.abstractionPoints}`, x + 12, y + 92);
    
    if (agent.isBusy) {
      // Show working status with progress bar
      this.renderer.ctx.fillStyle = colors.warning;
      this.renderer.ctx.font = 'bold 14px "Courier New"';
      this.renderer.ctx.fillText('⚙️ WORKING...', x + 12, y + 118);
      
      // Progress bar - larger and more visible
      if (agent.workProgress !== undefined) {
        const barWidth = 336;
        const barHeight = 12;
        const barX = x + 12;
        const barY = y + 128;
        
        // Background
        this.renderer.renderRect(barX, barY, barWidth, barHeight, '#1a202c');
        
        // Progress
        const progressWidth = barWidth * agent.workProgress;
        this.renderer.renderRect(barX, barY, progressWidth, barHeight, '#48bb78');
        
        // Border
        this.renderer.renderRectOutline(barX, barY, barWidth, barHeight, colors.success, 2);
        
        // Time remaining - larger and more visible
        if (agent.timeRemaining !== undefined) {
          this.renderer.ctx.fillStyle = colors.white;
          this.renderer.ctx.font = 'bold 13px "Courier New"';
          this.renderer.ctx.textAlign = 'right';
          this.renderer.ctx.fillText(`${agent.timeRemaining.toFixed(1)}s`, x + 348, y + 118);
          this.renderer.ctx.textAlign = 'left';
        }
        
        // Percentage
        this.renderer.ctx.fillStyle = colors.white;
        this.renderer.ctx.font = 'bold 11px "Courier New"';
        this.renderer.ctx.textAlign = 'center';
        this.renderer.ctx.fillText(`${Math.floor(agent.workProgress * 100)}%`, x + 180, y + 138);
        this.renderer.ctx.textAlign = 'left';
      }
    } else {
      // Upgrade buttons - larger and more visible
      const buttonY = y + 115;
      const buttonWidth = 108;
      const buttonHeight = 35;
      const spacing = 10;
      
      // Logic upgrade
      this.renderer.renderRect(x + 12, buttonY, buttonWidth, buttonHeight, colors.purple);
      this.renderer.renderRectOutline(x + 12, buttonY, buttonWidth, buttonHeight, colors.purpleLight, 2);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = 'bold 13px "Courier New"';
      this.renderer.ctx.textAlign = 'center';
      this.renderer.ctx.fillText('↑ Logic', x + 12 + buttonWidth/2, buttonY + 14);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = '11px "Courier New"';
      this.renderer.ctx.fillText('$100', x + 12 + buttonWidth/2, buttonY + 28);
      
      // Data Structure upgrade
      this.renderer.renderRect(x + 12 + buttonWidth + spacing, buttonY, buttonWidth, buttonHeight, colors.purple);
      this.renderer.renderRectOutline(x + 12 + buttonWidth + spacing, buttonY, buttonWidth, buttonHeight, colors.purpleLight, 2);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = 'bold 13px "Courier New"';
      this.renderer.ctx.fillText('↑ Data', x + 12 + buttonWidth + spacing + buttonWidth/2, buttonY + 14);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = '11px "Courier New"';
      this.renderer.ctx.fillText('$100', x + 12 + buttonWidth + spacing + buttonWidth/2, buttonY + 28);
      
      // Abstraction upgrade
      this.renderer.renderRect(x + 12 + (buttonWidth + spacing) * 2, buttonY, buttonWidth, buttonHeight, colors.purple);
      this.renderer.renderRectOutline(x + 12 + (buttonWidth + spacing) * 2, buttonY, buttonWidth, buttonHeight, colors.purpleLight, 2);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = 'bold 13px "Courier New"';
      this.renderer.ctx.fillText('↑ Abstract', x + 12 + (buttonWidth + spacing) * 2 + buttonWidth/2, buttonY + 14);
      this.renderer.ctx.fillStyle = colors.white;
      this.renderer.ctx.font = '11px "Courier New"';
      this.renderer.ctx.fillText('$100', x + 12 + (buttonWidth + spacing) * 2 + buttonWidth/2, buttonY + 28);
      
      this.renderer.ctx.textAlign = 'left';
    }
  }

  /**
   * Check if back button clicked
   */
  isBackButtonClicked(x, y) {
    return x >= 20 && x <= 170 && y >= 20 && y <= 60;
  }

  /**
   * Get clicked system
   */
  getClickedSystem(x, y, establishment) {
    let cardY = 160;
    
    for (const system of establishment.systems) {
      if (x >= 20 && x <= 370 && y >= cardY && y <= cardY + 50) {
        return system.id;
      }
      cardY += 70;
    }
    
    return null;
  }

  /**
   * Get clicked activity
   */
  getClickedActivity(x, y, system, scrollOffset = 0) {
    const startX = 400;
    let cardY = 150 - scrollOffset; // Apply scroll offset
    
    const activities = [...system.bugs.filter(b => !b.isCompleted), ...system.enhancements.filter(e => !e.isCompleted)];
    
    for (const activity of activities) {
      if (x >= startX && x <= startX + 450 && y >= cardY && y <= cardY + 90) {
        return activity.id;
      }
      cardY += 105;
    }
    
    return null;
  }

  /**
   * Check if create agent button clicked
   */
  isCreateAgentClicked(x, y) {
    return x >= 900 && x <= 1120 && y >= 115 && y <= 155;
  }

  /**
   * Get clicked agent
   */
  getClickedAgent(x, y, gameState, agentScrollOffset = 0) {
    const startX = 900;
    const clipY = 175; // Start of scrollable area
    let cardY = clipY - agentScrollOffset;
    
    for (const agent of gameState.agents) {
      // Check if click is on agent card (not on upgrade buttons) and within visible area
      if (x >= startX && x <= startX + 360 && 
          y >= cardY && y <= cardY + 110 &&
          y >= clipY) { // Must be below the fixed header
        return agent.id;
      }
      cardY += 175;
    }
    
    return null;
  }

  /**
   * Get clicked agent upgrade button
   * @returns {Object|null} - {agentId, attribute} or null
   */
  getClickedAgentUpgrade(x, y, gameState, agentScrollOffset = 0) {
    const startX = 900;
    const clipY = 175; // Start of scrollable area
    let cardY = clipY - agentScrollOffset;
    const buttonWidth = 108;
    const spacing = 10;
    
    for (const agent of gameState.agents) {
      if (agent.isBusy) {
        cardY += 175;
        continue;
      }
      
      const buttonY = cardY + 115;
      
      // Check if button is within visible area
      if (y < clipY) {
        cardY += 175;
        continue;
      }
      
      // Logic button
      if (x >= startX + 12 && x <= startX + 12 + buttonWidth && 
          y >= buttonY && y <= buttonY + 35) {
        return { agentId: agent.id, attribute: 'logic' };
      }
      
      // Data Structure button
      if (x >= startX + 12 + buttonWidth + spacing && 
          x <= startX + 12 + (buttonWidth + spacing) * 2 && 
          y >= buttonY && y <= buttonY + 35) {
        return { agentId: agent.id, attribute: 'dataStructure' };
      }
      
      // Abstraction button
      if (x >= startX + 12 + (buttonWidth + spacing) * 2 && 
          x <= startX + 12 + (buttonWidth + spacing) * 3 && 
          y >= buttonY && y <= buttonY + 35) {
        return { agentId: agent.id, attribute: 'abstraction' };
      }
      
      cardY += 175;
    }
    
    return null;
  }
}
