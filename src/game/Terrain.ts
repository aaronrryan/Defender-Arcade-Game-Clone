import { Game } from './Game';

export class Terrain {
  game: Game;
  groundLevel: number;
  segments: { x: number; height: number }[];
  segmentWidth: number;

  constructor(game: Game) {
    this.game = game;
    this.groundLevel = game.height - 30;
    this.segmentWidth = 50;
    this.segments = [];
    
    // Generate terrain segments
    this.generateTerrain();
  }

  generateTerrain() {
    const segmentCount = Math.ceil(this.game.worldWidth / this.segmentWidth);
    
    for (let i = 0; i < segmentCount; i++) {
      // Generate varying heights for terrain
      const height = 20 + Math.random() * 10;
      
      this.segments.push({
        x: i * this.segmentWidth,
        height: height
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#336633';
    
    // Draw terrain segments
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      
      ctx.fillRect(
        segment.x, 
        this.groundLevel, 
        this.segmentWidth, 
        segment.height
      );
    }
  }
}
