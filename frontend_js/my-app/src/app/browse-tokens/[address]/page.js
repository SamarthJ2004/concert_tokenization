"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MapPin,
  ArrowLeft,
  Users,
  DollarSign,
  Clock,
  Target,
  ShoppingCart,
  Wallet,
  Check,
} from "lucide-react";

// Lightweight toast (no shadcn): shows messages in top-right for a few seconds
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`pointer-events-auto mb-2 w-full max-w-sm overflow-hidden rounded-xl border shadow-lg ${
        type === "destructive"
          ? "border-red-200 bg-red-50 text-red-800"
          : "border-gray-200 bg-white text-gray-900"
      }`}
    >
      <div className="p-4 text-sm">{message}</div>
    </div>
  );
}

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
    // allowlist workflow
    waitlisted: ["satoshi.eth", "vitalik.eth", "naval.eth"],
    allowed: [],
  },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = Number(params?.id);
  const property = mockProperties.find((p) => p.id === propertyId);

  const [purchaseAmount, setPurchaseAmount] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // local state for waitlist/allowed
  const [waitlisted, setWaitlisted] = useState(property?.waitlisted ?? []);
  const [allowed, setAllowed] = useState(property?.allowed ?? []);

  // simple toast state
  const [toasts, setToasts] = useState([]);
  const pushToast = (msg, type = "default") =>
    setToasts((t) => [...t, { id: crypto.randomUUID(), msg, type }]);
  const removeToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  if (!property) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="border-b bg-white">
          {/* Replace this with your <Navigation /> if needed */}
          <div className="mx-auto max-w-7xl px-4 py-4 text-lg font-semibold">
            Navigation
          </div>
        </div>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold">Property Not Found</h1>
          <Link href="/browse-tokens" className="inline-block">
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50">
              Back to Browse Tokens
            </button>
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

    if (Number.isNaN(amount) || amount <= 0) {
      pushToast(
        "Invalid Amount — please enter a valid number of tokens to purchase.",
        "destructive"
      );
      return;
    }
    if (amount > availableTokens) {
      pushToast(
        `Insufficient Tokens — only ${availableTokens} tokens available for purchase.`,
        "destructive"
      );
      return;
    }
    pushToast(
      `Purchase Successful! Bought ${amount} ${property.symbol} for $${(
        amount * property.pricePerToken
      ).toLocaleString()}.`
    );
    setPurchaseAmount("");
  };

  const handleAllow = (ens) => {
    setWaitlisted((prev) => prev.filter((e) => e !== ens));
    setAllowed((prev) => [...prev, ens]);
    pushToast(`${ens} can now buy/sell/transfer ${property.symbol}.`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Toast container */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.msg}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>

      {/* Replace with your actual <Navigation /> */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 text-lg font-semibold">
          Navigation
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/browse-tokens"
            className="mb-4 inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse Tokens
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Property Header (Card) */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-4 top-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                      property.status === "funded"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {property.status === "funded" ? "Fully Funded" : "Active"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">{property.name}</h2>
                    <div className="mt-2 flex items-center gap-1 text-base text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {property.location}
                    </div>
                  </div>
                  <span className="rounded-md border border-gray-300 px-3 py-1 font-mono text-lg">
                    {property.symbol}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{property.description}</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="p-4 text-center">
                  <DollarSign className="mx-auto mb-2 h-8 w-8" />
                  <div className="text-2xl font-bold">
                    ${property.totalSale.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Sale</div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="p-4 text-center">
                  <Clock className="mx-auto mb-2 h-8 w-8" />
                  <div className="text-2xl font-bold">
                    {property.maturityTime}
                  </div>
                  <div className="text-sm text-gray-500">Maturity Time</div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="p-4 text-center">
                  <Target className="mx-auto mb-2 h-8 w-8" />
                  <div className="text-2xl font-bold">
                    ${property.ticketSale}
                  </div>
                  <div className="text-sm text-gray-500">Ticket Sale</div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="p-4 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8" />
                  <div className="text-2xl font-bold">
                    {property.totalInvestors}
                  </div>
                  <div className="text-sm text-gray-500">Total Investors</div>
                </div>
              </div>
            </div>

            {/* Tabs (Overview / Investors / Property Details) */}
            <div>
              {/* TabsList */}
              <div className="grid w-full grid-cols-3 rounded-xl border border-gray-200 bg-gray-100 p-1 text-sm">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "investors", label: "Investors" },
                  { id: "property", label: "Property Details" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`rounded-lg px-3 py-2 font-medium transition ${
                      activeTab === t.id
                        ? "bg-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TabsContent */}
              {activeTab === "overview" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 p-6">
                      <h3 className="text-lg font-semibold">
                        Investment Overview
                      </h3>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <div>
                          <div className="text-sm text-gray-500">
                            Price per Token
                          </div>
                          <div className="text-xl font-semibold">
                            ${property.pricePerToken}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Expected APY
                          </div>
                          <div className="text-xl font-semibold text-indigo-600">
                            {property.apy}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Total Tokens
                          </div>
                          <div className="text-xl font-semibold">
                            {property.totalTokens.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Sold Tokens
                          </div>
                          <div className="text-xl font-semibold">
                            {property.soldTokens.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Available</div>
                          <div className="text-xl font-semibold">
                            {availableTokens.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Property Area
                          </div>
                          <div className="text-xl font-semibold">
                            {property.area.toLocaleString()} sq ft
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            Funding Progress
                          </span>
                          <span className="font-medium">
                            {progressPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>
                            ${property.amountRaised.toLocaleString()} raised
                          </span>
                          <span>
                            ${property.targetAmount.toLocaleString()} target
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "investors" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 p-6">
                      <h3 className="text-lg font-semibold">Top Investors</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Current token holders and their investments
                      </p>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {property.investors.map((investor, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                                <span className="text-sm font-medium">
                                  {investor.ens.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-medium">
                                  {investor.ens}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {investor.tokens} tokens
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                ${investor.investment.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
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
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "property" && (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-100 p-6">
                      <h3 className="text-lg font-semibold">
                        Property Information
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        <div>
                          <div className="text-sm text-gray-500">
                            Property Type
                          </div>
                          <div className="font-semibold">
                            {property.propertyDetails.propertyType}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Year Built
                          </div>
                          <div className="font-semibold">
                            {property.propertyDetails.yearBuilt}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Floors</div>
                          <div className="font-semibold">
                            {property.propertyDetails.floors}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            {property.propertyDetails.units
                              ? "Units"
                              : "Tenants"}
                          </div>
                          <div className="font-semibold">
                            {property.propertyDetails.units ||
                              property.propertyDetails.tenants}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Occupancy Rate
                          </div>
                          <div className="font-semibold">
                            {property.propertyDetails.occupancyRate}%
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Monthly Rent
                          </div>
                          <div className="font-semibold">
                            $
                            {property.propertyDetails.monthlyRent.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            {property.status === "active" && (
              <div className="rounded-2xl border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-6">
                  <h3 className="text-lg font-semibold">
                    Invest in {property.symbol}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Purchase tokens to own a share of this property
                  </p>
                </div>
                <div className="space-y-4 p-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="tokens"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Number of Tokens
                    </label>
                    <input
                      id="tokens"
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter amount"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                    />
                  </div>

                  {purchaseAmount && (
                    <div className="rounded-lg bg-gray-100 p-3">
                      <div className="text-sm text-gray-500">
                        Total Investment
                      </div>
                      <div className="text-2xl font-bold">
                        $
                        {(
                          Number.parseInt(purchaseAmount || "0") *
                          property.pricePerToken
                        ).toLocaleString()}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={handleBuyTokens}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-black/90"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Buy Tokens
                    </button>
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
                      onClick={() => pushToast("Sell flow coming soon.")}
                    >
                      <Wallet className="h-4 w-4" />
                      Sell Tokens
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-6">
                <h3 className="text-lg font-semibold">Quick Stats</h3>
              </div>
              <div className="space-y-3 p-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Market Cap</span>
                  <span className="font-semibold">
                    $
                    {(
                      property.totalTokens * property.pricePerToken
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">24h Volume</span>
                  <span className="font-semibold">$45,230</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Price Change</span>
                  <span className="font-semibold text-green-600">+2.4%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Liquidity</span>
                  <span className="font-semibold">High</span>
                </div>
              </div>
            </div>

            {/* Waitlisted */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-6">
                <h3 className="text-lg font-semibold">Waitlisted</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Addresses requesting access to buy/sell/transfer
                </p>
              </div>
              <div className="p-6">
                {waitlisted.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No addresses are waitlisted.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {waitlisted.map((ens) => (
                      <div
                        key={ens}
                        className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-sm font-medium">
                              {ens.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium">{ens}</div>
                        </div>
                        <button
                          onClick={() => handleAllow(ens)}
                          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-black/90"
                        >
                          <Check className="h-4 w-4" />
                          Allow
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Allowed */}
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-100 p-6">
                <h3 className="text-lg font-semibold">Allowed</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Addresses permitted to buy/sell/transfer
                </p>
              </div>
              <div className="p-6">
                {allowed.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    No addresses are allowed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allowed.map((ens) => (
                      <div
                        key={ens}
                        className="flex items-center justify-between rounded-lg bg-gray-100 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-sm font-medium">
                              {ens.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium">{ens}</div>
                        </div>
                        <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700">
                          Allowed
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End Sidebar */}
        </div>
      </div>
    </main>
  );
}
