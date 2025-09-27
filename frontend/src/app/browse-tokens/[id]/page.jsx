"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  ArrowLeft,
  Users,
  DollarSign,
  Clock,
  Target,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";

// Extended mock data with additional details
const mockProperties = [
  {
    id: 1,
    name: "Downtown Commercial Plaza",
    symbol: "DCP",
    location: "New York, NY",
    area: 15000,
    pricePerToken: 100,
    totalTokens: 10000,
    soldTokens: 7500,
    amountRaised: 750000,
    targetAmount: 1000000,
    description:
      "Prime commercial real estate in the heart of Manhattan with high-end retail tenants.",
    image: "/modern-commercial-building.png",
    apy: 8.5,
    status: "active",
    maturityTime: "24 months",
    totalSale: 1000000,
    ticketSale: 100,
    totalInvestors: 75,
    investors: [
      { ens: "bob.eth", tokens: 250, investment: 25000 },
      { ens: "alice.eth", tokens: 500, investment: 50000 },
      { ens: "charlie.eth", tokens: 300, investment: 30000 },
      { ens: "diana.eth", tokens: 150, investment: 15000 },
      { ens: "eve.eth", tokens: 400, investment: 40000 },
      { ens: "frank.eth", tokens: 200, investment: 20000 },
      { ens: "grace.eth", tokens: 350, investment: 35000 },
      { ens: "henry.eth", tokens: 180, investment: 18000 },
    ],
    propertyDetails: {
      yearBuilt: 2018,
      floors: 12,
      tenants: 8,
      occupancyRate: 95,
      monthlyRent: 45000,
      propertyType: "Commercial Office",
    },
  },
  {
    id: 2,
    name: "Luxury Residential Complex",
    symbol: "LRC",
    location: "Los Angeles, CA",
    area: 25000,
    pricePerToken: 250,
    totalTokens: 8000,
    soldTokens: 3200,
    amountRaised: 800000,
    targetAmount: 2000000,
    description:
      "High-end residential complex with premium amenities and ocean views.",
    image: "/luxury-apartment-complex.png",
    apy: 6.8,
    status: "active",
    maturityTime: "36 months",
    totalSale: 2000000,
    ticketSale: 250,
    totalInvestors: 32,
    investors: [
      { ens: "investor1.eth", tokens: 400, investment: 100000 },
      { ens: "crypto_whale.eth", tokens: 800, investment: 200000 },
      { ens: "realestate.eth", tokens: 300, investment: 75000 },
      { ens: "defi_king.eth", tokens: 500, investment: 125000 },
      { ens: "tokenized.eth", tokens: 250, investment: 62500 },
    ],
    propertyDetails: {
      yearBuilt: 2020,
      floors: 8,
      units: 64,
      occupancyRate: 88,
      monthlyRent: 85000,
      propertyType: "Luxury Residential",
    },
  },
  {
    id: 3,
    name: "Industrial Warehouse Hub",
    symbol: "IWH",
    location: "Chicago, IL",
    area: 50000,
    pricePerToken: 50,
    totalTokens: 20000,
    soldTokens: 20000,
    amountRaised: 1000000,
    targetAmount: 1000000,
    description:
      "Strategic logistics hub with long-term industrial tenants and stable cash flow.",
    image: "/industrial-warehouse.png",
    apy: 9.2,
    status: "funded",
    maturityTime: "18 months",
    totalSale: 1000000,
    ticketSale: 50,
    totalInvestors: 200,
    investors: [
      { ens: "logistics.eth", tokens: 2000, investment: 100000 },
      { ens: "warehouse_king.eth", tokens: 1500, investment: 75000 },
      { ens: "supply_chain.eth", tokens: 1000, investment: 50000 },
      { ens: "industrial.eth", tokens: 800, investment: 40000 },
      { ens: "freight.eth", tokens: 600, investment: 30000 },
    ],
    propertyDetails: {
      yearBuilt: 2015,
      floors: 1,
      tenants: 3,
      occupancyRate: 100,
      monthlyRent: 75000,
      propertyType: "Industrial Warehouse",
    },
  },
  {
    id: 4,
    name: "Tech Campus Office Park",
    symbol: "TCP",
    location: "Austin, TX",
    area: 35000,
    pricePerToken: 150,
    totalTokens: 12000,
    soldTokens: 4800,
    amountRaised: 720000,
    targetAmount: 1800000,
    description:
      "Modern office park in Austin's tech corridor with major tech company tenants.",
    image: "/modern-office-park-tech-campus.jpg",
    apy: 7.5,
    status: "active",
    maturityTime: "30 months",
    totalSale: 1800000,
    ticketSale: 150,
    totalInvestors: 48,
    investors: [
      { ens: "tech_investor.eth", tokens: 600, investment: 90000 },
      { ens: "austin_dev.eth", tokens: 400, investment: 60000 },
      { ens: "startup_fund.eth", tokens: 800, investment: 120000 },
      { ens: "silicon_hills.eth", tokens: 300, investment: 45000 },
      { ens: "venture.eth", tokens: 500, investment: 75000 },
    ],
    propertyDetails: {
      yearBuilt: 2019,
      floors: 6,
      tenants: 12,
      occupancyRate: 92,
      monthlyRent: 65000,
      propertyType: "Tech Office Campus",
    },
  },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = Number(params.id);
  const property = mockProperties.find((p) => p.id === propertyId);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toast } = useToast();

  if (!property) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Property Not Found</h1>
          <Link href="/browse-tokens">
            <Button>Back to Browse Tokens</Button>
          </Link>
        </div>
      </main>
    );
  }

  const progressPercentage = (property.soldTokens / property.totalTokens) * 100;
  const availableTokens = property.totalTokens - property.soldTokens;

  const handleBuyTokens = () => {
    if (!purchaseAmount) return;

    const amount = Number.parseInt(purchaseAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens to purchase.",
        variant: "destructive",
      });
      return;
    }

    if (amount > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${availableTokens} tokens available for purchase.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Purchase Successful!",
      description: `Successfully purchased ${amount} ${
        property.symbol
      } tokens for $${(amount * property.pricePerToken).toLocaleString()}.`,
    });

    setPurchaseAmount("");
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/browse-tokens"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Tokens
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Header */}
            <Card>
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={
                      property.status === "funded" ? "default" : "secondary"
                    }
                  >
                    {property.status === "funded" ? "Fully Funded" : "Active"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{property.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-lg px-3 py-1"
                  >
                    {property.symbol}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-4">
                  {property.description}
                </p>
              </CardHeader>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    ${property.totalSale.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Sale
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    {property.maturityTime}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Maturity Time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    ${property.ticketSale}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Ticket Sale
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    {property.totalInvestors}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Investors
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="investors">Investors</TabsTrigger>
                <TabsTrigger value="property">Property Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Price per Token
                        </div>
                        <div className="text-xl font-semibold">
                          ${property.pricePerToken}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Expected APY
                        </div>
                        <div className="text-xl font-semibold text-accent">
                          {property.apy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Tokens
                        </div>
                        <div className="text-xl font-semibold">
                          {property.totalTokens.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Sold Tokens
                        </div>
                        <div className="text-xl font-semibold">
                          {property.soldTokens.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Available
                        </div>
                        <div className="text-xl font-semibold">
                          {availableTokens.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Property Area
                        </div>
                        <div className="text-xl font-semibold">
                          {property.area.toLocaleString()} sq ft
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Funding Progress
                        </span>
                        <span className="font-medium">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          ${property.amountRaised.toLocaleString()} raised
                        </span>
                        <span>
                          ${property.targetAmount.toLocaleString()} target
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Investors</CardTitle>
                    <CardDescription>
                      Current token holders and their investments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.investors.map((investor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {investor.ens.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{investor.ens}</div>
                              <div className="text-sm text-muted-foreground">
                                {investor.tokens} tokens
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${investor.investment.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {(
                                (investor.tokens / property.totalTokens) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="property" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Property Type
                        </div>
                        <div className="font-semibold">
                          {property.propertyDetails.propertyType}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Year Built
                        </div>
                        <div className="font-semibold">
                          {property.propertyDetails.yearBuilt}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Floors
                        </div>
                        <div className="font-semibold">
                          {property.propertyDetails.floors}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          {property.propertyDetails.units ? "Units" : "Tenants"}
                        </div>
                        <div className="font-semibold">
                          {property.propertyDetails.units ||
                            property.propertyDetails.tenants}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Occupancy Rate
                        </div>
                        <div className="font-semibold">
                          {property.propertyDetails.occupancyRate}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Monthly Rent
                        </div>
                        <div className="font-semibold">
                          $
                          {property.propertyDetails.monthlyRent.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            {property.status === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle>Invest in {property.symbol}</CardTitle>
                  <CardDescription>
                    Purchase tokens to own a share of this property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokens">Number of Tokens</Label>
                    <Input
                      id="tokens"
                      type="number"
                      placeholder="Enter amount"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                    />
                  </div>

                  {purchaseAmount && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Total Investment
                      </div>
                      <div className="text-2xl font-bold">
                        $
                        {(
                          Number.parseInt(purchaseAmount) *
                          property.pricePerToken
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Button className="w-full gap-2" onClick={handleBuyTokens}>
                      <ShoppingCart className="h-4 w-4" />
                      Buy Tokens
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                    >
                      <Wallet className="h-4 w-4" />
                      Sell Tokens
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span className="font-semibold">
                    $
                    {(
                      property.totalTokens * property.pricePerToken
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">$45,230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Change</span>
                  <span className="font-semibold text-green-600">+2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liquidity</span>
                  <span className="font-semibold">High</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
