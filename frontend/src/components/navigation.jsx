"use client";

import Link from "next/link";
import { WalletConnect } from "./wallet-connect";

export function Navigation() {
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              RWA<span className="text-accent">Chain</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/marketplace"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/assets"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My Assets
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}
