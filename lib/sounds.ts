/**
 * Global sound system with singleton pattern
 * Prevents recreation on every render and ensures sound state is synced across all components
 */

// Global state for background music
let globalAudio: HTMLAudioElement | null = null
let globalIsMuted: boolean = false
let listeners: Set<() => void> = new Set()
let hasTriedAutoplay: boolean = false

// Global state for sound effects
let globalSfxMuted: boolean = false
let sfxListeners: Set<() => void> = new Set()
let globalAudioContext: AudioContext | null = null

/**
 * Get or create the global audio element for background music
 */
function getGlobalAudio(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null

  if (!globalAudio) {
    globalAudio = new Audio('/game-music.mp3')
    globalAudio.loop = true
    globalAudio.volume = 0.3

    // Load saved state from localStorage
    const saved = localStorage.getItem('boxbattle-music-muted')
    if (saved !== null) {
      globalIsMuted = saved === 'true'
    }

    // Auto-play if not muted
    if (!globalIsMuted) {
      globalAudio.play().catch(err => {
        console.log('Autoplay prevented by browser:', err)
        // Browser might prevent autoplay until user interaction
      })
    }
  }

  return globalAudio
}

/**
 * Get or create the global AudioContext for sound effects
 */
function getGlobalAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null

  if (!globalAudioContext) {
    globalAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Load saved state from localStorage
    const saved = localStorage.getItem('boxbattle-sfx-muted')
    if (saved !== null) {
      globalSfxMuted = saved === 'true'
    }
  }

  return globalAudioContext
}

/**
 * Start background music
 */
export function startBackgroundMusic(): void {
  const audio = getGlobalAudio()
  if (audio && !globalIsMuted) {
    audio.play().catch(err => {
      console.log('Music play prevented:', err)
      // If autoplay fails, set up one-time click handler
      if (!hasTriedAutoplay) {
        hasTriedAutoplay = true
        const tryPlay = () => {
          if (audio && !globalIsMuted) {
            audio.play().catch(console.log)
          }
          document.removeEventListener('click', tryPlay)
          document.removeEventListener('keydown', tryPlay)
        }
        document.addEventListener('click', tryPlay, { once: true })
        document.addEventListener('keydown', tryPlay, { once: true })
      }
    })
  }
}

/**
 * Initialize music on first user interaction
 */
export function initMusicOnInteraction(): void {
  if (hasTriedAutoplay) return

  hasTriedAutoplay = true
  const audio = getGlobalAudio()

  const tryPlay = () => {
    if (audio && !globalIsMuted) {
      audio.play().catch(console.log)
    }
  }

  // Try to play on first click or keypress
  document.addEventListener('click', tryPlay, { once: true })
  document.addEventListener('keydown', tryPlay, { once: true })
}

/**
 * Check if background music is muted
 */
export function isBackgroundMusicMuted(): boolean {
  return globalIsMuted
}

/**
 * Toggle background music mute state
 */
export function toggleBackgroundMusic(): void {
  const audio = getGlobalAudio()
  if (!audio) return

  globalIsMuted = !globalIsMuted
  localStorage.setItem('boxbattle-music-muted', String(globalIsMuted))

  if (globalIsMuted) {
    audio.pause()
  } else {
    audio.play().catch(err => console.log('Play prevented:', err))
  }

  // Notify all listeners
  listeners.forEach(listener => listener())
}

/**
 * Subscribe to background music state changes
 */
export function subscribeToBackgroundMusic(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Check if sound effects are muted
 */
export function isSoundEffectsMuted(): boolean {
  return globalSfxMuted
}

/**
 * Toggle sound effects mute state
 */
export function toggleSoundEffects(): void {
  globalSfxMuted = !globalSfxMuted
  localStorage.setItem('boxbattle-sfx-muted', String(globalSfxMuted))

  // Notify all listeners
  sfxListeners.forEach(listener => listener())
}

/**
 * Subscribe to sound effects state changes
 */
export function subscribeToSoundEffects(listener: () => void): () => void {
  sfxListeners.add(listener)
  return () => sfxListeners.delete(listener)
}

/**
 * Play a synthesized click sound for line selection
 */
export function playLineClick(): void {
  if (globalSfxMuted) return

  const ctx = getGlobalAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.value = 800
  oscillator.type = 'sine'

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.1)
}

/**
 * Play a synthesized sound when a box is completed
 */
export function playBoxComplete(): void {
  if (globalSfxMuted) return

  const ctx = getGlobalAudioContext()
  if (!ctx) return

  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
  oscillator.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15) // G5
  oscillator.type = 'triangle'

  gainNode.gain.setValueAtTime(0.4, ctx.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)

  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.2)
}

/**
 * Play a victory sound
 */
export function playWin(): void {
  if (globalSfxMuted) return

  const ctx = getGlobalAudioContext()
  if (!ctx) return

  // Three ascending notes
  const frequencies = [523.25, 659.25, 783.99] // C5, E5, G5

  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'triangle'

    const startTime = ctx.currentTime + (i * 0.15)
    gainNode.gain.setValueAtTime(0.4, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.3)
  })
}

/**
 * Play a defeat sound
 */
export function playLose(): void {
  if (globalSfxMuted) return

  const ctx = getGlobalAudioContext()
  if (!ctx) return

  // Two descending notes
  const frequencies = [392.00, 293.66] // G4, D4

  frequencies.forEach((freq, i) => {
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    oscillator.frequency.value = freq
    oscillator.type = 'sawtooth'

    const startTime = ctx.currentTime + (i * 0.2)
    gainNode.gain.setValueAtTime(0.3, startTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4)

    oscillator.start(startTime)
    oscillator.stop(startTime + 0.4)
  })
}
