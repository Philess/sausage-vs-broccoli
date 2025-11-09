import { useEffect, useRef } from 'react'
import { Player, Enemy, Platform } from '@/lib/types'
import { GAME_WIDTH, GAME_HEIGHT } from '@/lib/gameLogic'

interface GameCanvasProps {
  player: Player
  enemies: Enemy[]
  platforms: Platform[]
}

export function GameCanvas({ player, enemies, platforms }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT)

    platforms.forEach((platform) => {
      ctx.fillStyle = 'oklch(0.6 0.05 230)'
      ctx.strokeStyle = 'oklch(0.5 0.08 230)'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(platform.x, platform.y, platform.width, platform.height, 8)
      ctx.fill()
      ctx.stroke()
    })

    enemies.forEach((enemy) => {
      ctx.fillStyle = 'oklch(0.45 0.15 150)'
      ctx.strokeStyle = 'oklch(0.35 0.18 150)'
      ctx.lineWidth = 3
      
      const centerX = enemy.x + enemy.width / 2
      const centerY = enemy.y + enemy.height / 2
      
      ctx.beginPath()
      ctx.arc(centerX, centerY - 8, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(centerX - 8, centerY - 5, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      ctx.beginPath()
      ctx.arc(centerX + 8, centerY - 5, 10, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      ctx.fillStyle = 'oklch(0.55 0.15 150)'
      ctx.beginPath()
      ctx.roundRect(enemy.x + 5, centerY, enemy.width - 10, enemy.height / 2, 4)
      ctx.fill()
      ctx.strokeStyle = 'oklch(0.35 0.18 150)'
      ctx.stroke()

      ctx.fillStyle = 'oklch(0.1 0 0)'
      const eyeY = centerY - 2
      ctx.beginPath()
      ctx.arc(centerX - 6, eyeY, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(centerX + 6, eyeY, 2, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.fillStyle = 'oklch(0.55 0.08 50)'
    ctx.strokeStyle = 'oklch(0.45 0.1 45)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(player.x, player.y, player.width, player.height, 20)
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = 'oklch(0.5 0.09 48)'
    const segments = 4
    const segmentWidth = player.width / segments
    for (let i = 1; i < segments; i++) {
      ctx.beginPath()
      ctx.arc(player.x + segmentWidth * i, player.y + player.height / 2, player.height / 2, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = 'oklch(0.1 0 0)'
    const eyeX = player.x + player.width - 12
    const eyeY = player.y + 12
    ctx.beginPath()
    ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'oklch(0.1 0 0)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(eyeX - 2, eyeY + 8, 4, 0, Math.PI)
    ctx.stroke()
  }, [player, enemies, platforms])

  return (
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      className="border-4 border-border rounded-lg shadow-2xl bg-background/50"
    />
  )
}
