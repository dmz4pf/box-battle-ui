import Navigation from "@/components/landing/navigation"
import Hero from "@/components/landing/hero"
import Features from "@/components/landing/features"
import HowToPlay from "@/components/landing/how-to-play"
import Stats from "@/components/landing/stats"
import CTA from "@/components/landing/cta"
import Footer from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: 'radial-gradient(circle at 50% 30%, #1e2541 0%, #151929 40%, #0f141f 100%)',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, #1e2541 0%, #151929 40%, #0f141f 100%),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 3px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 3px)
        `,
        backgroundSize: '100% 100%, 40px 40px, 40px 40px',
      }}
    >
      <Navigation />
      <Hero />
      <Features />
      <HowToPlay />
      <Stats />
      <CTA />
      <Footer />
    </div>
  )
}
