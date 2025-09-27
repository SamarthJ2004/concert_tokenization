"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  Wallet,
  X,
} from "lucide-react";
import { Navigation } from "@/components/navigation"; // keeping your custom nav

// ---- Minimal toast system (no shadcn) ----
function useMiniToast() {
  const [toasts, setToasts] = useState([]);
  const add = ({
    title,
    description,
    variant = "default",
    duration = 3000,
  }) => {
    const id = crypto.randomUUID();
    setToasts((t) => [...t, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  };
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  return { toasts, add, remove };
}

function ToastViewport({ toasts, remove }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`min-w-64 max-w-sm rounded-md border p-3 shadow-md bg-white ${
            t.variant === "destructive" ? "border-red-300" : "border-gray-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div
                className={`text-sm font-semibold ${
                  t.variant === "destructive" ? "text-red-700" : "text-gray-900"
                }`}
              >
                {t.title}
              </div>
              {t.description ? (
                <div className="text-sm text-gray-600">{t.description}</div>
              ) : null}
            </div>
            <button
              className="inline-flex h-6 w-6 items-center justify-center rounded hover:bg-gray-100"
              onClick={() => remove(t.id)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- Mock data (unchanged) ----
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
  },
];

export default function BrowseTokensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toasts, add: toast, remove } = useMiniToast();

  const filteredProperties = useMemo(() => {
    return mockProperties.filter(
      (property) =>
        property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleBuyTokens = (propertyId) => {
    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    const amount = Number.parseInt(purchaseAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens to purchase.",
        variant: "destructive",
      });
      return;
    }

    const availableTokens = property.totalTokens - property.soldTokens;
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
    setSelectedProperty(null);
  };

  const handleSellTokens = (propertyId) => {
    const property = mockProperties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    toast({
      title: "Sell Order Placed",
      description: `Your sell order for ${purchaseAmount} ${property.symbol} tokens has been placed on the marketplace.`,
    });

    setPurchaseAmount("");
    setSelectedProperty(null);
  };

  // ---- Utility UI bits to replace shadcn variants ----
  const btnBase =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const btn = `${btnBase} bg-primary text-primary-foreground hover:opacity-90 px-4 py-2`;
  const btnOutline = `${btnBase} border border-input bg-transparent hover:bg-accent hover:text-accent-foreground px-4 py-2`;
  const btnGhost = `${btnBase} hover:bg-accent hover:text-accent-foreground px-3 py-2`;

  const card =
    "rounded-lg border border-border bg-card text-card-foreground shadow-sm";
  const cardHeader = "p-6";
  const cardTitle = "text-lg font-semibold leading-none tracking-tight";
  const cardDescription = "text-sm text-muted-foreground mt-1";
  const cardContent = "p-6 pt-0";

  const badgeBase =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const badgeDefault = `${badgeBase} border-transparent bg-primary text-primary-foreground`;
  const badgeSecondary = `${badgeBase} border-transparent bg-secondary text-secondary-foreground`;
  const badgeOutline = `${badgeBase} border-border text-foreground`;

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <ToastViewport toasts={toasts} remove={remove} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Browse RWA Tokens</h1>
          <p className="text-muted-foreground">
            Discover and invest in tokenized real-world assets from around the
            globe.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search by name, location, or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2"
            />
          </div>
          <button className={btnOutline}>
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => {
            const progressPercentage =
              (property.soldTokens / property.totalTokens) * 100;
            const availableTokens = property.totalTokens - property.soldTokens;

            return (
              <Link key={property.id} href={`/browse-tokens/${property.id}`}>
                <div
                  className={`${card} overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={
                          property.status === "funded"
                            ? badgeDefault
                            : badgeSecondary
                        }
                      >
                        {property.status === "funded"
                          ? "Fully Funded"
                          : "Active"}
                      </span>
                    </div>
                  </div>

                  <div className={cardHeader}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className={cardTitle}>{property.name}</div>
                        <div
                          className={`${cardDescription} flex items-center gap-1`}
                        >
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </div>
                      </div>
                      <span className={`${badgeOutline} font-mono`}>
                        {property.symbol}
                      </span>
                    </div>
                  </div>

                  <div className={cardContent + " space-y-4"}>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {property.description}
                    </p>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">
                          Price per Token
                        </div>
                        <div className="font-semibold">
                          ${property.pricePerToken}
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">
                          Expected APY
                        </div>
                        <div className="font-semibold text-accent">
                          {property.apy}%
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Area</div>
                        <div className="font-semibold">
                          {property.area.toLocaleString()} sq ft
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Available</div>
                        <div className="font-semibold">
                          {availableTokens.toLocaleString()} tokens
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Funding Progress
                        </span>
                        <span className="font-medium">
                          {progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>
                          ${property.amountRaised.toLocaleString()} raised
                        </span>
                        <span>
                          ${property.targetAmount.toLocaleString()} target
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {property.status === "active" ? (
                      <div className="flex gap-2">
                        <button
                          className={`${btn} flex-1`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedProperty(property.id);
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy
                        </button>
                        <button
                          className={`${btnOutline} flex-1`}
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedProperty(property.id);
                          }}
                        >
                          <Wallet className="h-4 w-4" />
                          Sell
                        </button>
                      </div>
                    ) : (
                      <button className={`${btn} w-full opacity-70`} disabled>
                        Fully Funded
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Purchase Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className={`${card} w-full max-w-md`}>
              <div className={cardHeader}>
                <div className="text-xl font-semibold">
                  {mockProperties.find((p) => p.id === selectedProperty)?.name}
                </div>
                <div className={cardDescription}>
                  Enter the number of tokens you want to trade
                </div>
              </div>

              <div className={cardContent + " space-y-4"}>
                <div className="space-y-2">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium leading-none"
                  >
                    Number of Tokens
                  </label>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2"
                  />
                </div>

                {purchaseAmount ? (
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground">
                      Total Cost
                    </div>
                    <div className="text-lg font-semibold">
                      $
                      {(
                        Number.parseInt(purchaseAmount, 10) *
                        (mockProperties.find((p) => p.id === selectedProperty)
                          ?.pricePerToken || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-2">
                  <button
                    className={`${btn} flex-1`}
                    onClick={() => handleBuyTokens(selectedProperty)}
                  >
                    Buy Tokens
                  </button>
                  <button
                    className={`${btnOutline} flex-1`}
                    onClick={() => handleSellTokens(selectedProperty)}
                  >
                    Sell Tokens
                  </button>
                </div>

                <button
                  className={`${btnGhost} w-full`}
                  onClick={() => {
                    setSelectedProperty(null);
                    setPurchaseAmount("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
