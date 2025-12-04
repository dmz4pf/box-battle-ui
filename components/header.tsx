"use client"

import { Volume2, VolumeX, Settings, Wallet, Clock, CheckCircle2, X, ArrowLeft } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi"
import { useState, useRef, useEffect } from "react"
import { gsap } from "gsap"
import { animateModalEnter, animateModalExit } from "@/lib/animations"
import { useBackgroundMusic } from "@/hooks/useSound"

interface HeaderProps {
  timer: number
  onBack?: () => void
  showBackButton?: boolean
  gameMode?: "ai" | "multiplayer" | null
}

export default function Header({ timer, onBack, showBackButton, gameMode }: HeaderProps) {
  const minutes = Math.floor(timer / 60)
  const seconds = timer % 60
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const [showConnectModal, setShowConnectModal] = useState(false)

  const modalBackdropRef = useRef<HTMLDivElement>(null)
  const modalContentRef = useRef<HTMLDivElement>(null)

  // Sound controls
  const { isMuted, toggleMute } = useBackgroundMusic()

  // Animate modal on mount/unmount
  useEffect(() => {
    if (showConnectModal && modalBackdropRef.current && modalContentRef.current) {
      animateModalEnter(modalBackdropRef.current, modalContentRef.current)
    }
  }, [showConnectModal])

  const handleCloseModal = () => {
    if (modalBackdropRef.current && modalContentRef.current) {
      animateModalExit(modalBackdropRef.current, modalContentRef.current).then(() => {
        setShowConnectModal(false)
      })
    } else {
      setShowConnectModal(false)
    }
  }

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      handleCloseModal()
    }
  }

  return (
    <header className="bg-bg-primary border-b border-[var(--color-border)] py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          {showBackButton && onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-white hover:bg-bg-elevated transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <img
            src="/boxbattle-logo.svg"
            alt="BoxBattle"
            className="w-10 h-10"
          />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            BOXBATTLE
          </h1>
        </div>

        {/* Right: Wallet, Timer and Controls */}
        <div className="flex items-center gap-3">
          {/* Wallet Button */}
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-state-success rounded-lg text-sm font-mono text-state-success hover:bg-bg-panel transition-colors duration-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </button>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-bg-primary rounded-lg text-sm font-semibold hover:brightness-110 transition-all duration-200"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          )}

          {/* Timer */}
          <div className="flex items-center gap-2 px-4 py-2 bg-bg-elevated border border-[var(--color-border)] rounded-lg">
            <Clock className="w-4 h-4 text-[var(--color-text-tertiary)]" />
            <span className="text-sm font-mono font-semibold text-white">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors duration-200 text-[var(--color-text-tertiary)] hover:text-white"
            aria-label="Toggle sound"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div
          ref={modalBackdropRef}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal-backdrop flex items-center justify-center"
          onClick={handleCloseModal}
          style={{ opacity: 0 }}
        >
          <div
            ref={modalContentRef}
            className="bg-bg-panel border border-[var(--color-border)] rounded-xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{ opacity: 0, transform: 'translateY(40px) scale(0.95)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                <p className="text-sm text-[var(--color-text-tertiary)] mt-1">
                  Choose how you want to connect
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors text-[var(--color-text-tertiary)] hover:text-white"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wallet Options */}
            <div className="space-y-3 mb-6">
              {connectors.map((connector) => {
                const isInjected = connector.type === 'injected' || connector.id.includes('injected')
                let walletName = connector.name
                let walletDescription = 'Connect to your wallet'

                if (isInjected) {
                  if (walletName.toLowerCase().includes('metamask')) {
                    walletDescription = 'MetaMask browser extension'
                  } else if (walletName.toLowerCase().includes('zerion')) {
                    walletDescription = 'Zerion browser extension'
                  } else if (walletName.toLowerCase().includes('rabby')) {
                    walletDescription = 'Rabby browser extension'
                  } else if (walletName.toLowerCase().includes('rainbow')) {
                    walletDescription = 'Rainbow browser extension'
                  } else if (walletName.toLowerCase().includes('coinbase')) {
                    walletDescription = 'Coinbase Wallet extension'
                  } else {
                    walletDescription = 'Browser extension wallet'
                  }
                }

                return (
                  <button
                    key={connector.id}
                    onClick={() => handleConnect(connector.id)}
                    className="w-full px-6 py-4 bg-bg-elevated border border-[var(--color-border)] rounded-lg text-left hover:border-accent-blue hover:bg-bg-primary transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 rounded-lg flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                        <Wallet className="w-6 h-6 text-accent-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{walletName}</p>
                        <p className="text-xs text-[var(--color-text-tertiary)]">{walletDescription}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Supported Wallets Note */}
            <div className="p-4 bg-bg-elevated rounded-lg border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
                Supported Browser Wallets:
              </p>
              <div className="flex flex-wrap gap-2">
                {["MetaMask", "Rabby", "Zerion", "Rainbow", "Coinbase", "Trust"].map((wallet) => (
                  <span
                    key={wallet}
                    className="px-2 py-1 bg-bg-primary rounded text-xs text-[var(--color-text-secondary)]"
                  >
                    {wallet}
                  </span>
                ))}
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={handleCloseModal}
              className="w-full mt-4 px-6 py-3 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-bg-elevated transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
