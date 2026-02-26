// InputHandler - Handles mouse input
export class InputHandler {
  constructor(canvas, gameEngine) {
    this.canvas = canvas;
    this.gameEngine = gameEngine;
    this.setupListeners();
  }

  /**
   * Setup event listeners
   */
  setupListeners() {
    this.canvas.addEventListener('click', (e) => this.handleClick(e));
    this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
  }

  /**
   * Handle click event
   * @param {MouseEvent} e - Mouse event
   */
  handleClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.gameEngine.handleClick(x, y);
  }

  /**
   * Handle wheel event (scroll)
   * @param {WheelEvent} e - Wheel event
   */
  handleWheel(e) {
    e.preventDefault(); // Prevent page scroll
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    this.gameEngine.handleScroll(e.deltaY, x);
  }
}
