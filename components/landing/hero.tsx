"use client"

import Link from "next/link"
import { Play, Zap } from "lucide-react"

export default function Hero() {
  return (
    <section className="px-8 py-24 md:py-32 max-w-7xl mx-auto relative overflow-hidden">
      {/* Animated Game Board - Top Left */}
      <div className="absolute -top-24 -left-24 md:left-4 md:top-4 opacity-18 md:opacity-22 pointer-events-none z-0">
        <svg width="280" height="280" viewBox="0 0 400 400" className="animate-float" style={{filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.25))'}}>
          <defs>
            <style>{`
              @keyframes drawLine {
                0%, 10% { stroke-dashoffset: 160; opacity: 0; }
                20% { stroke-dashoffset: 0; opacity: 1; }
                100% { stroke-dashoffset: 0; opacity: 1; }
              }
              @keyframes fillBox {
                0%, 5% { opacity: 0; transform: scale(0.85); }
                15% { opacity: 0.45; transform: scale(1); }
                100% { opacity: 0.45; transform: scale(1); }
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-12px) rotate(2deg); }
              }
              .animate-float { animation: float 10s ease-in-out infinite; }
            `}</style>
          </defs>

          {/* Board background */}
          <rect x="40" y="40" width="320" height="320" rx="24" fill="#1e2541" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="3"/>

          {/* 3x3 Grid - Dots */}
          <circle cx="100" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="100" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="100" cy="340" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="340" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="340" r="10" fill="#E5E7EB"/>

          {/* Animated Lines - Blue Player - Multiple Boxes */}
          {/* First box - top left */}
          <line x1="100" y1="100" x2="220" y2="100" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '0s'}}/>
          <line x1="220" y1="100" x2="220" y2="220" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '0.4s'}}/>
          <line x1="100" y1="220" x2="220" y2="220" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '0.8s'}}/>
          <line x1="100" y1="100" x2="100" y2="220" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '1.2s'}}/>

          {/* Second box - bottom right */}
          <line x1="220" y1="220" x2="340" y2="220" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '2s'}}/>
          <line x1="340" y1="220" x2="340" y2="340" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '2.4s'}}/>
          <line x1="220" y1="340" x2="340" y2="340" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '2.8s'}}/>
          <line x1="220" y1="220" x2="220" y2="340" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '3.2s'}}/>

          {/* Completed Boxes */}
          <rect x="100" y="100" width="120" height="120" fill="#3B82F6" rx="8" style={{animation: 'fillBox 8s ease-in-out infinite', animationDelay: '0.2s'}}/>
          <rect x="220" y="220" width="120" height="120" fill="#3B82F6" rx="8" style={{animation: 'fillBox 8s ease-in-out infinite', animationDelay: '2.2s'}}/>
        </svg>
      </div>

      {/* Animated Game Board - Bottom Right */}
      <div className="absolute -bottom-24 -right-24 md:right-4 md:bottom-4 opacity-18 md:opacity-22 pointer-events-none z-0">
        <svg width="280" height="280" viewBox="0 0 400 400" className="animate-float" style={{animationDelay: '1s', filter: 'drop-shadow(0 0 25px rgba(239, 68, 68, 0.25))'}}>
          {/* Board background */}
          <rect x="40" y="40" width="320" height="320" rx="24" fill="#1e2541" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="3"/>

          {/* 3x3 Grid - Dots */}
          <circle cx="100" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="100" r="10" fill="#E5E7EB"/>
          <circle cx="100" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="220" r="10" fill="#E5E7EB"/>
          <circle cx="100" cy="340" r="10" fill="#E5E7EB"/>
          <circle cx="220" cy="340" r="10" fill="#E5E7EB"/>
          <circle cx="340" cy="340" r="10" fill="#E5E7EB"/>

          {/* Animated Lines - Red Player - Multiple Boxes */}
          {/* First box - top right */}
          <line x1="220" y1="100" x2="340" y2="100" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '0.5s'}}/>
          <line x1="340" y1="100" x2="340" y2="220" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '0.9s'}}/>
          <line x1="220" y1="220" x2="340" y2="220" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '1.3s'}}/>
          <line x1="220" y1="100" x2="220" y2="220" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '1.7s'}}/>

          {/* Second box - center */}
          <line x1="100" y1="220" x2="220" y2="220" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '2.5s'}}/>
          <line x1="220" y1="220" x2="220" y2="340" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '2.9s'}}/>
          <line x1="100" y1="340" x2="220" y2="340" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '3.3s'}}/>
          <line x1="100" y1="220" x2="100" y2="340" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" strokeDasharray="160" style={{animation: 'drawLine 8s ease-in-out infinite', animationDelay: '3.7s'}}/>

          {/* Completed Boxes */}
          <rect x="220" y="100" width="120" height="120" fill="#EF4444" rx="8" style={{animation: 'fillBox 8s ease-in-out infinite', animationDelay: '0.7s'}}/>
          <rect x="100" y="220" width="120" height="120" fill="#EF4444" rx="8" style={{animation: 'fillBox 8s ease-in-out infinite', animationDelay: '2.7s'}}/>
        </svg>
      </div>

      <div className="text-center space-y-6 relative z-20">
        <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
          <span className="text-white/70">Web3 Strategy Game</span>
          <div className="w-8 h-px bg-gradient-to-r from-transparent via-accent-blue to-transparent"></div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
          Master the Grid.
          <br />
          <span className="text-accent-blue">Claim Your Prize.</span>
        </h1>

        <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Experience the ultimate competitive Dots and Boxes game with real-time multiplayer, blockchain rewards, and a
          thriving community of strategic players.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/game">
            <button className="button-primary px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Playing
            </button>
          </Link>
          <button className="px-8 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg font-bold text-lg hover:bg-bg-elevated hover:text-white transition-all flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  )
}
