# Technology Stack

## Core Technologies
- **HTML5 Canvas** - Primary rendering engine
- **Vanilla JavaScript** - No frameworks or build tools
- **CSS3** - Minimal styling for layout and canvas presentation

## Architecture
- Single-page application with no dependencies
- Client-side only (no backend required)
- Direct DOM manipulation and Canvas API usage

## File Structure
- `index.html` - Entry point with canvas element and inline styles
- `game.js` - Complete game logic and rendering
- `kiro-logo.png` - Player sprite asset

## Running the Game
Simply open `index.html` in any modern web browser. No build step or server required.

### Development
- Use any local web server for development (e.g., `python -m http.server` or VS Code Live Server)
- Browser DevTools for debugging
- No compilation or transpilation needed

## Key Libraries & APIs
- Canvas 2D Context API for rendering
- RequestAnimationFrame for game loop
- Image API for sprite loading
- Event listeners for input handling

## Performance Targets
- 60 FPS gameplay
- Immediate input response
- Smooth animations and transitions
