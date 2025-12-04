import { useState, useEffect } from 'react'
import {
  isBackgroundMusicMuted,
  isSoundEffectsMuted,
  toggleBackgroundMusic as globalToggleMusic,
  toggleSoundEffects as globalToggleSfx,
  subscribeToBackgroundMusic,
  subscribeToSoundEffects,
  startBackgroundMusic,
  initMusicOnInteraction,
} from '@/lib/sounds'

/**
 * Hook for managing background music state
 */
export function useBackgroundMusic() {
  const [isMuted, setIsMuted] = useState(isBackgroundMusicMuted())

  useEffect(() => {
    // Sync with global state
    setIsMuted(isBackgroundMusicMuted())

    // Subscribe to changes
    const unsubscribe = subscribeToBackgroundMusic(() => {
      setIsMuted(isBackgroundMusicMuted())
    })

    return unsubscribe
  }, [])

  const toggleMute = () => {
    globalToggleMusic()
  }

  return { isMuted, toggleMute }
}

/**
 * Hook for managing sound effects state
 */
export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(isSoundEffectsMuted())

  useEffect(() => {
    // Sync with global state
    setIsMuted(isSoundEffectsMuted())

    // Subscribe to changes
    const unsubscribe = subscribeToSoundEffects(() => {
      setIsMuted(isSoundEffectsMuted())
    })

    return unsubscribe
  }, [])

  const toggleMute = () => {
    globalToggleSfx()
  }

  return { isMuted, toggleMute }
}

/**
 * Hook to start background music on mount (with autoplay)
 */
export function useAutoplayMusic() {
  useEffect(() => {
    // Try to start music on mount
    startBackgroundMusic()

    // Set up listener for first user interaction
    initMusicOnInteraction()

    // Also try after a short delay (helps with some browsers)
    const timeout = setTimeout(() => {
      startBackgroundMusic()
    }, 100)

    return () => clearTimeout(timeout)
  }, [])
}
