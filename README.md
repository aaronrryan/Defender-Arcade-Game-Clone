# Defender Arcade Game

A modern web-based remake of the classic Defender arcade game, built with TypeScript and HTML Canvas.

## Overview

This project is a recreation of the iconic 1981 arcade game Defender, where players control a spaceship to defend humans from alien abduction. The game features smooth scrolling terrain, enemy AI, and classic arcade gameplay mechanics.

## Game Features

- **Player Spaceship**: Control your ship with arrow keys and shoot with Space/Z
- **Scrolling World**: Navigate a world 5x wider than the screen
- **Enemy AI**: Aliens hunt humans and try to abduct them
- **Rescue Missions**: Save humans from being abducted for bonus points
- **Score System**: Earn points by destroying enemies and saving humans

## Controls

- **Arrow Keys**: Move the spaceship (Up, Down, Left, Right)
- **Space / Z**: Fire weapons
- **F5**: Restart game after Game Over

## Game Mechanics

### Player
- The player controls a spaceship that can move in all directions
- The ship has a limited firing rate for its weapons
- Players have 3 lives to complete the game

### Enemies
- Enemies hunt both the player and humans on the ground
- They attempt to capture humans and take them to the top of the screen
- If successful, the player loses points

### Humans
- Humans are scattered across the terrain
- They need to be protected from enemy abduction
- Rescuing a captured human awards bonus points

### Scoring
- Destroying an enemy: 100 points
- Rescuing a human: 250 points
- Losing a human: -150 points

## Technical Implementation

The game is built using an entity-based architecture with the following components:

### Core Classes
- **Game**: Central controller that manages the game loop and entities
- **InputHandler**: Processes keyboard input
- **UI**: Renders score, lives, and game messages
- **Terrain**: Generates and renders the game's landscape
- **Minimap**: Provides an overview of the entire game world

### Entity Classes
- **Player**: The player-controlled spaceship
- **Enemy**: Alien ships that hunt humans
- **Human**: Characters that need to be protected
- **Bullet**: Projectiles fired by the player and enemies
- **Explosion**: Visual effects when entities are destroyed

## Development

### Prerequisites
- Node.js and npm

### Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open the provided URL in your browser

### Building for Production
```
npm run build
```

## Future Enhancements
- Multiple levels with increasing difficulty
- Power-ups and special weapons
- Mobile touch controls
- High score leaderboard
- Sound effects and music

## License
[MIT License](LICENSE)
