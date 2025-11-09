export interface GameObject {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
}

export interface Player extends GameObject {
  isJumping: boolean
  isGrounded: boolean
}

export interface Enemy extends GameObject {
  id: string
  direction: 1 | -1
  patrolStart: number
  patrolEnd: number
}

export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

export type GameState = 'playing' | 'gameOver' | 'won'
