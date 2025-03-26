import { Game } from '../Game';
import { Bullet } from './Bullet';

export class Player {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  maxSpeed: number;
  direction: number; // 1 for right, -1 for left
  shootTimer: number;
  shootCooldown: number;
  thrustParticles: { x: number; y: number; size: number; life: number }[];

  constructor(game: Game) {
    this.game = game;
    this.width = 40;
    this.height = 20;
    this.x = game.width / 2;
    this.y = game.height / 2;
    this.speedX = 0;
    this.speedY = 0;
    this.maxSpeed = 8;
    this.direction = 1; // Start facing right
    this.shootTimer = 0;
    this.shootCooldown = 200; // milliseconds
    this.thrustParticles = [];
  }

  update(deltaTime: number) {
    // Handle movement
    if (this.game.input.keys.ArrowLeft) {
      this.speedX = Math.max(this.speedX - 0.5, -this.maxSpeed);
      this.direction = -1;
    } else if (this.game.input.keys.ArrowRight) {
      this.speedX = Math.min(this.speedX + 0.5, this.maxSpeed);
      this.direction = 1;
    } else {
      // Apply friction
      this.speedX *= 0.95;
    }

    if (this.game.input.keys.ArrowUp) {
      this.speedY = Math.max(this.speedY - 0.5, -this.maxSpeed);
      this.addThrustParticle();
    } else if (this.game.input.keys.ArrowDown) {
      this.speedY = Math.min(this.speedY + 0.5, this.maxSpeed);
    } else {
      // Apply vertical friction
      this.speedY *= 0.95;
    }

    // Update position
    this.x += this.speedX;
    this.y += this.speedY;

    // World boundaries
    if (this.x < 0) this.x = 0;
    if (this.x > this.game.worldWidth - this.width) this.x = this.game.worldWidth - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y > this.game.height - this.height - 50) {
      this.y = this.game.height - this.height - 50;
      this.speedY = 0;
    }

    // Handle shooting
    if (this.shootTimer > 0) {
      this.shootTimer -= deltaTime;
    }

    if ((this.game.input.keys.Space || this.game.input.keys.KeyZ) && this.shootTimer <= 0) {
      this.shoot();
      this.shootTimer = this.shootCooldown;
    }

    // Update thrust particles
    this.thrustParticles.forEach((particle, index) => {
      particle.x -= this.direction * 2;
      particle.life -= deltaTime;
      particle.size *= 0.95;
      
      if (particle.life <= 0) {
        this.thrustParticles.splice(index, 1);
      }
    });
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw thrust particles
    this.thrustParticles.forEach(particle => {
      ctx.fillStyle = `rgba(255, 100, 0, ${particle.life / 500})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw player ship
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(this.direction, 1); // Flip based on direction
    
    // Ship body
    ctx.fillStyle = '#0088ff';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(-this.width / 2, -this.height / 2);
    ctx.lineTo(-this.width / 3, 0);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, 0);
    ctx.fill();
    
    // Cockpit
    ctx.fillStyle = '#ccffff';
    ctx.beginPath();
    ctx.arc(this.width / 6, 0, this.height / 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }

  shoot() {
    const bulletX = this.direction > 0 ? this.x + this.width : this.x;
    const bulletY = this.y + this.height / 2;
    const bullet = new Bullet(bulletX, bulletY, this.direction * 12, 0, true, this.game);
    this.game.bullets.push(bullet);
  }

  addThrustParticle() {
    const particleX = this.direction > 0 ? this.x : this.x + this.width;
    const particleY = this.y + this.height / 2 + (Math.random() * 10 - 5);
    
    this.thrustParticles.push({
      x: particleX,
      y: particleY,
      size: 3 + Math.random() * 3,
      life: 300 + Math.random() * 200
    });
  }

  reset() {
    this.x = this.game.width / 2;
    this.y = this.game.height / 2;
    this.speedX = 0;
    this.speedY = 0;
  }
}
