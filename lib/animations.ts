/**
 * BoxBattle GSAP Animation Utilities
 * Reusable animation functions for consistent motion design
 */

import { gsap } from 'gsap'

// ============================================
// CONFIGURATION
// ============================================

/**
 * Check if user prefers reduced motion
 * We should respect this preference and disable/simplify animations
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get animation duration based on user preferences
 * Returns 0 if reduced motion is preferred
 */
export const getAnimationDuration = (duration: number): number => {
  return prefersReducedMotion() ? 0 : duration
}

// ============================================
// BUTTON ANIMATIONS
// ============================================

/**
 * Button hover animation - Subtle lift with shadow
 * @param element - Button element to animate
 */
export const animateButtonHover = (element: HTMLElement) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    y: -2,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    duration: 0.2,
    ease: 'power2.out',
  })
}

/**
 * Button unhover animation - Return to original state
 * @param element - Button element to animate
 */
export const animateButtonUnhover = (element: HTMLElement) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    y: 0,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    duration: 0.2,
    ease: 'power2.out',
  })
}

/**
 * Button press animation - Quick scale down
 * @param element - Button element to animate
 */
export const animateButtonPress = (element: HTMLElement) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out',
  })
}

/**
 * Button release animation - Return to scale
 * @param element - Button element to animate
 */
export const animateButtonRelease = (element: HTMLElement) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    scale: 1,
    duration: 0.1,
    ease: 'power2.out',
  })
}

// ============================================
// MODAL/OVERLAY ANIMATIONS
// ============================================

/**
 * Modal enter animation - Backdrop fade + content slide up
 * @param backdrop - Backdrop element
 * @param content - Modal content element
 * @returns GSAP Timeline
 */
export const animateModalEnter = (
  backdrop: HTMLElement,
  content: HTMLElement
) => {
  const duration = getAnimationDuration(0.4)

  const tl = gsap.timeline()

  tl.fromTo(
    backdrop,
    { opacity: 0 },
    { opacity: 1, duration: duration * 0.75, ease: 'power2.out' }
  ).fromTo(
    content,
    { y: 40, opacity: 0, scale: 0.95 },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: duration,
      ease: 'back.out(1.4)',
    },
    '-=0.2'
  )

  return tl
}

/**
 * Modal exit animation - Content slide down + backdrop fade
 * @param backdrop - Backdrop element
 * @param content - Modal content element
 * @returns GSAP Timeline
 */
export const animateModalExit = (
  backdrop: HTMLElement,
  content: HTMLElement
) => {
  const duration = getAnimationDuration(0.3)

  const tl = gsap.timeline()

  tl.to(content, {
    y: 20,
    opacity: 0,
    scale: 0.95,
    duration: duration * 0.6,
    ease: 'power2.in',
  }).to(
    backdrop,
    { opacity: 0, duration: duration * 0.4, ease: 'power2.in' },
    '-=0.1'
  )

  return tl
}

// ============================================
// STATE CHANGE ANIMATIONS
// ============================================

/**
 * Success state animation - Scale bounce with check icon
 * @param element - Element to animate (typically an icon)
 */
export const animateSuccess = (element: HTMLElement) => {
  const duration = getAnimationDuration(0.5)

  gsap.fromTo(
    element,
    { scale: 0, rotation: -45 },
    {
      scale: 1,
      rotation: 0,
      duration: duration,
      ease: 'back.out(1.7)',
    }
  )
}

/**
 * Error state animation - Shake effect
 * @param element - Element to shake
 */
export const animateError = (element: HTMLElement) => {
  const duration = getAnimationDuration(0.4)

  gsap.fromTo(
    element,
    { x: 0 },
    {
      x: -10,
      duration: duration / 4,
      ease: 'power2.out',
      yoyo: true,
      repeat: 3,
    }
  )
}

/**
 * Fade in animation
 * @param element - Element to fade in
 * @param duration - Animation duration in seconds
 */
export const animateFadeIn = (element: HTMLElement, duration: number = 0.4) => {
  const d = getAnimationDuration(duration)

  gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration: d, ease: 'power2.out' }
  )
}

/**
 * Fade out animation
 * @param element - Element to fade out
 * @param duration - Animation duration in seconds
 */
export const animateFadeOut = (element: HTMLElement, duration: number = 0.3) => {
  const d = getAnimationDuration(duration)

  gsap.to(element, { opacity: 0, duration: d, ease: 'power2.in' })
}

// ============================================
// LIST/STAGGER ANIMATIONS
// ============================================

/**
 * Stagger fade in animation for lists
 * @param elements - Array or NodeList of elements
 * @param staggerDelay - Delay between each element (seconds)
 */
export const animateStaggerIn = (
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  staggerDelay: number = 0.1
) => {
  const duration = getAnimationDuration(0.4)
  const delay = getAnimationDuration(staggerDelay)

  gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: duration,
      ease: 'power2.out',
      stagger: delay,
    }
  )
}

// ============================================
// GAME-SPECIFIC ANIMATIONS
// ============================================

/**
 * Line placement animation - Scale from center
 * @param element - Line element (SVG path or div)
 */
export const animateLinePlacement = (element: HTMLElement | SVGElement) => {
  const duration = getAnimationDuration(0.3)

  gsap.fromTo(
    element,
    { scaleX: 0, scaleY: 0, opacity: 0 },
    {
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      duration: duration,
      ease: 'back.out(1.7)',
    }
  )
}

/**
 * Box completion animation - Fill with pulse
 * @param element - Box element to animate
 * @param playerColor - Player color for the fill
 */
export const animateBoxCompletion = (
  element: HTMLElement,
  playerColor: string
) => {
  const duration = getAnimationDuration(0.4)

  const tl = gsap.timeline()

  // Initial scale pulse
  tl.fromTo(
    element,
    { scale: 0.8, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: duration * 0.6,
      ease: 'back.out(1.4)',
    }
  )
    // Brief pulse
    .to(element, {
      scale: 1.05,
      duration: duration * 0.2,
      ease: 'power2.out',
    })
    // Settle
    .to(element, {
      scale: 1,
      duration: duration * 0.2,
      ease: 'power2.out',
    })

  // Also animate the background color
  gsap.to(element, {
    backgroundColor: playerColor,
    duration: duration * 0.6,
    ease: 'power2.out',
  })

  return tl
}

/**
 * Winner reveal animation - Celebration sequence
 * @param container - Winner overlay container
 * @param elements - Object containing trophy, text, and button elements
 */
export const animateWinnerReveal = (
  container: HTMLElement,
  elements: {
    trophy?: HTMLElement
    title?: HTMLElement
    subtitle?: HTMLElement
    prize?: HTMLElement
    buttons?: HTMLElement[]
  }
) => {
  const duration = getAnimationDuration(1.5)

  const tl = gsap.timeline()

  // Fade in backdrop
  tl.fromTo(
    container,
    { opacity: 0 },
    { opacity: 1, duration: duration * 0.2, ease: 'power2.out' }
  )

  // Trophy bounce in
  if (elements.trophy) {
    tl.fromTo(
      elements.trophy,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: duration * 0.4,
        ease: 'back.out(1.7)',
      },
      '-=0.1'
    )
  }

  // Title slide up
  if (elements.title) {
    tl.fromTo(
      elements.title,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: duration * 0.3,
        ease: 'power2.out',
      },
      '-=0.2'
    )
  }

  // Subtitle slide up
  if (elements.subtitle) {
    tl.fromTo(
      elements.subtitle,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: duration * 0.3,
        ease: 'power2.out',
      },
      '-=0.2'
    )
  }

  // Prize amount scale in
  if (elements.prize) {
    tl.fromTo(
      elements.prize,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: duration * 0.3,
        ease: 'back.out(1.4)',
      },
      '-=0.1'
    )
  }

  // Buttons stagger in
  if (elements.buttons && elements.buttons.length > 0) {
    tl.fromTo(
      elements.buttons,
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: duration * 0.2,
        ease: 'power2.out',
        stagger: duration * 0.05,
      },
      '-=0.1'
    )
  }

  return tl
}

/**
 * Loading spinner rotation
 * @param element - Spinner element
 * @returns GSAP Tween (can be killed to stop animation)
 */
export const animateSpinner = (element: HTMLElement) => {
  if (prefersReducedMotion()) {
    // Show static spinner for reduced motion
    gsap.set(element, { rotation: 45 })
    return null
  }

  return gsap.to(element, {
    rotation: 360,
    duration: 1,
    ease: 'none',
    repeat: -1,
  })
}

// ============================================
// CARD & PAGE ANIMATIONS
// ============================================

/**
 * Card reveal animation - Slide up with fade
 * @param element - Card element to animate
 * @param delay - Optional delay before animation starts
 */
export const animateCardReveal = (
  element: HTMLElement,
  delay: number = 0
) => {
  const duration = getAnimationDuration(0.5)
  const d = getAnimationDuration(delay)

  gsap.fromTo(
    element,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: duration,
      delay: d,
      ease: 'power2.out',
    }
  )
}

/**
 * Page transition - Fade in with slight slide
 * @param element - Page container element
 */
export const animatePageEnter = (element: HTMLElement) => {
  const duration = getAnimationDuration(0.4)

  gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: duration,
      ease: 'power2.out',
    }
  )
}

/**
 * Pulse animation - For attention grabbing
 * @param element - Element to pulse
 * @param scale - Max scale (default 1.05)
 */
export const animatePulse = (
  element: HTMLElement,
  scale: number = 1.05
) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    scale: scale,
    duration: 0.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

/**
 * Floating animation - Subtle up/down motion
 * @param element - Element to float
 * @param distance - Float distance in pixels (default 8)
 */
export const animateFloat = (
  element: HTMLElement,
  distance: number = 8
) => {
  if (prefersReducedMotion()) return

  gsap.to(element, {
    y: -distance,
    duration: 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Kill all GSAP animations on an element
 * @param element - Element to kill animations on
 */
export const killAnimations = (element: HTMLElement) => {
  gsap.killTweensOf(element)
}

/**
 * Reset element to default state (no transforms, full opacity)
 * @param element - Element to reset
 */
export const resetElement = (element: HTMLElement) => {
  gsap.set(element, {
    clearProps: 'all',
  })
}
