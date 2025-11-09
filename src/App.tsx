import { useEffect, useRef, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { GameCanvas } from '@/components/GameCanvas'
import { PhonkMusic } from '@/components/PhonkMusic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowsClockwise } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player, Enemy, GameState } from '@/lib/types'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLATFORMS,
  PLAYER_SIZE,
  ENEMY_SIZE,
  updatePlayer,
  updateEnemy,
  checkEnemyDefeat,
  checkCollision,
} from '@/lib/gameLogic'

function App() {
  const [highScore, setHighScore] = useKV<number>('sausage-highscore', 0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [score, setScore] = useState(0)
  const [player, setPlayer] = useState<Player>({
    x: 50,
    y: GAME_HEIGHT - 100,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isGrounded: false,
  })
  const [enemies, setEnemies] = useState<Enemy[]>([
    {
      id: '1',
      x: 150,
      y: 400,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      velocityX: 0,
      velocityY: 0,
      direction: 1,
      patrolStart: 100,
      patrolEnd: 220,
    },
    {
      id: '2',
      x: 400,
      y: 330,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      velocityX: 0,
      velocityY: 0,
      direction: -1,
      patrolStart: 350,
      patrolEnd: 520,
    },
    {
      id: '3',
      x: 630,
      y: 260,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      velocityX: 0,
      velocityY: 0,
      direction: 1,
      patrolStart: 600,
      patrolEnd: 720,
    },
    {
      id: '4',
      x: 280,
      y: 190,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      velocityX: 0,
      velocityY: 0,
      direction: -1,
      patrolStart: 250,
      patrolEnd: 400,
    },
    {
      id: '5',
      x: 540,
      y: 120,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      velocityX: 0,
      velocityY: 0,
      direction: 1,
      patrolStart: 500,
      patrolEnd: 620,
    },
  ])

  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const animationFrameId = useRef<number | undefined>(undefined)
  const lastScoreRef = useRef(score)

  useEffect(() => {
    if (score > lastScoreRef.current && score > (highScore ?? 0)) {
      setHighScore(() => score)
    }
    lastScoreRef.current = score
  }, [score, highScore, setHighScore])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
      return
    }

    const gameLoop = () => {
      setPlayer((prevPlayer) => {
        const updatedPlayer = updatePlayer(prevPlayer, keysPressed.current, PLATFORMS)
        return updatedPlayer
      })

      setEnemies((prevEnemies) => {
        const updatedEnemies = prevEnemies.map((enemy) => updateEnemy(enemy, PLATFORMS))
        return updatedEnemies
      })

      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    animationFrameId.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [gameState])

  useEffect(() => {
    if (gameState !== 'playing') return

    const defeatedEnemies: string[] = []

    enemies.forEach((enemy) => {
      if (checkEnemyDefeat(player, enemy)) {
        defeatedEnemies.push(enemy.id)
      } else if (checkCollision(player, enemy)) {
        setGameState('gameOver')
      }
    })

    if (defeatedEnemies.length > 0) {
      setEnemies((prev) => prev.filter((e) => !defeatedEnemies.includes(e.id)))
      setScore((prev) => prev + defeatedEnemies.length * 100)
      setPlayer((prev) => ({ ...prev, velocityY: -10 }))
    }

    if (enemies.length === 0 && gameState === 'playing') {
      setGameState('won')
    }
  }, [player, enemies, gameState])

  const resetGame = () => {
    setGameState('playing')
    setScore(0)
    setPlayer({
      x: 50,
      y: GAME_HEIGHT - 100,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      isGrounded: false,
    })
    setEnemies([
      {
        id: '1',
        x: 150,
        y: 400,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        velocityX: 0,
        velocityY: 0,
        direction: 1,
        patrolStart: 100,
        patrolEnd: 220,
      },
      {
        id: '2',
        x: 400,
        y: 330,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        velocityX: 0,
        velocityY: 0,
        direction: -1,
        patrolStart: 350,
        patrolEnd: 520,
      },
      {
        id: '3',
        x: 630,
        y: 260,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        velocityX: 0,
        velocityY: 0,
        direction: 1,
        patrolStart: 600,
        patrolEnd: 720,
      },
      {
        id: '4',
        x: 280,
        y: 190,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        velocityX: 0,
        velocityY: 0,
        direction: -1,
        patrolStart: 250,
        patrolEnd: 400,
      },
      {
        id: '5',
        x: 540,
        y: 120,
        width: ENEMY_SIZE,
        height: ENEMY_SIZE,
        velocityX: 0,
        velocityY: 0,
        direction: 1,
        patrolStart: 500,
        patrolEnd: 620,
      },
    ])
    keysPressed.current = {}
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h1 className="text-5xl font-bold text-foreground mb-2">Sausage vs Broccoli</h1>
        <p className="text-muted-foreground text-lg">Jump on the broccoli to defeat them!</p>
      </motion.div>

      <div className="flex gap-4 mb-4 items-center flex-wrap justify-center">
        <Badge variant="secondary" className="text-xl px-6 py-2">
          Score: <motion.span
            key={score}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
            className="ml-2 font-bold"
          >
            {score}
          </motion.span>
        </Badge>
        <Badge variant="outline" className="text-lg px-4 py-2">
          High Score: {highScore ?? 0}
        </Badge>
        <Badge variant="default" className="text-lg px-4 py-2 bg-secondary text-secondary-foreground">
          Broccoli Left: {enemies.length}
        </Badge>
        <PhonkMusic />
      </div>

      <div className="relative">
        <GameCanvas player={player} enemies={enemies} platforms={PLATFORMS} />

        <AnimatePresence>
          {gameState === 'gameOver' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Card className="w-96 shadow-2xl backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-destructive">Game Over!</CardTitle>
                  <CardDescription className="text-lg">
                    The broccoli got you!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-2xl font-semibold">Final Score: {score}</p>
                  <Button
                    size="lg"
                    onClick={resetGame}
                    className="gap-2 hover:scale-105 transition-transform"
                  >
                    <ArrowsClockwise size={20} weight="bold" />
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {gameState === 'won' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Card className="w-96 shadow-2xl backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Trophy size={64} weight="fill" className="text-accent" />
                  </div>
                  <CardTitle className="text-3xl text-accent-foreground">Victory!</CardTitle>
                  <CardDescription className="text-lg">
                    You defeated all the broccoli!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-2xl font-semibold">Final Score: {score}</p>
                  <Button
                    size="lg"
                    onClick={resetGame}
                    className="gap-2 hover:scale-105 transition-transform bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <ArrowsClockwise size={20} weight="bold" />
                    Play Again
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center text-muted-foreground"
      >
        <p className="text-sm">
          Controls: <kbd className="px-2 py-1 bg-muted rounded text-foreground font-semibold">Arrow Keys</kbd> or{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-foreground font-semibold">WASD</kbd> to move,{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-foreground font-semibold">Space</kbd> or{' '}
          <kbd className="px-2 py-1 bg-muted rounded text-foreground font-semibold">W/↑</kbd> to jump
        </p>
      </motion.div>
    </div>
  )
}

export default App
