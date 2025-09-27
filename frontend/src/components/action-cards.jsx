import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* List Assets Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">List Your Assets</CardTitle>
              </div>
              <CardDescription className="text-base">
                {
                  "Tokenize your real-world assets including land, property, and other valuable assets. Create fractional ownership opportunities for global investors."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  {"Secure blockchain verification"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {"Global investor access"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  {"Real-time asset valuation"}
                </div>
              </div>
              <Link href="/list-asset">
                <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                  List Asset
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Buy Tokens Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-2 hover:border-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent" />
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Coins className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl">Buy RWA Tokens</CardTitle>
              </div>
              <CardDescription className="text-base">
                {
                  "Invest in fractional ownership of real-world assets through blockchain tokens. Diversify your portfolio with tangible asset-backed investments."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  {"Asset-backed security"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {"Fractional ownership"}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BarChart3 className="h-4 w-4" />
                  {"Transparent pricing"}
                </div>
              </div>
              <Link href="/browse-tokens">
                <Button className="w-full gap-2 group-hover:gap-3 transition-all">
                  Browse Tokens
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
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
