import { Player, Enemy, Platform } from './types'

export const GAME_WIDTH = 800
export const GAME_HEIGHT = 600
export const GRAVITY = 0.6
export const JUMP_FORCE = -15
export const MOVE_SPEED = 5
export const ENEMY_SPEED = 2

export const PLAYER_SIZE = 40
export const ENEMY_SIZE = 35
export const PLATFORM_HEIGHT = 20

export const PLATFORMS: Platform[] = [
  { x: 0, y: GAME_HEIGHT - 50, width: GAME_WIDTH, height: PLATFORM_HEIGHT },
  { x: 100, y: 450, width: 150, height: PLATFORM_HEIGHT },
  { x: 350, y: 380, width: 200, height: PLATFORM_HEIGHT },
  { x: 600, y: 310, width: 150, height: PLATFORM_HEIGHT },
  { x: 250, y: 240, width: 180, height: PLATFORM_HEIGHT },
  { x: 500, y: 170, width: 150, height: PLATFORM_HEIGHT },
]

export function checkCollision(
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  )
}

export function checkPlatformCollision(
  obj: { x: number; y: number; width: number; height: number; velocityY: number },
  platform: Platform
): boolean {
  return (
    obj.velocityY >= 0 &&
    obj.x < platform.x + platform.width &&
    obj.x + obj.width > platform.x &&
    obj.y + obj.height >= platform.y &&
    obj.y + obj.height <= platform.y + platform.height + 10
  )
}

export function updatePlayer(
  player: Player,
  keys: { [key: string]: boolean },
  platforms: Platform[]
): Player {
  const newPlayer = { ...player }

  if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
    newPlayer.velocityX = -MOVE_SPEED
  } else if (keys['ArrowRight'] || keys['d'] || keys['D']) {
    newPlayer.velocityX = MOVE_SPEED
  } else {
    newPlayer.velocityX = 0
  }

  if ((keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' ']) && newPlayer.isGrounded) {
    newPlayer.velocityY = JUMP_FORCE
    newPlayer.isJumping = true
    newPlayer.isGrounded = false
  }

  newPlayer.velocityY += GRAVITY
  newPlayer.x += newPlayer.velocityX
  newPlayer.y += newPlayer.velocityY

  if (newPlayer.x < 0) newPlayer.x = 0
  if (newPlayer.x + newPlayer.width > GAME_WIDTH) {
    newPlayer.x = GAME_WIDTH - newPlayer.width
  }

  newPlayer.isGrounded = false
  for (const platform of platforms) {
    if (checkPlatformCollision(newPlayer, platform)) {
      newPlayer.y = platform.y - newPlayer.height
      newPlayer.velocityY = 0
      newPlayer.isJumping = false
      newPlayer.isGrounded = true
      break
    }
  }

  if (newPlayer.y > GAME_HEIGHT) {
    newPlayer.y = GAME_HEIGHT
    newPlayer.velocityY = 0
  }

  return newPlayer
}

export function updateEnemy(enemy: Enemy, platforms: Platform[]): Enemy {
  const newEnemy = { ...enemy }

  newEnemy.x += ENEMY_SPEED * newEnemy.direction

  if (newEnemy.x <= newEnemy.patrolStart || newEnemy.x >= newEnemy.patrolEnd) {
    newEnemy.direction = newEnemy.direction === 1 ? -1 : 1
  }

  newEnemy.velocityY += GRAVITY
  newEnemy.y += newEnemy.velocityY

  for (const platform of platforms) {
    if (checkPlatformCollision(newEnemy, platform)) {
      newEnemy.y = platform.y - newEnemy.height
      newEnemy.velocityY = 0
      break
    }
  }

  return newEnemy
}

export function checkEnemyDefeat(player: Player, enemy: Enemy): boolean {
  if (!checkCollision(player, enemy)) return false

  const playerBottom = player.y + player.height
  const enemyTop = enemy.y

  return player.velocityY > 0 && playerBottom - enemyTop < 15
}
