import { useEffect, useRef } from 'react'

export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    audioContextRef.current = new AudioContext()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  const playEnemyDefeatSound = () => {
    const context = audioContextRef.current
    if (!context) return

    context.resume()
    const now = context.currentTime

    const osc = context.createOscillator()
    const gainNode = context.createGain()

    osc.type = 'square'
    osc.frequency.setValueAtTime(400, now)
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1)

    gainNode.gain.setValueAtTime(0.3, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    osc.connect(gainNode)
    gainNode.connect(context.destination)

    osc.start(now)
    osc.stop(now + 0.15)
  }

  const playGameOverSound = () => {
    const context = audioContextRef.current
    if (!context) return

    context.resume()
    const now = context.currentTime

    const osc1 = context.createOscillator()
    const osc2 = context.createOscillator()
    const gainNode = context.createGain()

    osc1.type = 'sawtooth'
    osc2.type = 'sine'

    osc1.frequency.setValueAtTime(300, now)
    osc1.frequency.exponentialRampToValueAtTime(100, now + 0.5)

    osc2.frequency.setValueAtTime(150, now)
    osc2.frequency.exponentialRampToValueAtTime(50, now + 0.5)

    gainNode.gain.setValueAtTime(0.4, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5)

    osc1.connect(gainNode)
    osc2.connect(gainNode)
    gainNode.connect(context.destination)

    osc1.start(now)
    osc2.start(now)
    osc1.stop(now + 0.5)
    osc2.stop(now + 0.5)
  }

  const playVictorySound = () => {
    const context = audioContextRef.current
    if (!context) return

    context.resume()
    const now = context.currentTime

    const notes = [261.63, 329.63, 392, 523.25]
    
    notes.forEach((freq, index) => {
      const time = now + index * 0.15
      const osc = context.createOscillator()
      const gainNode = context.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, time)

      gainNode.gain.setValueAtTime(0.3, time)
      gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4)

      osc.connect(gainNode)
      gainNode.connect(context.destination)

      osc.start(time)
      osc.stop(time + 0.4)
    })

    const harmonyTime = now + 0.6
    const harmonyNotes = [523.25, 659.25, 783.99]
    
    harmonyNotes.forEach((freq) => {
      const osc = context.createOscillator()
      const gainNode = context.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, harmonyTime)

      gainNode.gain.setValueAtTime(0.2, harmonyTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, harmonyTime + 0.8)

      osc.connect(gainNode)
      gainNode.connect(context.destination)

      osc.start(harmonyTime)
      osc.stop(harmonyTime + 0.8)
    })
  }

  return {
    playEnemyDefeatSound,
    playGameOverSound,
    playVictorySound,
  }
}
