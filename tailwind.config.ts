import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Background layers
        'bg-primary': 'var(--color-bg-primary)',
        'bg-elevated': 'var(--color-bg-elevated)',
        'bg-panel': 'var(--color-bg-panel)',

        // Accent colors
        'accent-blue': 'var(--color-accent-blue)',
        'accent-red': 'var(--color-accent-red)',
        'accent-emerald': 'var(--color-accent-emerald)',
        'accent-amber': 'var(--color-accent-amber)',

        // Player colors
        'player-1': 'var(--color-player-1)',
        'player-2': 'var(--color-player-2)',

        // State colors
        'state-success': 'var(--color-success)',
        'state-warning': 'var(--color-warning)',
        'state-error': 'var(--color-error)',
        'state-info': 'var(--color-info)',
      },
      fontFamily: {
        sans: ['var(--font-primary)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
      },
      fontSize: {
        'display': 'var(--font-size-display)',
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'h3': 'var(--font-size-h3)',
        'h4': 'var(--font-size-h4)',
        'body': 'var(--font-size-body)',
        'small': 'var(--font-size-small)',
        'tiny': 'var(--font-size-tiny)',
      },
      spacing: {
        'xs': 'var(--space-xs)',
        'sm': 'var(--space-sm)',
        'md': 'var(--space-md)',
        'lg': 'var(--space-lg)',
        'xl': 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        'blue': 'var(--shadow-blue)',
        'red': 'var(--shadow-red)',
        'emerald': 'var(--shadow-emerald)',
        'amber': 'var(--shadow-amber)',
      },
      zIndex: {
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'fixed': 'var(--z-fixed)',
        'modal-backdrop': 'var(--z-modal-backdrop)',
        'modal': 'var(--z-modal)',
        'tooltip': 'var(--z-tooltip)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'base': 'var(--transition-base)',
        'slow': 'var(--transition-slow)',
        'slower': 'var(--transition-slower)',
      },
      transitionTimingFunction: {
        'ease-in': 'var(--ease-in)',
        'ease-out': 'var(--ease-out)',
        'ease-in-out': 'var(--ease-in-out)',
      },
    },
  },
  plugins: [],
}

export default config
