import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Bullet } from './entities/Bullet';
import { Human } from './entities/Human';
import { Explosion } from './entities/Explosion';
import { InputHandler } from './InputHandler';
import { UI } from './UI';
import { Terrain } from './Terrain';
import { Minimap } from './Minimap';

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  player: Player;
  enemies: Enemy[];
  bullets: Bullet[];
  humans: Human[];
  explosions: Explosion[];
  input: InputHandler;
  ui: UI;
  terrain: Terrain;
  minimap: Minimap;
  score: number;
  lives: number;
  gameOver: boolean;
  worldWidth: number;
  cameraOffset: number;
  enemySpawnTimer: number;
  enemySpawnInterval: number;
  lastTime: number;

  constructor() {
    this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // World is 5 times the screen width
    this.worldWidth = this.width * 5;
    this.cameraOffset = 0;
    
    this.player = new Player(this);
    this.enemies = [];
    this.bullets = [];
    this.humans = [];
    this.explosions = [];
    this.input = new InputHandler();
    this.ui = new UI(this);
    this.terrain = new Terrain(this);
    this.minimap = new Minimap(this);
    
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    
    this.enemySpawnTimer = 0;
    this.enemySpawnInterval = 2000; // milliseconds
    this.lastTime = 0;
    
    // Initialize humans
    this.initHumans();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });
  }

  start() {
    this.gameLoop(0);
  }

  gameLoop(timestamp: number) {
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(deltaTime);
    this.draw();
    
    if (!this.gameOver) {
      requestAnimationFrame(this.gameLoop.bind(this));
    } else {
      this.endGame();
    }
  }

  update(deltaTime: number) {
    // Update camera position based on player
    this.updateCamera();
    
    // Update player
    this.player.update(deltaTime);
    
    // Update bullets
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      
      // Remove bullets that are out of bounds
      if (bullet.x < this.cameraOffset - 100 || 
          bullet.x > this.cameraOffset + this.width + 100) {
        this.bullets.splice(index, 1);
      }
    });
    
    // Update enemies
    this.enemies.forEach((enemy, index) => {
      enemy.update(deltaTime);
      
      // Check for collisions with player bullets
      this.bullets.forEach((bullet, bulletIndex) => {
        if (bullet.isPlayerBullet && this.checkCollision(enemy, bullet)) {
          this.score += 100;
          this.explosions.push(new Explosion(enemy.x, enemy.y, this));
          this.enemies.splice(index, 1);
          this.bullets.splice(bulletIndex, 1);
        }
      });
      
      // Check for collisions with player
      if (this.checkCollision(enemy, this.player)) {
        this.lives--;
        this.explosions.push(new Explosion(this.player.x, this.player.y, this));
        this.enemies.splice(index, 1);
        
        if (this.lives <= 0) {
          this.gameOver = true;
        } else {
          this.player.reset();
        }
      }
      
      // Enemy shooting
      if (Math.random() < 0.01) {
        const bullet = new Bullet(
          enemy.x, 
          enemy.y, 
          enemy.direction * 8, 
          0, 
          false, 
          this
        );
        this.bullets.push(bullet);
      }
    });
    
    // Update humans
    this.humans.forEach((human, index) => {
      human.update(deltaTime);
      
      // Check if human is captured by enemy
      this.enemies.forEach(enemy => {
        if (enemy.hasHuman) return;
        
        if (this.checkCollision(enemy, human)) {
          enemy.captureHuman(human);
          this.humans.splice(index, 1);
        }
      });
      
      // Check if player rescues human
      if (this.checkCollision(human, this.player) && human.isOnGround) {
        this.score += 250;
        this.humans.splice(index, 1);
        // Spawn a new human elsewhere
        this.addHuman();
      }
    });
    
    // Update explosions
    this.explosions.forEach((explosion, index) => {
      explosion.update(deltaTime);
      if (explosion.isFinished) {
        this.explosions.splice(index, 1);
      }
    });
    
    // Spawn new enemies
    this.enemySpawnTimer += deltaTime;
    if (this.enemySpawnTimer > this.enemySpawnInterval) {
      this.enemySpawnTimer = 0;
      this.addEnemy();
    }
    
    // Update UI
    this.ui.update();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Save context state
    this.ctx.save();
    
    // Apply camera translation
    this.ctx.translate(-this.cameraOffset, 0);
    
    // Draw terrain
    this.terrain.draw(this.ctx);
    
    // Draw humans
    this.humans.forEach(human => human.draw(this.ctx));
    
    // Draw player
    this.player.draw(this.ctx);
    
    // Draw enemies
    this.enemies.forEach(enemy => enemy.draw(this.ctx));
    
    // Draw bullets
    this.bullets.forEach(bullet => bullet.draw(this.ctx));
    
    // Draw explosions
    this.explosions.forEach(explosion => explosion.draw(this.ctx));
    
    // Restore context state
    this.ctx.restore();
    
    // Draw UI elements (not affected by camera)
    this.ui.draw(this.ctx);
    
    // Draw minimap
    this.minimap.draw(this.ctx);
  }

  updateCamera() {
    // Camera follows player with some bounds
    this.cameraOffset = this.player.x - this.width / 2;
    
    // Ensure camera doesn't go beyond world bounds
    if (this.cameraOffset < 0) {
      this.cameraOffset = 0;
    } else if (this.cameraOffset > this.worldWidth - this.width) {
      this.cameraOffset = this.worldWidth - this.width;
    }
  }

  addEnemy() {
    // Spawn enemy randomly within the world but visible on screen
    const spawnX = Math.random() < 0.5 ? 
      this.cameraOffset - 100 : 
      this.cameraOffset + this.width + 100;
    
    const spawnY = Math.random() * (this.height * 0.7);
    const enemy = new Enemy(spawnX, spawnY, this);
    this.enemies.push(enemy);
  }

  initHumans() {
    // Add initial humans spread across the terrain
    for (let i = 0; i < 10; i++) {
      this.addHuman();
    }
  }

  addHuman() {
    const x = Math.random() * this.worldWidth;
    const human = new Human(x, this.height - 50, this);
    this.humans.push(human);
  }

  checkCollision(obj1: any, obj2: any) {
    return (
      obj1.x < obj2.x + obj2.width &&
      obj1.x + obj1.width > obj2.x &&
      obj1.y < obj2.y + obj2.height &&
      obj1.y + obj1.height > obj2.y
    );
  }

  endGame() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '48px "Courier New", Courier, monospace';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 50);
    
    this.ctx.font = '24px "Courier New", Courier, monospace';
    this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2);
    
    this.ctx.font = '18px "Courier New", Courier, monospace';
    this.ctx.fillText('Press F5 to play again', this.width / 2, this.height / 2 + 50);
  }
}
