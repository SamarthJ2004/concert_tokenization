"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
import {
  MapPin,
  ArrowLeft,
  Search,
  Filter,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ---- Ethers v6 imports ----
import { BrowserProvider, Contract, formatEther } from "ethers";

// ---------------- CONFIG ----------------
const FACTORY_ADDRESS = "0x98B03aeF4d8BF183D5805f48AF6beF5cd571571C"; // TODO: put your deployed ProjectFactory address

// Minimal ABIs (only the view functions we read)
const FACTORY_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_insurancePool",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "project",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "promoter",
        type: "address",
      },
    ],
    name: "ProjectCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allProjects",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "area",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "req_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "exp_return_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "min_threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timeout",
        type: "uint256",
      },
    ],
    name: "createProject",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProjects",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "insurancePool",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const PROJECT_ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "address",
        name: "_promoter",
        type: "address",
      },
      {
        internalType: "address",
        name: "_insurancePool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_area",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_req_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_exp_return_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_min_threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_timeout",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "INSURANCE_BP",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "area",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "closeFunding",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "lossAmount",
        type: "uint256",
      },
    ],
    name: "distributeLoss",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "revenue",
        type: "uint256",
      },
    ],
    name: "distributeProfit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "exp_return_amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fundingClosed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "insurancePool",
    outputs: [
      {
        internalType: "contract InsurancePool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "invest",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "investorBalances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "investors",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "min_threshold",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "promoter",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "req_amount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "revenueDistributed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "shareToken",
    outputs: [
      {
        internalType: "contract ComplianceToken",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "timeout",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRaised",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ERC20_MIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
] as const;

// ---------------- TYPES ----------------
type UiProperty = {
  id: number;
  address: string;
  name: string;
  symbol: string;
  promoter: string;
  location: string; // placeholder
  area: number; // tokens (assumed == totalSupply)
  pricePerToken: number; // in ETH
  totalTokens: number;
  soldTokens: number;
  amountRaised: number; // ETH
  targetAmount: number; // ETH
  description: string; // placeholder
  image: string; // placeholder
  apy: number; // placeholder
  status: "active" | "funded";
};

export default function BrowseTokensPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState("");
  const { toast } = useToast();

  const [properties, setProperties] = useState<UiProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // ------------- Fetch on-chain data -------------
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        if (!window?.ethereum) {
          throw new Error(
            "No wallet found. Please install MetaMask or similar."
          );
        }

        const provider = new BrowserProvider(window.ethereum);
        // Optional: request accounts so chain is available (not required for reads but helpful)
        try {
          await provider.send("eth_requestAccounts", []);
        } catch {
          // ignore if user cancels; reads still work on public RPC if wallet injected allows
        }

        const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
        const projectAddresses: string[] = await factory.getAllProjects();

        const items: UiProperty[] = await Promise.all(
          projectAddresses.map(async (addr, index) => {
            const project = new Contract(addr, PROJECT_ABI, provider);
            const [
              promoter,
              fundingClosed,
              totalRaisedBN,
              areaBN,
              reqAmountBN,
              ,
              ,
              /* expReturnBN */ /* minThresholdBN */ tokenAddr,
            ] = await Promise.all([
              project.promoter(),
              project.fundingClosed(),
              project.totalRaised(),
              project.area(),
              project.req_amount(),
              project.exp_return_amount(),
              project.min_threshold(),
              project.shareToken(),
            ]);

            const token = new Contract(tokenAddr, ERC20_MIN_ABI, provider);
            const [
              tokenName,
              tokenSymbol,
              decimals,
              totalSupplyBN,
              promoterBalBN,
            ] = await Promise.all([
              token.name(),
              token.symbol(),
              token.decimals(),
              token.totalSupply(),
              token.balanceOf(promoter),
            ]);

            // Numbers & derived metrics
            // Token supply is in smallest units; area from Project is a plain uint (assumed == totalSupply).
            const base = 10 ** Number(decimals);

            const totalSupply = Number(totalSupplyBN) / base;
            const promoterBal = Number(promoterBalBN) / base;
            const soldTokens = Math.max(0, totalSupply - promoterBal);

            const area = Number(areaBN); // project.area() was used to mint tokens (plain units)
            const reqAmountEth = Number(formatEther(reqAmountBN));
            const totalRaisedEth = Number(formatEther(totalRaisedBN));

            const pricePerTokenEth = area > 0 ? reqAmountEth / area : 0;

            const status: UiProperty["status"] =
              fundingClosed || totalRaisedEth >= reqAmountEth
                ? "funded"
                : "active";

            // Fill UI object (placeholder metadata where off-chain)
            const ui: UiProperty = {
              id: index + 1,
              address: addr,
              name: tokenName,
              symbol: tokenSymbol,
              promoter,
              location: "—", // TODO: replace with your off-chain metadata
              area: area,
              pricePerToken: pricePerTokenEth,
              totalTokens: totalSupply,
              soldTokens,
              amountRaised: totalRaisedEth,
              targetAmount: reqAmountEth,
              description: "On-chain project tokenized via ComplianceToken.",
              image: "/placeholder.svg", // TODO: map your project address to images if you have them
              apy: 0, // Not on-chain; keep 0 or fetch from your off-chain DB
              status,
            };
            return ui;
          })
        );

        setProperties(items);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message ?? "Failed to load projects.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredProperties = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return properties;
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.symbol.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
    );
  }, [properties, searchTerm]);

  const handleBuyTokens = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    const amount = Number.parseInt(purchaseAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid number of tokens to purchase.",
        variant: "destructive",
      });
      return;
    }

    const availableTokens = Math.max(
      0,
      property.totalTokens - property.soldTokens
    );
    if (amount > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${availableTokens} tokens available for purchase.`,
        variant: "destructive",
      });
      return;
    }

    // NOTE: Actual buy flow requires:
    // 1) user sends ETH to project.invest()
    // 2) promoter must have approved tokens to project (shareToken.approve(project, area)) beforehand
    toast({
      title: "Demo Only",
      description:
        "This button is a demo. Wire up project.invest() to actually purchase.",
    });

    setPurchaseAmount("");
    setSelectedProperty(null);
  };

  const handleSellTokens = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    toast({
      title: "Demo Only",
      description:
        "Selling would require a marketplace. This is a placeholder action.",
    });

    setPurchaseAmount("");
    setSelectedProperty(null);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

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
            Discover and invest in tokenized real-world assets fetched from the
            blockchain.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, symbol, address..."
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

        {/* Loading / Error */}
        {loading && (
          <div className="text-sm text-muted-foreground">
            Loading projects from chain…
          </div>
        )}
        {err && <div className="text-sm text-red-500">Error: {err}</div>}

        {/* Properties Grid */}
        {!loading && !err && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => {
              const progressPercentage =
                property.targetAmount > 0
                  ? (property.amountRaised / property.targetAmount) * 100
                  : 0;
              const availableTokens = Math.max(
                0,
                property.totalTokens - property.soldTokens
              );

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
                        <Badge
                          variant={
                            property.status === "funded"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {property.status === "funded"
                            ? "Fully Funded"
                            : "Active"}
                        </Badge>
                      </div>
                    </div>

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {property.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {property.location}
                          </CardDescription>
                          <CardDescription className="mt-1 text-xs">
                            {property.address}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {property.symbol}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
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
                            {property.pricePerToken.toFixed(6)} ETH
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
                            {property.area.toLocaleString()} tokens
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
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>
                            {property.amountRaised.toLocaleString()} ETH raised
                          </span>
                          <span>
                            {property.targetAmount.toLocaleString()} ETH target
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {property.status === "active" ? (
                        <div className="flex gap-2">
                          <Button
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProperty(property.id);
                            }}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Buy
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 gap-2 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProperty(property.id);
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
              );
            })}
          </div>
        )}

        {/* Purchase Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>
                  {properties.find((p) => p.id === selectedProperty)?.name}
                </CardTitle>
                <CardDescription>
                  Enter the number of tokens you want to trade
                </CardDescription>
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
                    <div className="text-sm text-muted-foreground">
                      Total Cost (est.)
                    </div>
                    <div className="text-lg font-semibold">
                      {(() => {
                        const p =
                          properties.find((x) => x.id === selectedProperty)
                            ?.pricePerToken ?? 0;
                        const qty = Number.parseInt(purchaseAmount) || 0;
                        const total = qty * p;
                        return `${total.toLocaleString()} ETH`;
                      })()}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleBuyTokens(selectedProperty)}
                  >
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
                    setSelectedProperty(null);
                    setPurchaseAmount("");
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
  );
}
