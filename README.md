# 🎮 Flappy Kiro

A browser-based Flappy Bird clone featuring the Kiro logo, built with vanilla JavaScript and HTML5 Canvas. Navigate through purple pipe obstacles, rack up points, and beat your high score!

![Flappy Kiro](kiro-logo.png)

## ✨ Features

- **Classic Flappy Bird Mechanics** - Simple one-button control with physics-based movement
- **Particle Effects** - Trail particles, explosions on collision, sparkles on scoring, and confetti for new high scores
- **High Score Persistence** - Your best score is saved locally and persists across sessions
- **Kiro Brand Aesthetic** - Dark theme with purple accents matching Kiro's visual identity
- **Smooth Animations** - 60 FPS gameplay with rotation effects and responsive controls
- **No Dependencies** - Pure vanilla JavaScript, no frameworks or build tools required

## 🎯 How to Play

1. **Start**: Press `SPACE` or click anywhere to begin
2. **Jump**: Press `SPACE` or click to make Kiro jump
3. **Avoid**: Navigate through the gaps between purple pipes
4. **Score**: Earn points by successfully passing through each pipe gap
5. **Challenge**: Try to beat your high score!

## 🚀 Getting Started

### Play Instantly

Simply open `index.html` in any modern web browser. No installation or build process required!

### Local Development

For development with live reload:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Then navigate to `http://localhost:8000` in your browser.

## 🎨 Visual Design

The game features Kiro's brand colors:
- **Purple (#790ECB)** - Primary accent for pipes and UI elements
- **Dark backgrounds** - Clean, modern aesthetic
- **Smooth gradients** - Sky background with depth
- **Particle effects** - Visual feedback for all game events

## 🛠️ Technical Stack

- **HTML5 Canvas** - 2D rendering engine
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **CSS3** - Minimal styling for layout
- **LocalStorage API** - High score persistence

## 📁 Project Structure

```
flappy-kiro/
├── index.html           # Entry point with canvas and styles
├── game.js              # Complete game logic and rendering
├── kiro-logo.png        # Player sprite asset
└── README.md            # This file
```

## 🎮 Game Mechanics

- **Gravity**: 0.15 units/frame
- **Jump Power**: -3 units
- **Pipe Speed**: 1.5 units/frame
- **Pipe Gap**: 180 pixels
- **Spawn Interval**: Every 180 frames (~3 seconds at 60 FPS)

## 🏆 Features Breakdown

### Particle System
- **Trail Particles**: Follow the player during flight
- **Explosion Effects**: Dramatic collision feedback
- **Sparkle Effects**: Celebrate each successful pipe passage
- **Confetti**: Triggered when beating your high score

### Score System
- Real-time score tracking
- Persistent high score using LocalStorage
- Visual celebration for new records

### Physics
- Realistic gravity simulation
- Smooth jump mechanics
- Dynamic rotation based on velocity

## 🎓 Built For

This game was created as part of the AWS Re:Invent workshop, demonstrating game development with AI assistance and modern web technologies.

## 📝 License

MIT License - Feel free to use this project for learning and experimentation!

## 🤝 Contributing

This is a workshop project, but feel free to fork and experiment with your own variations!

---

Built with ❤️ using Kiro AI
