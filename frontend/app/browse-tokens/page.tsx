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
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

// ---------------- CONFIG ----------------
const FACTORY_ADDRESS = "0x165Ec032B5F1CDb9001C8c206e026082c1a1A8a7";

// ----- Minimal ABIs aligned to the provided Solidity -----
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
        indexed: true,
        internalType: "address",
        name: "project",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "promoter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "token",
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
        name: "projectAddr",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokenAddr",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "payoutWei",
        type: "uint256",
      },
    ],
    name: "InsuranceClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amountWei",
        type: "uint256",
      },
    ],
    name: "RevenueWithdrawn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wholeTokens",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "paidWei",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "insuranceCut",
        type: "uint256",
      },
    ],
    name: "TokensPurchased",
    type: "event",
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
    name: "availableTokens",
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
        name: "wholeTokens",
        type: "uint256",
      },
    ],
    name: "buyTokens",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "buyWithETH",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountWei",
        type: "uint256",
      },
    ],
    name: "claimInsurance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "investorWholeTokens",
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
    name: "pricePerWholeToken",
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
    name: "soldTokens",
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
    name: "soldWholeTokens",
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
    name: "tokenAddress",
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
  {
    inputs: [],
    name: "totalTokens",
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
        name: "amountWei",
        type: "uint256",
      },
    ],
    name: "withdrawRevenue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC20_MIN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

// ---------------- TYPES ----------------
type UiProperty = {
  id: number;
  address: string;
  name: string;
  customName?: string; // Optional custom ENS-style name
  symbol: string;
  promoter: string;
  location: string; // placeholder
  area: number; // total whole tokens minted
  pricePerTokenEth: number; // human ETH for 1 whole token
  totalTokens: number; // == area
  soldTokens: number; // from Project.soldTokens()
  availableTokens: number; // from Project.availableTokens()
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
        if (!(globalThis as any)?.ethereum) {
          throw new Error(
            "No wallet found. Please install MetaMask or similar."
          );
        }

        const provider = new BrowserProvider((globalThis as any).ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
        } catch { }

        const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
        const projectAddresses: string[] = await factory.getAllProjects();

        const items: UiProperty[] = await Promise.all(
          projectAddresses.map(async (addr, index) => {
            const project = new Contract(addr, PROJECT_ABI, provider);
            const [
              promoter,
              areaBN,
              reqAmountWei,
              totalRaisedWei,
              soldBN,
              availableBN,
              priceWei,
              tokenAddr,
            ] = await Promise.all([
              project.promoter(),
              project.area(),
              project.req_amount(),
              project.totalRaised(),
              project.soldTokens(),
              project.availableTokens(),
              project.pricePerWholeToken(),
              project.tokenAddress(),
            ]);

            const token = new Contract(tokenAddr, ERC20_MIN_ABI, provider);
            const [tokenName, tokenSymbol] = await Promise.all([
              token.name(),
              token.symbol(),
            ]);

            const area = Number(areaBN);
            const totalRaisedEth = Number(formatEther(totalRaisedWei));
            const reqAmountEth = Number(formatEther(reqAmountWei));
            const pricePerTokenEth = Number(formatEther(priceWei));
            const soldTokens = Number(soldBN);
            const availableTokens = Number(availableBN);

            const status: UiProperty["status"] =
              availableTokens === 0 || totalRaisedEth >= reqAmountEth
                ? "funded"
                : "active";

            // QUICKFIX: Check for custom name in localStorage
            const existingMappings = JSON.parse(localStorage.getItem('ensNames') || '{}');
            const customName = existingMappings[addr.toLowerCase()];

            const ui: UiProperty = {
              id: index + 1,
              address: addr,
              name: tokenName, // Keep original name
              customName: customName, // Add custom name as separate field
              symbol: tokenSymbol,
              promoter,
              location: "—",
              area,
              pricePerTokenEth,
              totalTokens: area,
              soldTokens,
              availableTokens,
              amountRaised: totalRaisedEth,
              targetAmount: reqAmountEth,
              description: "On-chain project tokenized via ComplianceToken.",
              image: "/placeholder.svg",
              apy: 0,
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

  async function handleBuyTokensOnChain(
    property: UiProperty,
    qtyWholeTokens: number
  ) {
    try {
      const provider = new BrowserProvider((globalThis as any).ethereum);
      const signer = await provider.getSigner();
      const project = new Contract(property.address, PROJECT_ABI, signer);

      // value = qty * pricePerWholeToken (wei)
      const priceWei = await project.pricePerWholeToken();
      const value = BigInt(priceWei) * BigInt(qtyWholeTokens);

      const tx = await project.buyTokens(qtyWholeTokens, { value });
      toast({ title: "Transaction sent", description: `Hash: ${tx.hash}` });
      const rcpt = await tx.wait();
      toast({
        title: "Purchase confirmed",
        description: `Block: ${rcpt.blockNumber}`,
      });

      // simple refresh of this card's data
      const [totalRaisedWei, soldBN, availableBN] = await Promise.all([
        project.totalRaised(),
        project.soldTokens(),
        project.availableTokens(),
      ]);

      setProperties((prev) =>
        prev.map((p) => {
          if (p.address !== property.address) return p;
          const amountRaised = Number(formatEther(totalRaisedWei));
          const soldTokens = Number(soldBN);
          const availableTokens = Number(availableBN);
          const status: UiProperty["status"] =
            availableTokens === 0 || amountRaised >= p.targetAmount
              ? "funded"
              : "active";
          return { ...p, amountRaised, soldTokens, availableTokens, status };
        })
      );
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Purchase failed",
        description: e?.message ?? "Error sending transaction",
        variant: "destructive",
      });
    }
  }

  const handleBuyTokens = async (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    const amount = Number.parseInt(purchaseAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter a valid whole-token amount.",
        variant: "destructive",
      });
      return;
    }

    if (amount > property.availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${property.availableTokens} tokens available.`,
        variant: "destructive",
      });
      return;
    }

    await handleBuyTokensOnChain(property, amount);
    setPurchaseAmount("");
    setSelectedProperty(null);
  };

  const handleSellTokens = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property || !purchaseAmount) return;

    toast({
      title: "Marketplace not implemented",
      description: "Secondary selling would require a marketplace.",
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

              return (
                <Link key={property.id} href={`/browse-tokens/${property.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {property.customName ? (
                              <div>
                                <div className="text-lg  font-normal">
                                  {property.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm ">

                                    <span className="text-muted-foreground">ENS name:</span>
                                    {property.customName}
                                  </span>

                                </div>
                              </div>
                            ) : (
                              property.name
                            )}
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
                        On-Chain Project Tokenized via Token2025
                      </p>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">
                            Price per Token
                          </div>
                          <div className="font-semibold">
                            {property.pricePerTokenEth.toFixed(6)} ETH
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Token Symbol
                          </div>
                          <div className="font-semibold text-accent">
                            {property.symbol}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">
                            Total Supply
                          </div>
                          <div className="font-semibold">
                            {property.totalTokens.toLocaleString()} tokens
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Available</div>
                          <div className="font-semibold">
                            {property.availableTokens.toLocaleString()} tokens
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
                          {/* <Button
                            variant="outline"
                            className="flex-1 gap-2 bg-transparent"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProperty(property.id);
                            }}
                          >
                            {/* <Wallet className="h-4 w-4" />
                            Sell */}
                          {/* </Button> */}
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
                  {(() => {
                    const property = properties.find((p) => p.id === selectedProperty);
                    if (!property) return null;

                    return property.customName ? (
                      <div>
                        <div className="flex items-center gap-2">
                          {property.customName}
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            ✨
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground font-normal">
                          {property.name}
                        </div>
                      </div>
                    ) : (
                      property.name
                    );
                  })()}
                </CardTitle>
                <CardDescription>
                  Enter the number of whole tokens you want to buy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Number of Whole Tokens</Label>
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
                            ?.pricePerTokenEth ?? 0;
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
                  {/* <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleSellTokens(selectedProperty)}
                  >
                    Sell Tokens
                  </Button> */}
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
