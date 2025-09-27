import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ActionCards } from "@/components/action-cards"
import { FeaturesSection } from "@/components/features-section"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ActionCards />
      <FeaturesSection />
    </main>
  )
}
