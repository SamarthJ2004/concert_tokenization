"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, ArrowLeft, Search, Filter, ShoppingCart, Wallet } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

// Mock data for listed properties
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
    description: "Prime commercial real estate in the heart of Manhattan with high-end retail tenants.",
    image: "/modern-commercial-building.png",
    apy: 8.5,
    status: "active",
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
    description: "High-end residential complex with premium amenities and ocean views.",
    image: "/luxury-apartment-complex.png",
    apy: 6.8,
    status: "active",
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
    description: "Strategic logistics hub with long-term industrial tenants and stable cash flow.",
    image: "/industrial-warehouse.png",
    apy: 9.2,
    status: "funded",
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
    description: "Modern office park in Austin's tech corridor with major tech company tenants.",
    image: "/modern-office-park-tech-campus.jpg",
    apy: 7.5,
    status: "active",
  },
]

export default function BrowseTokensPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)
  const [purchaseAmount, setPurchaseAmount] = useState("")
  const { toast } = useToast()

  const filteredProperties = mockProperties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBuyTokens = (propertyId: number) => {
    const property = mockProperties.find((p) => p.id === propertyId)
    if (!property || !purchaseAmount) return

    const amount = Number.parseInt(purchaseAmount)
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens to purchase.",
        variant: "destructive",
      })
      return
    }

    const availableTokens = property.totalTokens - property.soldTokens
    if (amount > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${availableTokens} tokens available for purchase.`,
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Purchase Successful!",
      description: `Successfully purchased ${amount} ${property.symbol} tokens for $${(amount * property.pricePerToken).toLocaleString()}.`,
    })

    setPurchaseAmount("")
    setSelectedProperty(null)
  }

  const handleSellTokens = (propertyId: number) => {
    const property = mockProperties.find((p) => p.id === propertyId)
    if (!property || !purchaseAmount) return

    toast({
      title: "Sell Order Placed",
      description: `Your sell order for ${purchaseAmount} ${property.symbol} tokens has been placed on the marketplace.`,
    })

    setPurchaseAmount("")
    setSelectedProperty(null)
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Browse RWA Tokens</h1>
          <p className="text-muted-foreground">
            Discover and invest in tokenized real-world assets from around the globe.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const progressPercentage = (property.soldTokens / property.totalTokens) * 100
            const availableTokens = property.totalTokens - property.soldTokens

            return (
              <Link key={property.id} href={`/browse-tokens/${property.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant={property.status === "funded" ? "default" : "secondary"}>
                        {property.status === "funded" ? "Fully Funded" : "Active"}
                      </Badge>
                    </div>
                  </div>

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{property.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="font-mono">
                        {property.symbol}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Price per Token</div>
                        <div className="font-semibold">${property.pricePerToken}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Expected APY</div>
                        <div className="font-semibold text-accent">{property.apy}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Area</div>
                        <div className="font-semibold">{property.area.toLocaleString()} sq ft</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Available</div>
                        <div className="font-semibold">{availableTokens.toLocaleString()} tokens</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Funding Progress</span>
                        <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${property.amountRaised.toLocaleString()} raised</span>
                        <span>${property.targetAmount.toLocaleString()} target</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {property.status === "active" ? (
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 gap-2"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedProperty(property.id)
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 gap-2 bg-transparent"
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedProperty(property.id)
                          }}
                        >
                          <Wallet className="h-4 w-4" />
                          Sell
                        </Button>
                      </div>
                    ) : (
                      <Button disabled className="w-full">
                        Fully Funded
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Purchase Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>{mockProperties.find((p) => p.id === selectedProperty)?.name}</CardTitle>
                <CardDescription>Enter the number of tokens you want to trade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Number of Tokens</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                  />
                </div>

                {purchaseAmount && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Cost</div>
                    <div className="text-lg font-semibold">
                      $
                      {(
                        Number.parseInt(purchaseAmount) *
                        (mockProperties.find((p) => p.id === selectedProperty)?.pricePerToken || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleBuyTokens(selectedProperty)}>
                    Buy Tokens
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleSellTokens(selectedProperty)}
                  >
                    Sell Tokens
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setSelectedProperty(null)
                    setPurchaseAmount("")
                  }}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
