import { Game } from '../Game';

export class Bullet {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  isPlayerBullet: boolean;

  constructor(x: number, y: number, speedX: number, speedY: number, isPlayerBullet: boolean, game: Game) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 5;
    this.height = 3;
    this.speedX = speedX;
    this.speedY = speedY;
    this.isPlayerBullet = isPlayerBullet;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isPlayerBullet ? '#00ff00' : '#ff0000';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
