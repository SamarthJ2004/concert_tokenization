import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center grid-pattern">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-8">
          <TrendingUp className="h-4 w-4" />
          {"Announcing $50M in Real World Assets Tokenized"}
          <ArrowRight className="h-4 w-4" />
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
          Real World Asset Trading
          <br />
          <span className="text-accent">for Web3 Platforms</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-3xl mx-auto mb-12">
          {
            "Seamlessly tokenize and trade real-world assets on the blockchain. Our platform enables property owners to list their assets and investors to purchase fractional ownership through RWA tokens."
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="gap-2 text-lg px-8 py-6">
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="text-lg px-8 py-6 bg-transparent"
          >
            Explore Assets
          </Button>
        </div>
      </div>
    </section>
  );
}
