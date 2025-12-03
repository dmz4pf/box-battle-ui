"use client"

import Link from "next/link"
import { Wallet, X, CheckCircle2 } from "lucide-react"
import { useAccount, useConnect, useDisconnect, useConnectors } from "wagmi"
import { useState } from "react"

export default function Navigation() {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const connectors = useConnectors()
  const [showConnectModal, setShowConnectModal] = useState(false)

  const handleConnect = (connectorId: string) => {
    const connector = connectors.find((c) => c.id === connectorId)
    if (connector) {
      connect({ connector })
      setShowConnectModal(false)
    }
  }

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-6 border-b border-[var(--color-border)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/boxbattle-logo.svg"
            alt="BoxBattle"
            className="w-10 h-10"
          />
          <span className="text-2xl font-bold text-white tracking-tight">
            BOXBATTLE
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-[var(--color-text-secondary)] hover:text-white transition">
            Features
          </a>
          <a href="#how-to-play" className="text-[var(--color-text-secondary)] hover:text-white transition">
            How to Play
          </a>
          <a href="#stats" className="text-[var(--color-text-secondary)] hover:text-white transition">
            Leaderboard
          </a>
        </div>

        <div className="flex items-center gap-4">
          {/* Wallet Button */}
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="px-4 py-2 rounded-lg bg-bg-elevated border border-state-success font-mono text-sm text-state-success font-semibold flex items-center gap-2 hover:bg-bg-panel transition-all"
            >
              <CheckCircle2 size={16} />
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </button>
          ) : (
            <button
              onClick={() => setShowConnectModal(true)}
              className="px-4 py-2 rounded-lg bg-bg-elevated border border-[var(--color-border)] font-semibold text-sm text-[var(--color-text-secondary)] flex items-center gap-2 hover:border-accent-blue hover:text-white transition-all"
            >
              <Wallet size={16} />
              Connect Wallet
            </button>
          )}

          <Link href="/game">
            <button className="button-primary px-6 py-2 rounded-lg font-semibold">
              Play Now
            </button>
          </Link>
        </div>
      </nav>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-modal-backdrop flex items-center justify-center p-4"
          onClick={() => setShowConnectModal(false)}
        >
          <div
            className="bg-bg-panel border border-[var(--color-border)] rounded-xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
                <p className="text-sm text-[var(--color-text-tertiary)] mt-1">Choose how you want to connect</p>
              </div>
              <button
                onClick={() => setShowConnectModal(false)}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors text-[var(--color-text-tertiary)] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                    className="w-full px-6 py-4 bg-bg-elevated border border-[var(--color-border)] rounded-lg text-left hover:border-accent-blue hover:bg-bg-primary transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 rounded-lg flex items-center justify-center">
                        <Wallet size={24} className="text-accent-blue" />
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

            <div className="p-4 bg-bg-elevated rounded-lg border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-tertiary)] mb-2">Supported Browser Wallets:</p>
              <div className="flex flex-wrap gap-2">
                {["MetaMask", "Rabby", "Zerion", "Rainbow", "Coinbase", "Trust"].map((wallet) => (
                  <span key={wallet} className="px-2 py-1 bg-bg-primary rounded text-xs text-[var(--color-text-secondary)]">
                    {wallet}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowConnectModal(false)}
              className="w-full mt-4 px-6 py-3 border border-[var(--color-border)] rounded-lg text-[var(--color-text-secondary)] hover:bg-bg-elevated transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}
