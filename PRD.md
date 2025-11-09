# Planning Guide

A side-scrolling platform game where a brave sausage hero battles against evil broccoli enemies across multiple platforms.

**Experience Qualities**: 
1. **Playful** - Whimsical food-themed characters and lighthearted combat create a fun, approachable gaming experience
2. **Responsive** - Tight controls and immediate feedback make jumping and combat feel satisfying
3. **Energetic** - Fast-paced action with smooth animations keeps players engaged

**Complexity Level**: Light Application (multiple features with basic state)
  - Game features include character movement, jumping mechanics, enemy AI, collision detection, score tracking, **multi-level progression**, and game state management (playing, game over, win)

## Essential Features

### Character Movement
- **Functionality**: WASD/Arrow key controls for left/right movement and jumping with physics-based gravity
- **Purpose**: Core gameplay mechanic for navigating platforms and avoiding enemies
- **Trigger**: Keyboard input during active gameplay
- **Progression**: Key press → Character accelerates in direction → Release key → Character decelerates → Jump key → Apply upward velocity → Gravity pulls down → Land on platform
- **Success criteria**: Smooth, predictable movement with realistic jump arcs and platform collision

### Enemy Behavior
- **Functionality**: Broccoli enemies patrol platforms with simple AI movement patterns
- **Purpose**: Provide challenge and obstacles for the player to overcome
- **Trigger**: Game start and continuous during gameplay
- **Progression**: Spawn enemy → Move in patrol pattern → Detect platform edges → Reverse direction → Collision with player → Damage/game over
- **Success criteria**: Enemies move predictably, stay on platforms, and detect player collision

### Combat System
- **Functionality**: Jump on enemies to defeat them, earn points, and remove threats
- **Purpose**: Primary gameplay objective and scoring mechanism
- **Trigger**: Player collision with enemy from above
- **Progression**: Player jumps → Lands on enemy from above → Enemy defeated → Score increases → Enemy removed from game
- **Success criteria**: Clear visual feedback, satisfying enemy defeat animation, accurate hit detection

### Score & Game State
- **Functionality**: Track defeated enemies, display score, detect win/loss conditions, **progress through 5 unique levels**
- **Purpose**: Provide goals, feedback, and game progression with increasing difficulty
- **Trigger**: Continuous during gameplay
- **Progression**: Game starts → Score at 0 → Defeat enemy → Score increases → All enemies defeated → **Level complete screen → Next level** OR Touch enemy from side/below → Game over screen
- **Success criteria**: Persistent score display, clear win/loss screens with restart option, **seamless level transitions, increasing challenge**

### Level Progression
- **Functionality**: 5 unique levels with varying platform layouts and enemy counts
- **Purpose**: Provide progressive challenge and keep gameplay fresh
- **Trigger**: Completing all enemies in current level
- **Progression**: Clear level → Victory screen appears → Click "Next Level" → Level loads → New platform layout → More enemies → Continue playing
- **Success criteria**: Each level feels distinct, difficulty increases naturally, smooth transitions between levels

## Edge Case Handling

- **Multiple simultaneous collisions**: Process jump-kill before side-collision damage to reward skillful play
- **Platform edge cases**: Prevent character from falling through platforms or getting stuck in walls
- **Rapid key presses**: Debounce jump input to prevent double-jumps or physics glitches
- **Window resize**: Scale game canvas proportionally while maintaining aspect ratio
- **No keyboard access**: Display control instructions prominently for new players
- **Level transition state**: Ensure player can't move during victory/game over screens
- **Score persistence**: High score persists across all level attempts

## Design Direction

The design should feel playful and cartoon-like with vibrant colors, rounded shapes, and bouncy animations that emphasize the humorous food-versus-veggie theme - a minimal interface keeps focus on the action.

## Color Selection

Triadic color scheme using food-inspired colors that create visual contrast between hero, enemies, and environment

- **Primary Color**: Warm Brown (sausage color oklch(0.55 0.08 50)) - represents the hero and communicates warmth and approachability
- **Secondary Colors**: 
  - Forest Green (broccoli color oklch(0.45 0.15 150)) - enemy color that contrasts with hero
  - Sky Blue (platform/background oklch(0.85 0.08 230)) - calming background that doesn't compete for attention
- **Accent Color**: Sunny Yellow (oklch(0.88 0.15 95)) - score highlights and victory states
- **Foreground/Background Pairings**:
  - Background (Sky Blue oklch(0.85 0.08 230)): Dark text oklch(0.2 0 0) - Ratio 11.5:1 ✓
  - Primary (Warm Brown oklch(0.55 0.08 50)): White text oklch(1 0 0) - Ratio 4.8:1 ✓
  - Secondary (Forest Green oklch(0.45 0.15 150)): White text oklch(1 0 0) - Ratio 5.2:1 ✓
  - Accent (Sunny Yellow oklch(0.88 0.15 95)): Dark text oklch(0.2 0 0) - Ratio 12.8:1 ✓

## Font Selection

Bold, rounded sans-serif typography that matches the playful, cartoon aesthetic of the food characters

- **Typographic Hierarchy**: 
  - H1 (Game Title): Fredoka Bold/48px/tight letter spacing - playful rounded font for title
  - Score Display: Fredoka SemiBold/24px/normal spacing - clear readability during gameplay
  - UI Text: Fredoka Medium/16px/relaxed spacing - instructions and buttons

## Animations

Bouncy, exaggerated animations emphasize the playful food theme with satisfying physics and character reactions

- **Purposeful Meaning**: Spring-based physics and squash-stretch effects reinforce the cartoonish, food-based characters
- **Hierarchy of Movement**: 
  - Critical: Jump arcs and enemy defeat (immediate, satisfying feedback)
  - Important: Character landing bounce, enemy patrol movement
  - Subtle: Score number increment, idle character bobbing

## Component Selection

- **Components**: 
  - Card (game over/win screens with glassmorphic background)
  - Button (restart, **next level**, customized with rounded corners and bounce hover effect)
  - Custom canvas component for game rendering
  - Badge (score display, **level indicator**, with pulsing animation on score increase)
- **Customizations**: 
  - Custom game canvas component with requestAnimationFrame loop
  - Custom character/enemy sprites using CSS or canvas drawing
  - Score badge with Tailwind ring and shadow effects
  - **Level configuration system with unique platform layouts**
- **States**: 
  - Buttons: Subtle scale on hover (1.05x), deeper press on active (0.95x), disabled state with reduced opacity
  - Game canvas: Active gameplay vs paused vs game-over overlays
  - Score: Pulse animation when incremented
  - **Level transitions: Victory card with "Next Level" button or final "Play Again" for last level**
- **Icon Selection**: 
  - Trophy (victory screen)
  - ArrowsClockwise (restart button)
  - **ArrowRight (next level button)**
  - Heart (lives/health if implemented)
- **Spacing**: 
  - Consistent 4-unit spacing (1rem) between UI elements
  - 8-unit padding (2rem) for card containers
  - 2-unit gap (0.5rem) for inline elements
- **Mobile**: 
  - On-screen touch controls appear below canvas on mobile
  - Canvas scales to fit viewport width while maintaining 16:9 aspect ratio
  - Larger touch targets (min 48px) for mobile buttons
  - Simplified particle effects on mobile for performance
