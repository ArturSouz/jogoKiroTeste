// MapView - Renders map with establishments
export class MapView {
  constructor(renderer) {
    this.renderer = renderer;
  }

  /**
   * Render map view
   * @param {GameState} gameState - Game state
   * @param {string} selectedEstablishmentId - Selected establishment ID
   */
  render(gameState, selectedEstablishmentId = null) {
    const ctx = this.renderer.ctx;
    const colors = this.renderer.colors;
    
    // Player money - top right
    ctx.fillStyle = colors.success;
    ctx.font = 'bold 20px "Courier New"';
    ctx.textAlign = 'right';
    ctx.fillText(`💰 $${gameState.player.money.toFixed(0)}`, this.renderer.canvas.width - 20, 40);
    ctx.textAlign = 'left';
    
    // Title
    this.renderer.renderText(
      'Software Dev Management Game',
      20, 40,
      colors.purple,
      '24px "Courier New"'
    );
    
    // Player info
    this.renderer.renderText(
      `Player: ${gameState.player.name}`,
      20, 80,
      colors.purpleLight
    );
    
    // Establishments section
    this.renderer.renderText(
      'Establishments:',
      20, 130,
      colors.white,
      '18px "Courier New"'
    );
    
    let y = 170;
    const unlocked = gameState.establishments.filter(e => e.isUnlocked);
    
    unlocked.forEach(establishment => {
      const isSelected = establishment.id === selectedEstablishmentId;
      const bgColor = isSelected ? colors.purple : colors.grayDark;
      
      // Establishment card
      this.renderer.renderRect(20, y, 300, 60, bgColor);
      this.renderer.renderRectOutline(20, y, 300, 60, colors.purple, 2);
      
      // Name
      this.renderer.renderText(
        establishment.name,
        30, y + 25,
        colors.white,
        '16px "Courier New"'
      );
      
      // Systems count
      const completed = establishment.systems.filter(s => s.isFullyCompleted()).length;
      const total = establishment.systems.length;
      this.renderer.renderText(
        `Systems: ${completed}/${total}`,
        30, y + 50,
        colors.gray,
        '14px "Courier New"'
      );
      
      y += 80;
    });
    
    // Instructions
    if (!selectedEstablishmentId) {
      this.renderer.renderText(
        'Click an establishment to view systems',
        20, y + 20,
        colors.gray,
        '14px "Courier New"'
      );
    }
  }

  /**
   * Check if click is on establishment
   * @param {number} x - Click X
   * @param {number} y - Click Y
   * @param {GameState} gameState - Game state
   * @returns {string|null} - Establishment ID or null
   */
  getClickedEstablishment(x, y, gameState) {
    let cardY = 170;
    const unlocked = gameState.establishments.filter(e => e.isUnlocked);
    
    for (const establishment of unlocked) {
      if (x >= 20 && x <= 320 && y >= cardY && y <= cardY + 60) {
        return establishment.id;
      }
      cardY += 80;
    }
    
    return null;
  }
}
