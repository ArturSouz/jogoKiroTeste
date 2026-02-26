// Renderer - Canvas rendering coordinator
export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // Colors
    this.colors = {
      background: '#0a0a0a',
      purple: '#790ECB',
      purpleLight: '#9f7aea',
      white: '#ffffff',
      gray: '#a0aec0',
      grayDark: '#4a5568',
      success: '#48bb78',
      warning: '#ed8936'
    };
  }

  /**
   * Clear canvas
   */
  clear() {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Render background
   */
  renderBackground() {
    this.clear();
  }

  /**
   * Render text
   * @param {string} text - Text to render
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Text color
   * @param {string} font - Font style
   */
  renderText(text, x, y, color = this.colors.white, font = '16px "Courier New"') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.fillText(text, x, y);
  }

  /**
   * Render rectangle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} color - Fill color
   */
  renderRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * Render outlined rectangle
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {string} color - Stroke color
   * @param {number} lineWidth - Line width
   */
  renderRectOutline(x, y, width, height, color, lineWidth = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  /**
   * Render button
   * @param {string} text - Button text
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {boolean} isHovered - Is button hovered
   */
  renderButton(text, x, y, width, height, isHovered = false) {
    const bgColor = isHovered ? this.colors.purpleLight : this.colors.purple;
    
    // Background
    this.renderRect(x, y, width, height, bgColor);
    
    // Text (centered)
    this.ctx.fillStyle = this.colors.white;
    this.ctx.font = '14px "Courier New"';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(text, x + width / 2, y + height / 2);
    
    // Reset alignment
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'alphabetic';
  }
}
