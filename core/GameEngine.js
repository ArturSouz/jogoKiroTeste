import { Player } from '../entities/Player.js';
import { GameState } from './GameState.js';
import { ShopService } from '../services/ShopService.js';
import { WorkService } from '../services/WorkService.js';
import { GenerationService } from '../services/GenerationService.js';
import { Renderer } from '../ui/Renderer.js';
import { MapView } from '../ui/MapView.js';
import { Dashboard } from '../ui/Dashboard.js';
import { InputHandler } from '../ui/InputHandler.js';

// GameEngine - Main game coordinator
export class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.running = false;
    this.lastTime = 0;
    
    // State
    this.gameState = null;
    this.currentView = 'map'; // 'map' or 'dashboard'
    this.selectedEstablishmentId = null;
    this.selectedSystemId = null;
    this.selectedActivityId = null;
    this.scrollOffset = 0; // Scroll offset for activities
    this.agentScrollOffset = 0; // Scroll offset for agents
    
    // Services
    this.shopService = null;
    this.workService = null;
    this.generationService = null;
    
    // UI
    this.renderer = null;
    this.mapView = null;
    this.dashboard = null;
    this.inputHandler = null;
    
    // Notifications
    this.notification = null;
    this.notificationTime = 0;
  }

  /**
   * Initialize game
   */
  init() {
    console.log('Initializing game...');
    
    // Initialize game state
    this.gameState = new GameState();
    this.gameState.player = new Player('player1', 'Player', 1000);
    
    // Initialize services
    this.shopService = new ShopService(this.gameState);
    this.workService = new WorkService(this.gameState);
    this.generationService = new GenerationService();
    
    // Generate initial content
    const content = this.generationService.generateInitialContent();
    this.gameState.establishments = content.establishments;
    
    // Initialize UI
    this.renderer = new Renderer(this.canvas);
    this.mapView = new MapView(this.renderer);
    this.dashboard = new Dashboard(this.renderer);
    this.inputHandler = new InputHandler(this.canvas, this);
    
    console.log('Game initialized!');
    console.log('Establishments:', this.gameState.establishments.length);
    console.log('Player money:', this.gameState.player.money);
  }

  /**
   * Start game loop
   */
  start() {
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Game loop
   */
  gameLoop(currentTime) {
    if (!this.running) return;
    
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    this.update(deltaTime);
    this.render();
    
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * Update game state
   */
  update(deltaTime) {
    // Update notification timer
    if (this.notification) {
      this.notificationTime -= deltaTime;
      if (this.notificationTime <= 0) {
        this.notification = null;
      }
    }
    
    // Update agent work progress
    this.gameState.agents.forEach(agent => {
      if (agent.isBusy && agent.workStartTime) {
        const now = Date.now();
        const elapsed = now - agent.workStartTime;
        const total = agent.workEndTime - agent.workStartTime;
        agent.workProgress = Math.min(1, elapsed / total);
        agent.timeRemaining = Math.max(0, (agent.workEndTime - now) / 1000);
      }
    });
  }

  /**
   * Render current frame
   */
  render() {
    this.renderer.renderBackground();
    
    if (this.currentView === 'map') {
      this.mapView.render(this.gameState, this.selectedEstablishmentId);
    } else if (this.currentView === 'dashboard') {
      this.dashboard.render(
        this.gameState,
        this.selectedEstablishmentId,
        this.selectedSystemId,
        this.selectedActivityId,
        this.scrollOffset,
        this.agentScrollOffset
      );
    }
    
    // Render notification
    if (this.notification) {
      this.renderNotification();
    }
  }

  /**
   * Handle click
   */
  handleClick(x, y) {
    if (this.currentView === 'map') {
      this.handleMapClick(x, y);
    } else if (this.currentView === 'dashboard') {
      this.handleDashboardClick(x, y);
    }
  }

  /**
   * Handle scroll
   */
  handleScroll(deltaY, x) {
    if (this.currentView === 'dashboard' && this.selectedSystemId) {
      // Check if scrolling in activities area (left side) or agents area (right side)
      if (x < 880) {
        // Scroll activities list
        this.scrollOffset += deltaY * 0.5;
        this.scrollOffset = Math.max(0, this.scrollOffset);
        
        const system = this.gameState.getSystemById(this.selectedSystemId);
        if (system) {
          const totalActivities = system.getActivities().length;
          const maxScroll = Math.max(0, totalActivities * 105 - 400);
          this.scrollOffset = Math.min(this.scrollOffset, maxScroll);
        }
      } else {
        // Scroll agents list
        this.agentScrollOffset += deltaY * 0.5;
        this.agentScrollOffset = Math.max(0, this.agentScrollOffset);
        
        const totalAgents = this.gameState.agents.length;
        const maxScroll = Math.max(0, totalAgents * 175 - 400);
        this.agentScrollOffset = Math.min(this.agentScrollOffset, maxScroll);
      }
    }
  }

  /**
   * Handle map click
   */
  handleMapClick(x, y) {
    const establishmentId = this.mapView.getClickedEstablishment(x, y, this.gameState);
    
    if (establishmentId) {
      this.selectedEstablishmentId = establishmentId;
      this.currentView = 'dashboard';
      this.selectedSystemId = null;
      this.selectedActivityId = null;
      this.scrollOffset = 0; // Reset scroll
    }
  }

  /**
   * Handle dashboard click
   */
  handleDashboardClick(x, y) {
    const establishment = this.gameState.getEstablishmentById(this.selectedEstablishmentId);
    
    // Check back button
    if (this.dashboard.isBackButtonClicked(x, y)) {
      this.currentView = 'map';
      this.selectedEstablishmentId = null;
      this.selectedSystemId = null;
      this.selectedActivityId = null;
      return;
    }
    
    // Check system click
    const systemId = this.dashboard.getClickedSystem(x, y, establishment);
    if (systemId) {
      this.selectedSystemId = systemId;
      this.selectedActivityId = null;
      this.scrollOffset = 0; // Reset scroll when changing system
      this.agentScrollOffset = 0; // Reset agent scroll too
      return;
    }
    
    // Check activity click
    if (this.selectedSystemId) {
      const system = this.gameState.getSystemById(this.selectedSystemId);
      const activityId = this.dashboard.getClickedActivity(x, y, system, this.scrollOffset);
      if (activityId) {
        this.selectedActivityId = activityId;
        return;
      }
    }
    
    // Check create agent button
    if (this.selectedActivityId && this.dashboard.isCreateAgentClicked(x, y)) {
      this.handleCreateAgent();
      return;
    }
    
    // Check agent upgrade buttons
    if (this.selectedActivityId) {
      const upgradeClick = this.dashboard.getClickedAgentUpgrade(x, y, this.gameState, this.agentScrollOffset);
      if (upgradeClick) {
        this.handleUpgradeAgent(upgradeClick.agentId, upgradeClick.attribute);
        return;
      }
    }
    
    // Check agent click
    if (this.selectedActivityId) {
      const agentId = this.dashboard.getClickedAgent(x, y, this.gameState, this.agentScrollOffset);
      if (agentId) {
        this.handleAssignAgent(agentId);
        return;
      }
    }
  }

  /**
   * Handle create agent
   */
  handleCreateAgent() {
    const agentName = `Agent ${this.gameState.agents.length + 1}`;
    const result = this.shopService.createAgent(this.gameState.player.id, agentName);
    
    if (result.success) {
      this.showNotification(`Created ${agentName}! Money: $${this.gameState.player.money}`, 'success');
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Handle upgrade agent
   */
  handleUpgradeAgent(agentId, attribute) {
    let result;
    
    if (attribute === 'logic') {
      result = this.shopService.upgradeAgentLogic(agentId);
    } else if (attribute === 'dataStructure') {
      result = this.shopService.upgradeAgentDataStructure(agentId);
    } else if (attribute === 'abstraction') {
      result = this.shopService.upgradeAgentAbstraction(agentId);
    }
    
    if (result.success) {
      const agent = result.agent;
      const attrName = attribute === 'logic' ? 'Logic' : 
                       attribute === 'dataStructure' ? 'Data Structure' : 'Abstraction';
      this.showNotification(
        `${agent.name} ${attrName} upgraded! Money: $${this.gameState.player.money}`,
        'success'
      );
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Handle assign agent to activity
   */
  handleAssignAgent(agentId) {
    const result = this.workService.assignAgentToActivity(agentId, this.selectedActivityId);
    
    if (result.success) {
      const agent = result.agent;
      const activity = result.activity;
      const workTime = result.workTime;
      
      // Set work progress tracking
      agent.workProgress = 0;
      agent.timeRemaining = workTime / 1000;
      agent.workStartTime = Date.now();
      agent.workEndTime = Date.now() + workTime;
      
      this.showNotification(
        `${agent.name} is working... (${(workTime / 1000).toFixed(1)}s)`,
        'info'
      );
      
      // Process work after delay
      setTimeout(() => {
        const workResult = this.workService.processWork(agent, activity);
        
        // Mark agent as available and clear progress
        agent.completeWork();
        agent.workProgress = undefined;
        agent.timeRemaining = undefined;
        agent.workStartTime = undefined;
        agent.workEndTime = undefined;
        this.gameState.updateAgent(agent);
        
        if (workResult.completed) {
          this.showNotification(
            `${activity.name} completed! Reward: $${activity.reward}`,
            'success'
          );
          
          // Check for unlocks
          this.checkUnlocks();
        } else {
          this.showNotification(
            `${agent.name} reduced activity points`,
            'success'
          );
        }
      }, workTime);
    } else {
      this.showNotification(result.error, 'error');
    }
  }

  /**
   * Check for establishment unlocks
   */
  checkUnlocks() {
    const establishment = this.gameState.getEstablishmentById(this.selectedEstablishmentId);
    
    if (establishment && establishment.isFullyCompleted()) {
      // Find locked establishment
      const locked = this.gameState.establishments.find(e => !e.isUnlocked);
      
      if (locked) {
        locked.unlock();
        this.showNotification(`New establishment unlocked: ${locked.name}!`, 'success');
      }
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    this.notification = { message, type };
    this.notificationTime = 3; // 3 seconds
    console.log(`[${type.toUpperCase()}]`, message);
  }

  /**
   * Render notification
   */
  renderNotification() {
    const colors = this.renderer.colors;
    const bgColor = this.notification.type === 'error' ? colors.warning : colors.success;
    
    const x = this.canvas.width / 2 - 200;
    const y = 20;
    
    this.renderer.renderRect(x, y, 400, 50, bgColor);
    this.renderer.renderRectOutline(x, y, 400, 50, colors.white, 2);
    
    this.renderer.ctx.fillStyle = colors.white;
    this.renderer.ctx.font = '14px "Courier New"';
    this.renderer.ctx.textAlign = 'center';
    this.renderer.ctx.fillText(this.notification.message, this.canvas.width / 2, y + 30);
    this.renderer.ctx.textAlign = 'left';
  }
}
