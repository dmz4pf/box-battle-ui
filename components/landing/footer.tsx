"use client"

export default function Footer() {
  return (
    <footer className="border-t border-indigo-900/30 mt-24 py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/boxbattle-logo.svg"
                alt="BoxBattle"
                className="w-8 h-8"
              />
              <span className="font-bold text-white">BoxBattle</span>
            </div>
            <p className="text-slate-400 text-sm">The ultimate strategic gaming experience.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Leaderboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Responsible Gaming
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-indigo-900/30 pt-8 text-center text-slate-400 text-sm">
          <p>© 2025 BoxBattle. All rights reserved. Powered by blockchain technology.</p>
        </div>
      </div>
    </footer>
  )
}
