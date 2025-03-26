import { Game } from '../Game';

export class Explosion {
  game: Game;
  x: number;
  y: number;
  size: number;
  particles: { x: number; y: number; size: number; speedX: number; speedY: number; life: number }[];
  timer: number;
  maxTime: number;
  isFinished: boolean;

  constructor(x: number, y: number, game: Game) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.size = 30;
    this.particles = [];
    this.timer = 0;
    this.maxTime = 500; // milliseconds
    this.isFinished = false;
    
    // Create explosion particles
    this.createParticles();
  }

  createParticles() {
    const particleCount = 20 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      
      this.particles.push({
        x: this.x,
        y: this.y,
        size: 1 + Math.random() * 3,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed,
        life: 300 + Math.random() * 200
      });
    }
  }

  update(deltaTime: number) {
    this.timer += deltaTime;
    
    if (this.timer >= this.maxTime) {
      this.isFinished = true;
    }
    
    // Update particles
    this.particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.life -= deltaTime;
      particle.size *= 0.95;
    });
    
    // Remove dead particles
    this.particles = this.particles.filter(particle => particle.life > 0);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    
    // Draw particles
    this.particles.forEach(particle => {
      const alpha = particle.life / 500;
      ctx.fillStyle = `rgba(255, 200, 50, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.restore();
  }
}
