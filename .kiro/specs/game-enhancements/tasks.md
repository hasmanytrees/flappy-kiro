# Implementation Plan

- [x] 1. Implement score persistence with local storage
  - Create functions to save and load high score from browser local storage
  - Update game initialization to load high score on startup
  - Update score tracking to save high score when exceeded
  - Modify game over screen to display both current score and high score
  - Handle edge cases: missing storage, corrupted data, first-time players
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ]* 1.1 Write property test for score persistence
  - **Property 1: Score storage on game end**
  - **Validates: Requirements 1.1**

- [ ]* 1.2 Write property test for high score updates
  - **Property 3: High score update on exceed**
  - **Validates: Requirements 1.3**

- [ ]* 1.3 Write unit tests for score persistence edge cases
  - Test empty storage initialization
  - Test corrupted data handling
  - Test high score doesn't decrease
  - _Requirements: 1.5_

- [x] 2. Create particle system foundation
  - Add particles array to game state
  - Implement particle data structure with position, velocity, life, color, type
  - Create updateParticles() function to handle particle lifecycle
  - Create drawParticles() function to render all active particles
  - Integrate particle update and draw into main game loop
  - Implement particle cleanup when life reaches zero
  - _Requirements: 2.3, 3.4, 4.5_

- [ ]* 2.1 Write property test for particle lifecycle
  - **Property 5: Particle lifecycle management**
  - **Validates: Requirements 2.3, 3.4, 4.5**

- [ ]* 2.2 Write unit tests for particle system
  - Test particle array cleanup
  - Test particle rendering with invalid data
  - Test particle count limits
  - _Requirements: 2.3_

- [x] 3. Implement trail particles and explosion effects
  - Create createTrailParticle() function to spawn particles at player position
  - Add trail particle generation during gameplay (every 2-3 frames)
  - Implement trail particles with purple color and fade-out effect
  - Create createExplosion() function to generate radial particle burst
  - Hook explosion effect into collision detection
  - Configure explosion particles with outward velocities and purple/white colors
  - _Requirements: 2.1, 2.2, 2.4, 2.5, 3.1, 3.2, 3.3, 3.5_

- [ ]* 3.1 Write property test for trail particles
  - **Property 6: Trail particle generation during play**
  - **Property 7: Trail particle positioning**
  - **Property 8: Trail particle color**
  - **Validates: Requirements 2.1, 2.2, 2.4**

- [ ]* 3.2 Write property test for explosion effects
  - **Property 9: Explosion generation on collision**
  - **Property 10: Explosion particle velocities**
  - **Property 11: Explosion particle colors**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**

- [x] 4. Implement sparkle effects for successful pipe passes
  - Create createSparkles() function to generate particles at pipe location
  - Hook sparkle effect into pipe scoring logic
  - Configure sparkle particles with bright colors (purple/white)
  - Implement twinkling opacity animation for sparkles
  - Position sparkles at the center of the pipe gap
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ]* 4.1 Write property test for sparkle effects
  - **Property 12: Sparkle generation on score**
  - **Property 13: Sparkle particle colors**
  - **Validates: Requirements 4.1, 4.2, 4.4**

- [ ]* 4.2 Write unit tests for sparkle timing
  - Test sparkles trigger exactly once per pipe
  - Test sparkle positioning at pipe gap
  - _Requirements: 4.1_

- [x] 5. Implement confetti effect for new high scores
  - Create createConfetti() function to spawn particles across screen width
  - Add high score tracking to detect when new high score is achieved
  - Hook confetti trigger into score update logic
  - Implement confetti particles with gravity physics (falling motion)
  - Configure confetti with multiple colors and optional rotation
  - Add flag to prevent multiple confetti triggers per game session
  - Implement confetti cleanup when particles fall below canvas
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 5.1 Write property test for confetti trigger
  - **Property 14: Confetti trigger on new high score**
  - **Validates: Requirements 5.1**

- [ ]* 5.2 Write property test for confetti physics
  - **Property 15: Confetti particle distribution**
  - **Property 16: Confetti gravity application**
  - **Property 17: Confetti color variety**
  - **Property 18: Confetti cleanup**
  - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**

- [ ]* 5.3 Write unit tests for confetti behavior
  - Test confetti triggers only once per high score
  - Test confetti cleanup below canvas
  - _Requirements: 5.1, 5.5_

- [x] 6. Implement pause/unpause functionality
  - Add isPaused state variable to game state
  - Create togglePause() function to switch pause state
  - Add keyboard event listener for 'p' key press
  - Modify update functions (updatePlayer, updatePipes, updateParticles) to check isPaused before executing
  - Create drawPauseScreen() function to display pause overlay
  - Integrate pause screen rendering into main draw function
  - Ensure pause only works during 'playing' state
  - _Requirements: 6.1, 6.2_

- [ ]* 6.1 Write property test for pause toggle
  - **Property 19: Pause toggle on 'p' key press**
  - **Validates: Requirements 6.1, 6.2**

- [ ]* 6.2 Write property test for game state during pause
  - **Property 20: Game updates halt when paused**
  - **Validates: Requirements 6.1**

- [ ]* 6.3 Write unit tests for pause restrictions
  - Test pause only works during 'playing' state
  - Test pause doesn't affect start or game over screens
  - _Requirements: 6.1, 6.2_
