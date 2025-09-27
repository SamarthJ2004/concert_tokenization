"use client";

import {
  Building2,
  Coins,
  ArrowUpRight,
  Shield,
  Users,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export function ActionCards() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            {
              "Whether you own real-world assets or want to invest in them, our platform provides the tools you need."
            }
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* List Assets Card */}
          <div className="relative overflow-hidden group transition-all duration-300 border-2 hover:border-accent/20 rounded-xl bg-background hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative z-10 p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold">List Your Assets</h3>
              </div>
              <p className="text-base text-muted-foreground">
                {
                  "Tokenize your real-world assets including land, property, and other valuable assets. Create fractional ownership opportunities for global investors."
                }
              </p>

              {/* Content */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secure blockchain verification</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Global investor access</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>Real-time asset valuation</span>
                </div>
              </div>

              {/* Button */}
              <Link href="/list-asset" className="block mt-6">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 group-hover:gap-3 transition-all rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  aria-label="List Asset"
                >
                  List Asset
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Buy Tokens Card */}
          <div className="relative overflow-hidden group transition-all duration-300 border-2 hover:border-accent/20 rounded-xl bg-background hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <div className="relative z-10 p-6 sm:p-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold">Buy RWA Tokens</h3>
              </div>
              <p className="text-base text-muted-foreground">
                {
                  "Invest in fractional ownership of real-world assets through blockchain tokens. Diversify your portfolio with tangible asset-backed investments."
                }
              </p>

              {/* Content */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Asset-backed security</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Fractional ownership</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  <span>Transparent pricing</span>
                </div>
              </div>

              {/* Button */}
              <Link href="/browse-tokens" className="block mt-6">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 group-hover:gap-3 transition-all rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  aria-label="Browse Tokens"
                >
                  Browse Tokens
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-accent mb-2">$50M+</div>
            <div className="text-sm text-muted-foreground">
              Assets Tokenized
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">1,200+</div>
            <div className="text-sm text-muted-foreground">
              Active Investors
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">95%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Global Trading</div>
          </div>
        </div>
      </div>
    </section>
  );
}
