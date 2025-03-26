import { Game } from './Game';

export class Minimap {
  game: Game;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;

  constructor(game: Game) {
    this.game = game;
    this.width = 200;
    this.height = 40;
    this.x = game.width - this.width - 20;
    this.y = 20;
    this.scale = this.width / game.worldWidth;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Draw minimap background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw minimap border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    
    // Draw player position
    const playerX = this.x + this.game.player.x * this.scale;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(playerX, this.y + this.height / 2 - 2, 4, 4);
    
    // Draw enemies
    ctx.fillStyle = '#ff0000';
    this.game.enemies.forEach(enemy => {
      const enemyX = this.x + enemy.x * this.scale;
      ctx.fillRect(enemyX, this.y + this.height / 2 - 1, 2, 2);
    });
    
    // Draw humans
    ctx.fillStyle = '#ffff00';
    this.game.humans.forEach(human => {
      const humanX = this.x + human.x * this.scale;
      ctx.fillRect(humanX, this.y + this.height - 4, 1, 2);
    });
    
    // Draw viewport indicator
    const viewportX = this.x + this.game.cameraOffset * this.scale;
    const viewportWidth = this.game.width * this.scale;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(viewportX, this.y, viewportWidth, this.height);
    
    ctx.restore();
  }
}
