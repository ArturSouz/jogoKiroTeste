import { Activity } from '../entities/Activity.js';
import { System } from '../entities/System.js';
import { Establishment } from '../entities/Establishment.js';

// GenerationService - Generates random game content
export class GenerationService {
  constructor() {
    // Random ranges
    this.ACTIVITY_POINTS_MIN = 5;
    this.ACTIVITY_POINTS_MAX = 50;
    this.BUGS_PER_SYSTEM_MIN = 3;
    this.BUGS_PER_SYSTEM_MAX = 8;
    this.ENHANCEMENTS_PER_SYSTEM_MIN = 2;
    this.ENHANCEMENTS_PER_SYSTEM_MAX = 6;
    this.REWARD_MULTIPLIER = 2;

    // Name pools
    this.establishmentNames = [
      'Startup Valley', 'Enterprise Tower', 'Tech Hub', 'Innovation Center',
      'Digital Plaza', 'Code Factory', 'Silicon Square', 'Dev District'
    ];
    
    this.systemNames = [
      'Authentication', 'Payment Gateway', 'User Dashboard', 'API Gateway',
      'Database Layer', 'Cache System', 'Search Engine', 'Analytics Platform',
      'Notification Service', 'File Storage', 'Email Service', 'Chat System'
    ];
    
    this.bugNames = [
      'Login fails on mobile', 'Memory leak in cache', 'SQL injection vulnerability',
      'Race condition in queue', 'Null pointer exception', 'Infinite loop detected',
      'Session timeout too short', 'Password reset broken', 'API rate limit bug',
      'Data corruption on save', 'Deadlock in transaction', 'XSS vulnerability'
    ];
    
    this.enhancementNames = [
      'Add OAuth support', 'Implement caching', 'Add pagination',
      'Improve performance', 'Add dark mode', 'Implement search',
      'Add export feature', 'Improve UX', 'Add analytics',
      'Implement webhooks', 'Add batch operations', 'Improve security'
    ];

    this.usedEstablishmentNames = [];
    this.usedSystemNames = [];
  }

  /**
   * Generate random activity
   * @param {string} systemId - Parent system ID
   * @param {string} type - 'bug' or 'enhancement'
   * @returns {Activity} - Generated activity
   */
  generateActivity(systemId, type) {
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Pick random name
    const namePool = type === 'bug' ? this.bugNames : this.enhancementNames;
    const name = namePool[Math.floor(Math.random() * namePool.length)];
    
    // Create activity
    const activity = new Activity(id, name, systemId, type);
    
    // Generate random points (5-50)
    const logic = this.randomInt(this.ACTIVITY_POINTS_MIN, this.ACTIVITY_POINTS_MAX);
    const dataStructure = this.randomInt(this.ACTIVITY_POINTS_MIN, this.ACTIVITY_POINTS_MAX);
    const abstraction = this.randomInt(this.ACTIVITY_POINTS_MIN, this.ACTIVITY_POINTS_MAX);
    
    activity.setPoints(logic, dataStructure, abstraction);
    
    // Calculate reward
    activity.reward = activity.calculateReward();
    
    return activity;
  }

  /**
   * Generate system with activities
   * @param {string} establishmentId - Parent establishment ID
   * @returns {System} - Generated system
   */
  generateSystem(establishmentId) {
    const id = `system_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Pick unused system name
    const availableNames = this.systemNames.filter(n => !this.usedSystemNames.includes(n));
    const name = availableNames.length > 0 
      ? availableNames[Math.floor(Math.random() * availableNames.length)]
      : `System ${this.usedSystemNames.length + 1}`;
    this.usedSystemNames.push(name);
    
    const system = new System(id, name, establishmentId);
    
    // Generate bugs (3-8)
    const bugCount = this.randomInt(this.BUGS_PER_SYSTEM_MIN, this.BUGS_PER_SYSTEM_MAX);
    for (let i = 0; i < bugCount; i++) {
      const bug = this.generateActivity(id, 'bug');
      system.addActivity(bug);
    }
    
    // Generate enhancements (2-6)
    const enhancementCount = this.randomInt(
      this.ENHANCEMENTS_PER_SYSTEM_MIN,
      this.ENHANCEMENTS_PER_SYSTEM_MAX
    );
    for (let i = 0; i < enhancementCount; i++) {
      const enhancement = this.generateActivity(id, 'enhancement');
      system.addActivity(enhancement);
    }
    
    return system;
  }

  /**
   * Generate establishment with systems
   * @param {boolean} isUnlocked - Whether establishment starts unlocked
   * @returns {Establishment} - Generated establishment
   */
  generateEstablishment(isUnlocked = false) {
    const id = `establishment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Pick unused establishment name
    const availableNames = this.establishmentNames.filter(n => !this.usedEstablishmentNames.includes(n));
    const name = availableNames.length > 0
      ? availableNames[Math.floor(Math.random() * availableNames.length)]
      : `Establishment ${this.usedEstablishmentNames.length + 1}`;
    this.usedEstablishmentNames.push(name);
    
    const establishment = new Establishment(id, name, isUnlocked);
    
    // Generate 2-3 systems per establishment
    const systemCount = this.randomInt(2, 3);
    for (let i = 0; i < systemCount; i++) {
      const system = this.generateSystem(id);
      establishment.addSystem(system);
    }
    
    return establishment;
  }

  /**
   * Generate initial game content
   * @returns {Object} - {establishments: Establishment[]}
   */
  generateInitialContent() {
    const establishments = [];
    
    // Generate 1 unlocked establishment
    const firstEstablishment = this.generateEstablishment(true);
    establishments.push(firstEstablishment);
    
    // Generate 2-3 locked establishments
    const lockedCount = this.randomInt(2, 3);
    for (let i = 0; i < lockedCount; i++) {
      const establishment = this.generateEstablishment(false);
      establishments.push(establishment);
    }
    
    return { establishments };
  }

  /**
   * Generate random integer between min and max (inclusive)
   * @private
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
