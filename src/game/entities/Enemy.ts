import { Game } from '../Game';
import { Human } from './Human';

export class Enemy {
  game: Game;
  x: number;
  y: number;
  width: number;
  height: number;
  speedX: number;
  speedY: number;
  direction: number; // 1 for right, -1 for left
  hasHuman: boolean;
  capturedHuman: Human | null;
  state: 'hunting' | 'capturing' | 'returning';
  stateTimer: number;

  constructor(x: number, y: number, game: Game) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 15;
    this.speedX = 0;
    this.speedY = 0;
    this.direction = x < game.width / 2 ? 1 : -1; // Face toward center initially
    this.hasHuman = false;
    this.capturedHuman = null;
    this.state = 'hunting';
    this.stateTimer = 0;
  }

  update(deltaTime: number) {
    this.stateTimer += deltaTime;
    
    switch (this.state) {
      case 'hunting':
        this.hunt(deltaTime);
        break;
      case 'capturing':
        this.capture(deltaTime);
        break;
      case 'returning':
        this.returnToTop(deltaTime);
        break;
    }
    
    // Update position
    this.x += this.speedX;
    this.y += this.speedY;
    
    // World boundaries
    if (this.x < 0) {
      this.x = 0;
      this.direction = 1;
    }
    if (this.x > this.game.worldWidth - this.width) {
      this.x = this.game.worldWidth - this.width;
      this.direction = -1;
    }
    if (this.y < 0) this.y = 0;
    if (this.y > this.game.height - this.height - 50) {
      this.y = this.game.height - this.height - 50;
      this.speedY = -this.speedY;
    }
    
    // Update captured human position
    if (this.hasHuman && this.capturedHuman) {
      this.capturedHuman.x = this.x + this.width / 2 - this.capturedHuman.width / 2;
      this.capturedHuman.y = this.y + this.height + 5;
      this.capturedHuman.isOnGround = false;
    }
  }

  hunt(deltaTime: number) {
    // Move toward player with some randomness
    const playerX = this.game.player.x;
    const playerY = this.game.player.y;
    
    // Horizontal movement
    if (playerX > this.x) {
      this.speedX = 2 + Math.random();
      this.direction = 1;
    } else {
      this.speedX = -2 - Math.random();
      this.direction = -1;
    }
    
    // Vertical movement with some randomness
    if (Math.abs(this.y - playerY) > 100) {
      if (playerY > this.y) {
        this.speedY = 1 + Math.random();
      } else {
        this.speedY = -1 - Math.random();
      }
    } else {
      this.speedY = (Math.random() - 0.5) * 2;
    }
    
    // Occasionally look for humans to capture
    if (this.stateTimer > 3000 && !this.hasHuman) {
      const nearestHuman = this.findNearestHuman();
      if (nearestHuman) {
        this.state = 'capturing';
        this.stateTimer = 0;
      }
    }
  }

  capture(deltaTime: number) {
    const nearestHuman = this.findNearestHuman();
    
    if (!nearestHuman) {
      this.state = 'hunting';
      return;
    }
    
    // Move toward human
    if (nearestHuman.x > this.x) {
      this.speedX = 3;
      this.direction = 1;
    } else {
      this.speedX = -3;
      this.direction = -1;
    }
    
    // Move down toward ground
    if (nearestHuman.y > this.y) {
      this.speedY = 2;
    } else {
      this.speedY = -0.5;
    }
    
    // If we've been trying to capture for too long, go back to hunting
    if (this.stateTimer > 5000) {
      this.state = 'hunting';
      this.stateTimer = 0;
    }
  }

  returnToTop(deltaTime: number) {
    // Move upward with captured human
    this.speedY = -2;
    this.speedX = this.direction * 1;
    
    // When we reach the top, remove human and go back to hunting
    if (this.y < 50) {
      if (this.hasHuman && this.capturedHuman) {
        this.hasHuman = false;
        this.capturedHuman = null;
        // Human is lost
        this.game.score -= 150;
      }
      this.state = 'hunting';
      this.stateTimer = 0;
    }
  }

  findNearestHuman() {
    let nearestHuman = null;
    let nearestDistance = Infinity;
    
    this.game.humans.forEach(human => {
      if (human.isOnGround) {
        const distance = Math.sqrt(
          Math.pow(this.x - human.x, 2) + 
          Math.pow(this.y - human.y, 2)
        );
        
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestHuman = human;
        }
      }
    });
    
    return nearestHuman;
  }

  captureHuman(human: Human) {
    this.hasHuman = true;
    this.capturedHuman = human;
    this.state = 'returning';
    this.stateTimer = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(this.direction, 1); // Flip based on direction
    
    // Enemy ship body
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(-this.width / 2, -this.height / 2);
    ctx.lineTo(-this.width / 3, 0);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(this.width / 2, 0);
    ctx.fill();
    
    // Enemy cockpit
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.arc(this.width / 6, 0, this.height / 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
    
    // Draw tractor beam if capturing
    if (this.hasHuman && this.capturedHuman) {
      ctx.strokeStyle = 'rgba(255, 255, 100, 0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, this.y + this.height);
      ctx.lineTo(
        this.capturedHuman.x + this.capturedHuman.width / 2, 
        this.capturedHuman.y
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
}
