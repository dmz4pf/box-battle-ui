"use client"

import React from "react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Check if error is from browser extension
    const errorMessage = error.message || ""
    if (
      errorMessage.includes("chrome-extension://") ||
      errorMessage.includes("ethereum") ||
      errorMessage.includes("Cannot set property") ||
      errorMessage.includes("Invalid property descriptor") ||
      errorMessage.includes("defineProperty")
    ) {
      // Ignore extension errors, don't show error UI
      return { hasError: false }
    }
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Check if error is from browser extension
    const errorMessage = error.message || ""
    if (
      errorMessage.includes("chrome-extension://") ||
      errorMessage.includes("ethereum") ||
      errorMessage.includes("Cannot set property") ||
      errorMessage.includes("Invalid property descriptor")
    ) {
      // Silently ignore extension errors
      return
    }
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-6">
          <div className="bg-slate-900/80 border-2 border-red-500/50 rounded-xl p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h2>
            <p className="text-slate-300 mb-4">
              The app encountered an error. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
