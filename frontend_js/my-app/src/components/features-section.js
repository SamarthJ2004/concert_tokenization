"use client";

import { Shield, Zap, Globe, Lock, TrendingUp, Users } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "Secure & Verified",
      description:
        "All assets undergo rigorous verification and are secured by blockchain technology.",
    },
    {
      icon: Zap,
      title: "Instant Trading",
      description:
        "Trade RWA tokens instantly with our automated execution system.",
    },
    {
      icon: Globe,
      title: "Global Access",
      description: "Access real-world assets from anywhere in the world, 24/7.",
    },
    {
      icon: Lock,
      title: "Regulatory Compliant",
      description:
        "Built with compliance in mind, meeting international regulatory standards.",
    },
    {
      icon: TrendingUp,
      title: "Real-time Analytics",
      description:
        "Track asset performance with comprehensive analytics and reporting.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Join a community of investors and asset owners building the future of finance.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            Why Choose RWAChain?
          </h2>
          <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
            {
              "Our platform combines the security of blockchain with the stability of real-world assets."
            }
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-border bg-background transition-colors hover:border-accent/20"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Icon
                        className="h-5 w-5 text-accent"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
