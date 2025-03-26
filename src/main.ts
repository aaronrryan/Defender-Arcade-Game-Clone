import './style.css';
import { Game } from './game/Game';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="gameCanvas"></canvas>
    <div class="controls">
      <p>Controls: Arrow keys to move, Space/Z to shoot</p>
      <p>Mission: Rescue humans and destroy enemy ships</p>
    </div>
  </div>
`;

// Initialize and start the game
window.addEventListener('load', () => {
  const game = new Game();
  game.start();
});
