import { Game } from '../Game';

export class Human {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  isOnGround: boolean;
  walkDirection: number;
  walkTimer: number;
  walkInterval: number;

  constructor(x: number, y: number, game: Game) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 20;
    this.speedX = 0;
    this.isOnGround = true;
    this.walkDirection = Math.random() < 0.5 ? -1 : 1;
    this.walkTimer = 0;
    this.walkInterval = 2000 + Math.random() * 3000;
  }

  update(deltaTime: number) {
    // Simple walking behavior
    this.walkTimer += deltaTime;
    if (this.walkTimer > this.walkInterval) {
      this.walkTimer = 0;
      this.walkDirection = -this.walkDirection;
    }

    if (this.isOnGround) {
      this.speedX = this.walkDirection * 0.5;
      this.x += this.speedX;
    } else {
      // If being carried by enemy
      this.y += 0.5; // Slowly fall if dropped
    }

    // World boundaries
    if (this.x < 0) {
      this.x = 0;
      this.walkDirection = 1;
    }
    if (this.x > this.game.worldWidth - this.width) {
      this.x = this.game.worldWidth - this.width;
      this.walkDirection = -1;
    }

    // Ground check
    if (this.y > this.game.height - this.height - 30) {
      this.y = this.game.height - this.height - 30;
      this.isOnGround = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw human
    ctx.fillStyle = '#ffcc00';
    
    // Body
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Head
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y - 5, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
