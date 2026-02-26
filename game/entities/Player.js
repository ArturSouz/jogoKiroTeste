// Player entity - manages player data and money
export class Player {
  constructor(id, name, initialMoney = 1000) {
    this.id = id;
    this.name = name;
    this.money = initialMoney;
  }

  /**
   * Add money to player (for rewards)
   * @param {number} amount - Amount to add
   */
  addMoney(amount) {
    if (amount < 0) {
      throw new Error('Cannot add negative amount');
    }
    this.money += amount;
  }

  /**
   * Deduct money from player (for purchases)
   * @param {number} cost - Amount to deduct
   * @returns {boolean} - True if successful, false if insufficient funds
   */
  deductMoney(cost) {
    if (cost < 0) {
      throw new Error('Cannot deduct negative amount');
    }
    
    if (this.money < cost) {
      return false; // Insufficient funds
    }
    
    this.money -= cost;
    return true;
  }

  /**
   * Check if player has sufficient funds
   * @param {number} cost - Amount to check
   * @returns {boolean} - True if player can afford
   */
  hasSufficientFunds(cost) {
    return this.money >= cost;
  }
}
