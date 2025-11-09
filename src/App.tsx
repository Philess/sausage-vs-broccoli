import { useEffect, useRef, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { useSoundEffects } from '@/hooks/use-sound-effects'
import { GameCanvas } from '@/components/GameCanvas'
import { PhonkMusic, PhonkMusicRef } from '@/components/PhonkMusic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, ArrowsClockwise, ArrowRight } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Player, Enemy, GameState } from '@/lib/types'
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SIZE,
  ENEMY_SIZE,
  updatePlayer,
  updateEnemy,
  checkEnemyDefeat,
  checkCollision,
} from '@/lib/gameLogic'
import { LEVELS } from '@/lib/levels'

function App() {
  const [highScore, setHighScore] = useKV<number>('sausage-highscore', 0)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const [gameState, setGameState] = useState<GameState>('playing')
  const [score, setScore] = useState(0)
  const musicRef = useRef<PhonkMusicRef>(null)
  const { playEnemyDefeatSound, playGameOverSound, playVictorySound } = useSoundEffects()
  
  const currentLevel = LEVELS[currentLevelIndex]
  
  const [player, setPlayer] = useState<Player>({
    x: currentLevel.playerStartX,
    y: currentLevel.playerStartY,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    velocityX: 0,
    velocityY: 0,
    isJumping: false,
    isGrounded: false,
  })
  const [enemies, setEnemies] = useState<Enemy[]>(currentLevel.enemies)

  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const animationFrameId = useRef<number | undefined>(undefined)
  const lastScoreRef = useRef(score)
  const hasPlayedGameOverSound = useRef(false)
  const hasPlayedVictorySound = useRef(false)

  useEffect(() => {
    musicRef.current?.play()
  }, [])

  useEffect(() => {
    if (gameState === 'gameOver' && !hasPlayedGameOverSound.current) {
      playGameOverSound()
      hasPlayedGameOverSound.current = true
      musicRef.current?.stop()
    } else if (gameState === 'won' && !hasPlayedVictorySound.current) {
      playVictorySound()
      hasPlayedVictorySound.current = true
      musicRef.current?.stop()
    }
  }, [gameState, playGameOverSound, playVictorySound])

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
        const updatedPlayer = updatePlayer(prevPlayer, keysPressed.current, currentLevel.platforms)
        return updatedPlayer
      })

      setEnemies((prevEnemies) => {
        const updatedEnemies = prevEnemies.map((enemy) => updateEnemy(enemy, currentLevel.platforms))
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
      playEnemyDefeatSound()
      setEnemies((prev) => prev.filter((e) => !defeatedEnemies.includes(e.id)))
      setScore((prev) => prev + defeatedEnemies.length * 100)
      setPlayer((prev) => ({ ...prev, velocityY: -10 }))
    }

    if (enemies.length === 0 && gameState === 'playing') {
      setGameState('won')
    }
  }, [player, enemies, gameState, playEnemyDefeatSound])

  const loadLevel = (levelIndex: number) => {
    const level = LEVELS[levelIndex]
    setPlayer({
      x: level.playerStartX,
      y: level.playerStartY,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      velocityX: 0,
      velocityY: 0,
      isJumping: false,
      isGrounded: false,
    })
    setEnemies(level.enemies)
    setCurrentLevelIndex(levelIndex)
  }

  const nextLevel = () => {
    if (currentLevelIndex < LEVELS.length - 1) {
      loadLevel(currentLevelIndex + 1)
      setGameState('playing')
      hasPlayedGameOverSound.current = false
      hasPlayedVictorySound.current = false
      musicRef.current?.play()
      keysPressed.current = {}
    }
  }

  const resetGame = () => {
    setScore(0)
    setCurrentLevelIndex(0)
    loadLevel(0)
    setGameState('playing')
    hasPlayedGameOverSound.current = false
    hasPlayedVictorySound.current = false
    musicRef.current?.play()
    keysPressed.current = {}
  }

  const retryLevel = () => {
    loadLevel(currentLevelIndex)
    setGameState('playing')
    hasPlayedGameOverSound.current = false
    hasPlayedVictorySound.current = false
    musicRef.current?.play()
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
        <Badge variant="default" className="text-lg px-4 py-2 bg-accent text-accent-foreground">
          Level {currentLevel.number}: {currentLevel.name}
        </Badge>
        <Badge variant="default" className="text-lg px-4 py-2 bg-secondary text-secondary-foreground">
          Broccoli Left: {enemies.length}
        </Badge>
        <PhonkMusic ref={musicRef} />
      </div>

      <div className="relative">
        <GameCanvas player={player} enemies={enemies} platforms={currentLevel.platforms} />

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
                    The broccoli got you on Level {currentLevel.number}!
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-2xl font-semibold">Score: {score}</p>
                  <div className="flex gap-3">
                    <Button
                      size="lg"
                      onClick={retryLevel}
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      <ArrowsClockwise size={20} weight="bold" />
                      Retry Level
                    </Button>
                    <Button
                      size="lg"
                      onClick={resetGame}
                      variant="outline"
                      className="gap-2 hover:scale-105 transition-transform"
                    >
                      Start Over
                    </Button>
                  </div>
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
                  <CardTitle className="text-3xl text-accent-foreground">
                    {currentLevelIndex === LEVELS.length - 1 ? 'All Levels Complete!' : 'Level Complete!'}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {currentLevelIndex === LEVELS.length - 1 
                      ? 'You defeated all the broccoli in every level!' 
                      : `You cleared ${currentLevel.name}!`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                  <p className="text-2xl font-semibold">Score: {score}</p>
                  <div className="flex gap-3">
                    {currentLevelIndex < LEVELS.length - 1 ? (
                      <>
                        <Button
                          size="lg"
                          onClick={nextLevel}
                          className="gap-2 hover:scale-105 transition-transform bg-accent text-accent-foreground hover:bg-accent/90"
                        >
                          Next Level
                          <ArrowRight size={20} weight="bold" />
                        </Button>
                        <Button
                          size="lg"
                          onClick={resetGame}
                          variant="outline"
                          className="gap-2 hover:scale-105 transition-transform"
                        >
                          <ArrowsClockwise size={20} weight="bold" />
                          Start Over
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="lg"
                        onClick={resetGame}
                        className="gap-2 hover:scale-105 transition-transform bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <ArrowsClockwise size={20} weight="bold" />
                        Play Again
                      </Button>
                    )}
                  </div>
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
