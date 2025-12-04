# Design Document: Game Enhancements

## Overview

This design extends the existing Flappy Kiro game with score persistence and visual effects. The enhancements maintain the vanilla JavaScript architecture while adding a particle system for visual feedback and local storage integration for score tracking. All features are implemented client-side with no external dependencies.

## Architecture

### High-Level Structure

The design follows the existing game architecture pattern:
- **Game Loop**: Single `requestAnimationFrame` loop handling updates and rendering
- **State Management**: Global state objects for game state, player, pipes, and new particle systems
- **Rendering Pipeline**: Canvas 2D context with layered drawing (background → particles → game objects → UI)
- **Storage Layer**: Browser Local Storage API for persistence

### New Components

1. **Particle System Manager**: Centralized particle lifecycle management
2. **Score Persistence Module**: Local storage read/write operations
3. **Effect Generators**: Factory functions for different particle effect types

## Components and Interfaces

### 1. Pause System

**Purpose**: Handle game pause/unpause functionality via keyboard input

**Interface**:
```javascript
// State variable
let isPaused = false;

// Functions
function togglePause()
function handlePauseInput(event)
```

**Responsibilities**:
- Listen for 'p' key press events
- Toggle pause state when 'p' is pressed
- Prevent game updates when paused
- Display pause indicator on screen
- Allow pause only during 'playing' state

### 2. Score Persistence Module

**Purpose**: Handle reading and writing scores to browser local storage

**Interface**:
```javascript
// Storage keys
const STORAGE_KEY = 'flappyKiroHighScore';

// Functions
function saveHighScore(score)
function loadHighScore()
function updateHighScoreIfNeeded(currentScore)
```

**Responsibilities**:
- Read high score from local storage on game initialization
- Write high score to local storage when exceeded
- Handle missing/corrupted storage data gracefully

### 2. Particle System

**Purpose**: Manage lifecycle of all particle effects in the game

**Data Structure**:
```javascript
const particles = [];

// Particle object structure
{
    x: number,           // Position X
    y: number,           // Position Y
    vx: number,          // Velocity X
    vy: number,          // Velocity Y
    life: number,        // Current lifetime (0-1)
    maxLife: number,     // Maximum lifetime in frames
    size: number,        // Particle size
    color: string,       // Particle color
    type: string         // 'trail', 'explosion', 'sparkle', 'confetti'
}
```

**Functions**:
```javascript
function updateParticles()
function drawParticles()
function createTrailParticle(x, y)
function createExplosion(x, y)
function createSparkles(x, y)
function createConfetti()
```

### 3. Effect Generators

#### Trail Particles
- **Trigger**: Every frame while game state is 'playing'
- **Behavior**: Spawn at player position, fade out over time, no velocity
- **Visual**: Small purple circles with decreasing opacity

#### Explosion Effect
- **Trigger**: On collision detection
- **Behavior**: 15-20 particles radiating outward from collision point with random velocities
- **Visual**: Mix of purple and white particles, medium size, fade over 30-40 frames

#### Sparkle Effect
- **Trigger**: When pipe is scored (pipe.scored becomes true)
- **Behavior**: 8-12 particles with slight random movement, twinkling opacity
- **Visual**: Small bright particles (white/purple), quick fade over 20-30 frames

#### Confetti Effect
- **Trigger**: When current score exceeds high score
- **Behavior**: 30-40 particles spawned across top of screen, fall with gravity
- **Visual**: Multiple colors (purple, white, complementary colors), rectangular shapes, rotate while falling

### 4. Pause System

**Purpose**: Allow players to pause and resume gameplay

**Behavior**:
- **Trigger**: 'p' key press during 'playing' state
- **Pause State**: Stops all game updates (player physics, pipe movement, particle updates)
- **Visual Feedback**: Semi-transparent overlay with "PAUSED" text and instructions
- **Resume**: Press 'p' again to unpause and continue gameplay
- **State Restrictions**: Pause only available during active gameplay, not on start or game over screens

## Data Models

### Extended Game State
```javascript
let isPaused = false;           // Pause state flag
let highScore = 0;              // Loaded from local storage
let lastHighScore = 0;          // Track previous high score for confetti trigger
let particles = [];             // Array of active particles
let confettiTriggered = false;  // Flag to prevent multiple confetti triggers
```

### Particle Object
```javascript
{
    x: number,
    y: number,
    vx: number,
    vy: number,
    life: number,        // 0 to 1, where 1 is newly created
    maxLife: number,     // Total frames before removal
    size: number,
    color: string,
    type: string,
    rotation: number     // Optional, for confetti
}
```

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Pause System Properties

**Property 19: Pause toggle on 'p' key press**
*For any* game in 'playing' state, pressing the 'p' key should toggle the isPaused flag from false to true or true to false.
**Validates: Requirements 6.1, 6.2**

**Property 20: Game updates halt when paused**
*For any* game frame while isPaused is true, player position, pipe positions, and score should remain unchanged.
**Validates: Requirements 6.1**

**Property 21: Pause only during gameplay**
*For any* game state other than 'playing', pressing the 'p' key should not change the isPaused flag.
**Validates: Requirements 6.1, 6.2**

### Score Persistence Properties

**Property 1: Score storage on game end**
*For any* game session with a final score, when the game ends, the score should be written to local storage and retrievable afterward.
**Validates: Requirements 1.1**

**Property 2: High score initialization**
*For any* game initialization, when the game starts, the high score should be loaded from local storage and match the previously stored value.
**Validates: Requirements 1.2**

**Property 3: High score update on exceed**
*For any* current score that exceeds the high score, the high score in local storage should be immediately updated to match the current score.
**Validates: Requirements 1.3**

**Property 4: Game over screen displays both scores**
*For any* game over state, the rendered game over screen should contain both the current score and the high score.
**Validates: Requirements 1.4**

### Particle System Properties

**Property 5: Particle lifecycle management**
*For any* particle in the system, its life value should decrease over time until it reaches zero, at which point it should be removed from the particles array.
**Validates: Requirements 2.3, 3.4, 4.5**

**Property 6: Trail particle generation during play**
*For any* frame where game state is 'playing', calling the update function should generate at least one new trail particle.
**Validates: Requirements 2.1**

**Property 7: Trail particle positioning**
*For any* trail particle created, its initial position should match the player's current position.
**Validates: Requirements 2.2**

**Property 8: Trail particle color**
*For any* trail particle, its color should be the Kiro brand purple color (#790ECB or #9B3FE8).
**Validates: Requirements 2.4**

**Property 9: Explosion generation on collision**
*For any* collision event, an explosion effect should be created with multiple particles (15-20) at the collision coordinates.
**Validates: Requirements 3.1, 3.2**

**Property 10: Explosion particle velocities**
*For any* explosion effect, all generated particles should have non-zero velocities radiating outward in different directions.
**Validates: Requirements 3.3**

**Property 11: Explosion particle colors**
*For any* explosion effect, the generated particles should include both purple and white colors.
**Validates: Requirements 3.5**

**Property 12: Sparkle generation on score**
*For any* pipe that is successfully passed (scored), a sparkle effect should be created at the pipe's position.
**Validates: Requirements 4.1, 4.2**

**Property 13: Sparkle particle colors**
*For any* sparkle effect, the generated particles should use bright colors including purple and white.
**Validates: Requirements 4.4**

**Property 14: Confetti trigger on new high score**
*For any* score increase that exceeds the previous high score, a confetti effect should be triggered exactly once.
**Validates: Requirements 5.1**

**Property 15: Confetti particle distribution**
*For any* confetti effect, multiple particles (30-40) should be generated with varied x-positions across the screen width.
**Validates: Requirements 5.2**

**Property 16: Confetti gravity application**
*For any* confetti particle, its y-velocity should increase over time (downward acceleration) simulating gravity.
**Validates: Requirements 5.3**

**Property 17: Confetti color variety**
*For any* confetti effect, the generated particles should use at least three different colors including purple and white.
**Validates: Requirements 5.4**

**Property 18: Confetti cleanup**
*For any* confetti particle whose y-position exceeds the canvas height, it should be removed from the particles array.
**Validates: Requirements 5.5**

## Error Handling

### Local Storage Errors
- **Missing Storage**: If local storage is unavailable, default high score to 0 and continue without persistence
- **Corrupted Data**: If stored high score is not a valid number, reset to 0
- **Storage Quota**: Unlikely with single number storage, but handle gracefully by logging error

### Particle System Errors
- **Memory Management**: Limit total active particles to prevent performance degradation (max 500 particles)
- **Invalid Particle Data**: Skip rendering particles with invalid properties (NaN positions, negative life)
- **Canvas Context Loss**: Gracefully handle context loss by skipping particle rendering for that frame

### Edge Cases
- **Rapid High Score Updates**: Use flag to prevent multiple confetti triggers in single game session
- **Game State Transitions**: Clear appropriate particles when transitioning between game states
- **Zero/Negative Scores**: Treat as valid scores, don't trigger high score updates for negative values

## Testing Strategy

### Unit Testing Approach

Unit tests will verify specific examples and edge cases:

**Score Persistence Tests**:
- Test loading high score when storage is empty (should return 0)
- Test saving and loading a specific high score value
- Test that high score doesn't decrease when current score is lower
- Test game over screen rendering includes both scores

**Particle System Tests**:
- Test that particle array is empty after all particles expire
- Test that explosion creates expected number of particles
- Test that confetti only triggers once per high score achievement
- Test particle cleanup when y-position exceeds canvas bounds

**Integration Tests**:
- Test complete game flow: play → score → game over → restart with persisted high score
- Test visual effects trigger at correct game events

### Property-Based Testing Approach

Property-based tests will verify universal properties across many random inputs using a JavaScript PBT library (fast-check or jsverify):

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with format: **Feature: game-enhancements, Property {number}: {property_text}**

**Property Tests**:

1. **Score Persistence Properties** (Properties 1-4):
   - Generate random scores and verify storage round-trip
   - Generate random high scores and verify update logic
   - Verify game over screen always contains both score values

2. **Particle Lifecycle Properties** (Property 5):
   - Generate random particles with various life values
   - Verify all particles eventually reach life=0 and are removed

3. **Trail Particle Properties** (Properties 6-8):
   - Generate random player positions
   - Verify trail particles spawn at correct positions with correct colors

4. **Explosion Properties** (Properties 9-11):
   - Generate random collision points
   - Verify explosion structure, velocities, and colors

5. **Sparkle Properties** (Properties 12-13):
   - Generate random pipe positions
   - Verify sparkle generation and colors

6. **Confetti Properties** (Properties 14-18):
   - Generate random score sequences
   - Verify confetti triggers, distribution, physics, and cleanup

**Test Organization**:
- Create `game.test.js` for unit tests
- Create `game.properties.test.js` for property-based tests
- Use browser-compatible test runner (Jest with jsdom or Vitest)

## Implementation Notes

### Performance Considerations
- Particle updates are O(n) where n is number of active particles
- Limit particle count to maintain 60 FPS target
- Use object pooling for particles if performance issues arise
- Trail particles should be spawned every 2-3 frames, not every frame

### Visual Polish
- Use `globalAlpha` for particle opacity based on life value
- Consider adding slight random variation to particle sizes
- Confetti particles can have rotation for more dynamic effect
- Layer particles behind player but above background

### Local Storage Best Practices
- Use try-catch blocks around all localStorage operations
- Validate data types when reading from storage
- Consider adding version key for future storage schema changes
- Keep storage operations synchronous (no async needed for single value)

### Integration with Existing Code
- Add particle update call in main game loop before draw
- Add particle draw call in draw function after background, before player
- Hook score persistence into existing `gameOver()` function
- Hook effect triggers into existing game events (collision, scoring)
- Add pause key listener to existing input handling
- Wrap update functions with pause check to prevent updates when paused
- Add pause indicator overlay in draw function when isPaused is true
