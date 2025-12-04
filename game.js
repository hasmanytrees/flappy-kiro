// Game constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

// Game configuration
const GRAVITY = 0.15;
const JUMP_POWER = -3;
const PIPE_SPEED = 1.5;
const PIPE_SPAWN_INTERVAL = 180;
const PIPE_GAP = 180;
const PIPE_WIDTH = 60;

// Colors from Kiro brand
const COLORS = {
    purple500: '#790ECB',
    purple400: '#9B3FE8',
    black900: '#0a0a0a',
    prey750: '#2a2a2a',
    prey700: '#3a3a3a',
    white: '#ffffff',
    prey300: '#b0b0b0'
};

// Game state
let gameState = 'start'; // 'start', 'playing', 'gameOver'
let score = 0;
let highScore = 0;
let lastHighScore = 0; // Track previous high score for confetti trigger
let frameCount = 0;

// Particle system
let particles = [];
let confettiTriggered = false; // Flag to prevent multiple confetti triggers per session

// Local storage key
const STORAGE_KEY = 'flappyKiroHighScore';

// Player object
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velocity: 0,
    rotation: 0,
    image: new Image()
};

// Pipes array
let pipes = [];

// Load Kiro logo
player.image.src = 'kiro-logo.png';

// Score persistence functions
function saveHighScore(score) {
    try {
        localStorage.setItem(STORAGE_KEY, score.toString());
    } catch (e) {
        console.error('Failed to save high score:', e);
    }
}

function loadHighScore() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === null) {
            return 0;
        }
        const parsed = parseInt(stored, 10);
        if (isNaN(parsed) || parsed < 0) {
            return 0;
        }
        return parsed;
    } catch (e) {
        console.error('Failed to load high score:', e);
        return 0;
    }
}

function updateHighScoreIfNeeded(currentScore) {
    if (currentScore > highScore) {
        // Trigger confetti only once per game session when new high score is achieved
        if (!confettiTriggered && highScore > 0) {
            createConfetti();
            confettiTriggered = true;
        }
        
        highScore = currentScore;
        saveHighScore(highScore);
    }
}

// Particle system functions
function updateParticles() {
    // Update all particles and remove dead ones
    for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        // Apply gravity to confetti particles
        if (particle.type === 'confetti') {
            particle.vy += 0.15; // Gravity acceleration
            
            // Update rotation
            if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
                particle.rotation += particle.rotationSpeed;
            }
        }
        
        // Update position based on velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Decrease life
        particle.life -= 1 / particle.maxLife;
        
        // Remove confetti particles that fall below canvas
        if (particle.type === 'confetti' && particle.y > canvas.height) {
            particles.splice(i, 1);
            continue;
        }
        
        // Remove particle if life reaches zero or below
        if (particle.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (const particle of particles) {
        // Skip particles with invalid data
        if (isNaN(particle.x) || isNaN(particle.y) || particle.life < 0) {
            continue;
        }
        
        ctx.save();
        
        // Set opacity based on particle type
        if (particle.type === 'sparkle') {
            // Twinkling effect: oscillate opacity with sine wave
            const twinkle = Math.sin(frameCount * 0.3 + particle.x) * 0.3 + 0.7;
            ctx.globalAlpha = Math.max(0, Math.min(1, particle.life * twinkle));
        } else if (particle.type === 'confetti') {
            // Confetti maintains full opacity until cleanup
            ctx.globalAlpha = 1.0;
        } else {
            // Standard fade out as life decreases
            ctx.globalAlpha = Math.max(0, Math.min(1, particle.life));
        }
        
        // Set color
        ctx.fillStyle = particle.color;
        
        // Draw confetti as rectangles with rotation
        if (particle.type === 'confetti' && particle.rotation !== undefined) {
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation);
            ctx.fillRect(-particle.size / 2, -particle.size, particle.size, particle.size * 2);
        } else {
            // Draw other particles as circles
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
}

function createTrailParticle(x, y) {
    particles.push({
        x: x,
        y: y,
        vx: 0,
        vy: 0,
        life: 1.0,
        maxLife: 30, // 30 frames lifetime
        size: 3,
        color: COLORS.purple500,
        type: 'trail'
    });
}

function createExplosion(x, y) {
    const particleCount = Math.floor(Math.random() * 6) + 15; // 15-20 particles
    
    for (let i = 0; i < particleCount; i++) {
        // Random angle for radial distribution
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const speed = Math.random() * 2 + 1; // Random speed 1-3
        
        // Alternate between purple and white colors
        const color = i % 2 === 0 ? COLORS.purple500 : COLORS.white;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            maxLife: Math.floor(Math.random() * 11) + 30, // 30-40 frames
            size: Math.random() * 2 + 2, // Size 2-4
            color: color,
            type: 'explosion'
        });
    }
}

function createSparkles(x, y) {
    const particleCount = Math.floor(Math.random() * 5) + 8; // 8-12 particles
    
    for (let i = 0; i < particleCount; i++) {
        // Random slight movement
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.5; // Slow movement
        
        // Alternate between purple and white colors for bright sparkles
        const color = Math.random() > 0.5 ? COLORS.purple400 : COLORS.white;
        
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.0,
            maxLife: Math.floor(Math.random() * 11) + 20, // 20-30 frames
            size: Math.random() * 2 + 2, // Size 2-4
            color: color,
            type: 'sparkle'
        });
    }
}

function createConfetti() {
    const particleCount = Math.floor(Math.random() * 11) + 30; // 30-40 particles
    
    // Complementary colors to purple: yellow/gold, cyan/teal
    const confettiColors = [
        COLORS.purple500,
        COLORS.purple400,
        COLORS.white,
        '#FFD700', // Gold
        '#FFA500', // Orange
        '#00CED1', // Cyan
        '#FF69B4'  // Pink
    ];
    
    for (let i = 0; i < particleCount; i++) {
        // Distribute particles across screen width
        const x = Math.random() * canvas.width;
        const y = -20; // Start above the screen
        
        // Random horizontal velocity (slight drift)
        const vx = (Math.random() - 0.5) * 2;
        
        // Initial downward velocity (will be affected by gravity)
        const vy = Math.random() * 2 + 1;
        
        // Random color from the palette
        const color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        
        // Random rotation for visual variety
        const rotation = Math.random() * Math.PI * 2;
        
        particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            life: 1.0,
            maxLife: 200, // Long lifetime for confetti
            size: Math.random() * 3 + 3, // Size 3-6
            color: color,
            type: 'confetti',
            rotation: rotation,
            rotationSpeed: (Math.random() - 0.5) * 0.2 // Rotation animation
        });
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleInput();
    }
});

canvas.addEventListener('click', () => {
    handleInput();
});

function handleInput() {
    if (gameState === 'start') {
        gameState = 'playing';
        resetGame();
    } else if (gameState === 'playing') {
        player.velocity = JUMP_POWER;
    } else if (gameState === 'gameOver') {
        gameState = 'start';
    }
}

function resetGame() {
    player.y = 300;
    player.velocity = 0;
    player.rotation = 0;
    pipes = [];
    score = 0;
    frameCount = 0;
    confettiTriggered = false; // Reset confetti flag for new game session
    updateScoreDisplay();
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score} | High Score: ${highScore}`;
}

function createPipe() {
    const minHeight = 50;
    const maxHeight = canvas.height - PIPE_GAP - minHeight;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    pipes.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomY: topHeight + PIPE_GAP,
        scored: false
    });
}

function updatePlayer() {
    if (gameState !== 'playing') return;
    
    // Apply gravity
    player.velocity += GRAVITY;
    player.y += player.velocity;
    
    // Calculate rotation based on velocity
    player.rotation = Math.min(Math.max(player.velocity * 3, -30), 90) * Math.PI / 180;
    
    // Generate trail particles every 2-3 frames
    if (frameCount % 3 === 0) {
        createTrailParticle(player.x + player.width / 2, player.y + player.height / 2);
    }
    
    // Check boundaries
    if (player.y + player.height > canvas.height || player.y < 0) {
        // Create explosion at collision point
        createExplosion(player.x + player.width / 2, player.y + player.height / 2);
        gameOver();
    }
}

function updatePipes() {
    if (gameState !== 'playing') return;
    
    // Spawn new pipes
    frameCount++;
    if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
        createPipe();
    }
    
    // Update pipe positions
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= PIPE_SPEED;
        
        // Check if player scored
        if (!pipes[i].scored && pipes[i].x + PIPE_WIDTH < player.x) {
            pipes[i].scored = true;
            score++;
            updateHighScoreIfNeeded(score);
            updateScoreDisplay();
            
            // Create sparkle effect at the center of the pipe gap
            const sparkleX = pipes[i].x + PIPE_WIDTH / 2;
            const sparkleY = pipes[i].topHeight + PIPE_GAP / 2;
            createSparkles(sparkleX, sparkleY);
        }
        
        // Remove off-screen pipes
        if (pipes[i].x + PIPE_WIDTH < 0) {
            pipes.splice(i, 1);
        }
    }
}

function checkCollisions() {
    if (gameState !== 'playing') return;
    
    for (const pipe of pipes) {
        // Check if player is in pipe's x range
        if (player.x + player.width > pipe.x && player.x < pipe.x + PIPE_WIDTH) {
            // Check collision with top or bottom pipe
            if (player.y < pipe.topHeight || player.y + player.height > pipe.bottomY) {
                // Create explosion at collision point
                createExplosion(player.x + player.width / 2, player.y + player.height / 2);
                gameOver();
            }
        }
    }
}

function gameOver() {
    gameState = 'gameOver';
    updateHighScoreIfNeeded(score);
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, COLORS.black900);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2);
    ctx.rotate(player.rotation);
    ctx.drawImage(
        player.image,
        -player.width / 2,
        -player.height / 2,
        player.width,
        player.height
    );
    ctx.restore();
}

function drawPipes() {
    ctx.fillStyle = COLORS.purple500;
    
    for (const pipe of pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        
        // Bottom pipe
        ctx.fillRect(
            pipe.x,
            pipe.bottomY,
            PIPE_WIDTH,
            canvas.height - pipe.bottomY
        );
        
        // Pipe caps
        ctx.fillStyle = COLORS.purple400;
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 20, PIPE_WIDTH + 10, 20);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 20);
        ctx.fillStyle = COLORS.purple500;
    }
}

function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Kiro', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '24px sans-serif';
    ctx.fillStyle = COLORS.prey300;
    ctx.fillText('Press SPACE or click to start!', canvas.width / 2, canvas.height / 2 + 20);
}

function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = COLORS.purple500;
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 70);
    
    ctx.fillStyle = COLORS.white;
    ctx.font = '32px sans-serif';
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 10);
    
    ctx.font = '28px sans-serif';
    ctx.fillStyle = COLORS.purple400;
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, canvas.height / 2 + 30);
    
    ctx.font = '20px sans-serif';
    ctx.fillStyle = COLORS.prey300;
    ctx.fillText('Press SPACE or click to restart', canvas.width / 2, canvas.height / 2 + 70);
}

function draw() {
    drawBackground();
    
    if (gameState === 'playing' || gameState === 'gameOver') {
        drawParticles(); // Draw particles before player (behind player)
        drawPipes();
        drawPlayer();
    }
    
    if (gameState === 'start') {
        drawStartScreen();
    } else if (gameState === 'gameOver') {
        drawGameOverScreen();
    }
}

function gameLoop() {
    updatePlayer();
    updatePipes();
    updateParticles(); // Update particles before drawing
    checkCollisions();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize high score on game load
highScore = loadHighScore();
updateScoreDisplay();

// Start the game loop
gameLoop();
