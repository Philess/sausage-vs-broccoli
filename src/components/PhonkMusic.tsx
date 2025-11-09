import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SpeakerHigh, SpeakerX } from '@phosphor-icons/react'

export function PhonkMusic() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const oscillatorsRef = useRef<OscillatorNode[]>([])
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    audioContextRef.current = new AudioContext()
    gainNodeRef.current = audioContextRef.current.createGain()
    gainNodeRef.current.gain.value = 0.3
    gainNodeRef.current.connect(audioContextRef.current.destination)

    return () => {
      stopMusic()
      audioContextRef.current?.close()
    }
  }, [])

  const createNoiseBuffer = (context: AudioContext) => {
    const bufferSize = context.sampleRate * 0.1
    const buffer = context.createBuffer(1, bufferSize, context.sampleRate)
    const output = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }
    return buffer
  }

  const playKick = (context: AudioContext, time: number) => {
    const osc = context.createOscillator()
    const oscGain = context.createGain()
    
    osc.frequency.setValueAtTime(150, time)
    osc.frequency.exponentialRampToValueAtTime(50, time + 0.1)
    
    oscGain.gain.setValueAtTime(1, time)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15)
    
    osc.connect(oscGain)
    oscGain.connect(gainNodeRef.current!)
    
    osc.start(time)
    osc.stop(time + 0.15)
  }

  const playSnare = (context: AudioContext, time: number) => {
    const noiseBuffer = createNoiseBuffer(context)
    const noise = context.createBufferSource()
    noise.buffer = noiseBuffer
    
    const noiseFilter = context.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.value = 1000
    
    const noiseGain = context.createGain()
    noiseGain.gain.setValueAtTime(0.3, time)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.1)
    
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(gainNodeRef.current!)
    
    noise.start(time)
    noise.stop(time + 0.1)
  }

  const playHiHat = (context: AudioContext, time: number) => {
    const noiseBuffer = createNoiseBuffer(context)
    const noise = context.createBufferSource()
    noise.buffer = noiseBuffer
    
    const noiseFilter = context.createBiquadFilter()
    noiseFilter.type = 'highpass'
    noiseFilter.frequency.value = 5000
    
    const noiseGain = context.createGain()
    noiseGain.gain.setValueAtTime(0.1, time)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.05)
    
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(gainNodeRef.current!)
    
    noise.start(time)
    noise.stop(time + 0.05)
  }

  const playBass = (context: AudioContext, time: number, frequency: number, duration: number) => {
    const osc = context.createOscillator()
    const oscGain = context.createGain()
    const filter = context.createBiquadFilter()
    
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(frequency, time)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, time)
    filter.Q.value = 5
    
    oscGain.gain.setValueAtTime(0.15, time)
    oscGain.gain.setValueAtTime(0.15, time + duration - 0.05)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + duration)
    
    osc.connect(filter)
    filter.connect(oscGain)
    oscGain.connect(gainNodeRef.current!)
    
    osc.start(time)
    osc.stop(time + duration)
  }

  const playString = (context: AudioContext, time: number, frequency: number, duration: number) => {
    const osc1 = context.createOscillator()
    const osc2 = context.createOscillator()
    const oscGain = context.createGain()
    const filter = context.createBiquadFilter()
    
    osc1.type = 'sawtooth'
    osc2.type = 'triangle'
    osc1.frequency.setValueAtTime(frequency, time)
    osc2.frequency.setValueAtTime(frequency * 2, time)
    
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1200, time)
    filter.Q.value = 3
    
    oscGain.gain.setValueAtTime(0.01, time)
    oscGain.gain.linearRampToValueAtTime(0.12, time + 0.08)
    oscGain.gain.setValueAtTime(0.12, time + duration - 0.1)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + duration)
    
    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(oscGain)
    oscGain.connect(gainNodeRef.current!)
    
    osc1.start(time)
    osc2.start(time)
    osc1.stop(time + duration)
    osc2.stop(time + duration)
  }

  const playBrass = (context: AudioContext, time: number, frequency: number, duration: number) => {
    const osc = context.createOscillator()
    const oscGain = context.createGain()
    const filter = context.createBiquadFilter()
    
    osc.type = 'square'
    osc.frequency.setValueAtTime(frequency, time)
    
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1500, time)
    filter.Q.value = 2
    
    oscGain.gain.setValueAtTime(0.01, time)
    oscGain.gain.linearRampToValueAtTime(0.1, time + 0.05)
    oscGain.gain.setValueAtTime(0.1, time + duration - 0.1)
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + duration)
    
    osc.connect(filter)
    filter.connect(oscGain)
    oscGain.connect(gainNodeRef.current!)
    
    osc.start(time)
    osc.stop(time + duration)
  }

  const playChord = (context: AudioContext, time: number, baseFreq: number, duration: number) => {
    const chordFrequencies = [
      baseFreq,
      baseFreq * 1.25992,
      baseFreq * 1.5,
      baseFreq * 2
    ]
    
    chordFrequencies.forEach((freq) => {
      playString(context, time, freq, duration)
    })
  }

  const schedulePhonkLoop = () => {
    const context = audioContextRef.current
    if (!context) return

    const bpm = 180
    const beatDuration = 60 / bpm
    const barDuration = beatDuration * 4
    
    let currentTime = context.currentTime
    let beatCount = 0

    const bassPattern = [
      { note: 55, duration: 0.5 },
      { note: 55, duration: 0.25 },
      { note: 65.41, duration: 0.25 },
      { note: 73.42, duration: 0.5 },
      { note: 55, duration: 0.5 }
    ]

    const melodyPattern = [
      220, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94
    ]

    const chordPattern = [
      110, 110, 130.81, 146.83
    ]

    const scheduleBeat = () => {
      const beat = beatCount % 16
      
      if (beat % 4 === 0 || beat % 4 === 2) {
        playKick(context, currentTime)
      }
      
      if (beat % 4 === 2) {
        playSnare(context, currentTime)
      }
      
      if (beat % 2 === 1) {
        playHiHat(context, currentTime)
      }
      
      if (beat % 2 === 0) {
        playHiHat(context, currentTime + beatDuration * 0.5)
      }

      const bassIndex = Math.floor(beat / 2) % bassPattern.length
      const bassNote = bassPattern[bassIndex]
      if (beat % 2 === 0) {
        playBass(context, currentTime, bassNote.note, bassNote.duration * beatDuration)
      }

      const melodyIndex = beat % melodyPattern.length
      if (beat % 2 === 0) {
        playString(context, currentTime, melodyPattern[melodyIndex], beatDuration * 0.8)
      }

      const chordIndex = Math.floor(beat / 4) % chordPattern.length
      if (beat % 4 === 0) {
        playChord(context, currentTime, chordPattern[chordIndex], beatDuration * 3.8)
      }

      if (beat % 8 === 4) {
        playBrass(context, currentTime, melodyPattern[melodyIndex] * 0.5, beatDuration * 2)
      }

      currentTime += beatDuration
      beatCount++
    }

    intervalRef.current = window.setInterval(scheduleBeat, beatDuration * 1000)
    scheduleBeat()
  }

  const stopMusic = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop()
      } catch (e) {
      }
    })
    oscillatorsRef.current = []
    if (noiseSourceRef.current) {
      try {
        noiseSourceRef.current.stop()
      } catch (e) {
      }
      noiseSourceRef.current = null
    }
  }

  const toggleMusic = () => {
    if (isPlaying) {
      stopMusic()
      setIsPlaying(false)
    } else {
      audioContextRef.current?.resume()
      setIsPlaying(true)
      schedulePhonkLoop()
    }
  }

  return (
    <Button
      onClick={toggleMusic}
      variant={isPlaying ? "default" : "outline"}
      size="lg"
      className="gap-2 hover:scale-105 transition-transform"
    >
      {isPlaying ? (
        <>
          <SpeakerHigh size={24} weight="fill" />
          Music On
        </>
      ) : (
        <>
          <SpeakerX size={24} weight="fill" />
          Music Off
        </>
      )}
    </Button>
  )
}
