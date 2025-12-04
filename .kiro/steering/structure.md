# Project Structure

## File Organization

```
/
├── .kiro/
│   └── steering/          # AI assistant guidance files
├── .vscode/               # VS Code configuration
├── index.html             # Main HTML entry point
├── game.js                # Complete game implementation
└── kiro-logo.png          # Player sprite asset
```

## Code Organization (game.js)

### Constants Section
- Game physics parameters (gravity, jump power, pipe speed)
- Visual configuration (pipe dimensions, spawn intervals)
- Kiro brand color palette

### State Management
- `gameState` - Current game phase ('start', 'playing', 'gameOver')
- `score` - Player's current score
- `frameCount` - Animation frame counter
- `player` - Player object with position, velocity, rotation
- `pipes` - Array of active pipe obstacles

### Core Functions

**Game Loop**
- `gameLoop()` - Main update/render cycle using requestAnimationFrame

**Update Logic**
- `updatePlayer()` - Physics and boundary checks
- `updatePipes()` - Pipe movement and spawning
- `checkCollisions()` - Collision detection between player and pipes

**Rendering**
- `draw()` - Master draw function
- `drawBackground()` - Gradient sky rendering
- `drawPlayer()` - Sprite rendering with rotation
- `drawPipes()` - Obstacle rendering
- `drawStartScreen()` - Title screen overlay
- `drawGameOverScreen()` - Game over overlay

**Game Management**
- `handleInput()` - Unified input handler for keyboard and mouse
- `resetGame()` - Reset state for new game
- `gameOver()` - Transition to game over state
- `createPipe()` - Spawn new obstacle with random height

## Styling Approach
Inline CSS in `index.html` for simplicity. Minimal styling focused on:
- Centering the canvas
- Dark background matching game aesthetic
- Purple border and glow effect on canvas
- Score display styling

## Asset Management
Single image asset (`kiro-logo.png`) loaded via Image API and rendered to canvas.
