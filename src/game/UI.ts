import { Game } from './Game';

export class UI {
  game: Game;
  fontSize: number;
  fontFamily: string;

  constructor(game: Game) {
    this.game = game;
    this.fontSize = 20;
    this.fontFamily = '"Courier New", Courier, monospace';
  }

  update() {
    // Update UI elements if needed
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Set text properties
    ctx.fillStyle = '#ffffff';
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    // Draw score
    ctx.fillText(`SCORE: ${this.game.score}`, 20, 20);
    
    // Draw lives
    ctx.fillText(`LIVES: ${this.game.lives}`, 20, 50);
    
    // Draw instructions if needed
    if (this.game.gameOver) {
      ctx.textAlign = 'center';
      ctx.font = `30px ${this.fontFamily}`;
      ctx.fillText('GAME OVER', this.game.width / 2, this.game.height / 2 - 30);
      ctx.font = `20px ${this.fontFamily}`;
      ctx.fillText('Press F5 to restart', this.game.width / 2, this.game.height / 2 + 10);
    }
    
    ctx.restore();
  }
}
