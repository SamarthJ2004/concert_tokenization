"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
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
  Check,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ---------- ethers v6 ----------
import { BrowserProvider, Contract, formatEther, parseEther } from "ethers";

// ---------------- CONFIG ----------------
const FACTORY_ADDRESS = "0x98B03aeF4d8BF183D5805f48AF6beF5cd571571C"; // <-- put your ProjectFactory address here

// Minimal ABIs (read-only)
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
type ProjectUi = {
  address: string;
  promoter: string;
  fundingClosed: boolean;
  totalRaisedEth: number;
  areaTokens: number; // equals token total supply in whole tokens (assuming minted 1:1 with area)
  reqAmountEth: number; // fundraising target in ETH
  expReturnEth: number; // from exp_return_amount (ETH)
  minThresholdEth: number; // from min_threshold (ETH)
  timeout: number; // raw uint
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupplyTokens: number;
    promoterBalanceTokens: number;
  };
};

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const routeId = String(params.id); // can be address or numeric index
  const { toast } = useToast();

  const [purchaseAmount, setPurchaseAmount] = useState(""); // tokens (whole)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [proj, setProj] = useState<ProjectUi | null>(null);

  // local UI for allowlist demo (not on-chain)
  const [waitlisted, setWaitlisted] = useState<string[]>([
    "satoshi.eth",
    "vitalik.eth",
    "naval.eth",
  ]);
  const [allowed, setAllowed] = useState<string[]>([]);

  // ---- helpers ----
  const isAddressLike = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);

  // Resolve route param -> project address
  async function resolveProjectAddress(
    provider: BrowserProvider
  ): Promise<string> {
    if (isAddressLike(routeId)) return routeId;

    // treat as index (1-based or 0-based). We'll accept either:
    const idxRaw = Number(routeId);
    if (Number.isFinite(idxRaw) && idxRaw >= 0) {
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      const all: string[] = await factory.getAllProjects();
      // prefer 1-based if possible; else fallback to 0-based
      if (idxRaw > 0 && idxRaw <= all.length) return all[idxRaw - 1];
      if (idxRaw < all.length) return all[idxRaw];
      throw new Error(
        `Project index out of range. Found ${all.length} projects.`
      );
    }

    throw new Error("Route param must be a project address (0x…) or an index.");
  }

  // Fetch from chain
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        if (!window?.ethereum) throw new Error("No wallet provider found.");

        const provider = new BrowserProvider(window.ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
        } catch {}

        const projectAddr = await resolveProjectAddress(provider);
        const project = new Contract(projectAddr, PROJECT_ABI, provider);

        const [
          promoter,
          fundingClosed,
          totalRaisedBN,
          areaBN,
          reqAmountBN,
          expReturnBN,
          minThresholdBN,
          timeout,
          shareTokenAddr,
        ] = await Promise.all([
          project.promoter(),
          project.fundingClosed(),
          project.totalRaised(),
          project.area(),
          project.req_amount(),
          project.exp_return_amount(),
          project.min_threshold(),
          project.timeout(),
          project.shareToken(),
        ]);

        const token = new Contract(shareTokenAddr, ERC20_MIN_ABI, provider);
        const [name, symbol, decimals, totalSupplyBN, promoterBalBN] =
          await Promise.all([
            token.name(),
            token.symbol(),
            token.decimals(),
            token.totalSupply(),
            token.balanceOf(promoter),
          ]);

        const base = 10 ** Number(decimals);
        const totalSupplyTokens = Number(totalSupplyBN) / base;
        const promoterBalanceTokens = Number(promoterBalBN) / base;

        const ui: ProjectUi = {
          address: projectAddr,
          promoter,
          fundingClosed,
          totalRaisedEth: Number(formatEther(totalRaisedBN)),
          areaTokens: Number(areaBN),
          reqAmountEth: Number(formatEther(reqAmountBN)),
          expReturnEth: Number(formatEther(expReturnBN)),
          minThresholdEth: Number(formatEther(minThresholdBN)),
          timeout: Number(timeout),
          token: {
            address: shareTokenAddr,
            name,
            symbol,
            decimals: Number(decimals),
            totalSupplyTokens,
            promoterBalanceTokens,
          },
        };

        setProj(ui);
      } catch (e: any) {
        console.error(e);
        setErr(e?.message ?? "Failed to load project.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeId]);

  // -------- derived UI values --------
  const soldTokens = useMemo(() => {
    if (!proj) return 0;
    // tokens distributed out from promoter wallet (approx)
    return Math.max(
      0,
      proj.token.totalSupplyTokens - proj.token.promoterBalanceTokens
    );
  }, [proj]);

  const availableTokens = useMemo(() => {
    if (!proj) return 0;
    return Math.max(0, proj.token.totalSupplyTokens - soldTokens);
  }, [proj, soldTokens]);

  const pricePerTokenEth = useMemo(() => {
    if (!proj) return 0;
    // req_amount (ETH) divided by areaTokens (plain token units)
    return proj.areaTokens > 0 ? proj.reqAmountEth / proj.areaTokens : 0;
  }, [proj]);

  const progressPct = useMemo(() => {
    if (!proj) return 0;
    return proj.reqAmountEth > 0
      ? (proj.totalRaisedEth / proj.reqAmountEth) * 100
      : 0;
  }, [proj]);

  const statusLabel = useMemo<"active" | "funded">(() => {
    if (!proj) return "active";
    return proj.fundingClosed || proj.totalRaisedEth >= proj.reqAmountEth
      ? "funded"
      : "active";
  }, [proj]);

  // ---------- actions ----------
  const handleBuyTokens = () => {
    if (!proj) return;
    const qty = Number.parseInt(purchaseAmount);
    if (!Number.isFinite(qty) || qty <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Enter token quantity > 0",
        variant: "destructive",
      });
      return;
    }
    if (qty > availableTokens) {
      toast({
        title: "Insufficient Tokens",
        description: `Only ${availableTokens} tokens estimated available.`,
        variant: "destructive",
      });
      return;
    }
    // NOTE: Actual purchase requires calling project.invest() with msg.value = qty * pricePerTokenEth
    // and promoter must have approved tokens to the Project beforehand.
    toast({
      title: "Demo Only",
      description: `Would invest ~${(qty * pricePerTokenEth).toFixed(
        6
      )} ETH into ${proj.token.symbol}. Wire up project.invest() to proceed.`,
    });
    setPurchaseAmount("");
  };

  const handleAllow = (ens: string) => {
    setWaitlisted((prev) => prev.filter((e) => e !== ens));
    setAllowed((prev) => [...prev, ens]);
    toast({
      title: "Address Allowed",
      description: `${ens} can now buy/sell/transfer ${
        proj?.token.symbol ?? "TOKEN"
      }.`,
    });
  };

  // ---------- rendering ----------
  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">Loading project…</div>
      </main>
    );
  }

  if (err || !proj) {
    return (
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">
            {err ?? "Try a different id/address."}
          </p>
          <Link href="/browse-tokens">
            <Button>Back to Browse Tokens</Button>
          </Link>
        </div>
      </main>
    );
  }

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
                  src={"/placeholder.svg"}
                  alt={proj.token.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={statusLabel === "funded" ? "default" : "secondary"}
                  >
                    {statusLabel === "funded" ? "Fully Funded" : "Active"}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">
                      {proj.token.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2 text-base">
                      <MapPin className="h-4 w-4" />
                      {/* No on-chain location; placeholder */}—
                    </CardDescription>
                    <CardDescription className="mt-2 text-xs break-all">
                      Project: {proj.address}
                    </CardDescription>
                    <CardDescription className="text-xs break-all">
                      Token: {proj.token.address}
                    </CardDescription>
                    <CardDescription className="text-xs break-all">
                      Promoter: {proj.promoter}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="font-mono text-lg px-3 py-1"
                  >
                    {proj.token.symbol}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-4">
                  On-chain project tokenized via ComplianceToken. Values below
                  are live from the contracts.
                </p>
              </CardHeader>
            </Card>

            {/* Key Metrics (some items kept as placeholders where off-chain) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    {proj.reqAmountEth.toLocaleString()} ETH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Target Amount
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">{proj.timeout}</div>
                  <div className="text-sm text-muted-foreground">
                    Timeout (raw)
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">
                    {pricePerTokenEth.toFixed(6)} ETH
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Price / Token
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">—</div>
                  <div className="text-sm text-muted-foreground">
                    Total Investors (add helper on-chain)
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
                          {pricePerTokenEth.toFixed(6)} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Expected Return (target)
                        </div>
                        <div className="text-xl font-semibold">
                          {proj.expReturnEth.toLocaleString()} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Min Threshold
                        </div>
                        <div className="text-xl font-semibold">
                          {proj.minThresholdEth.toLocaleString()} ETH
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Tokens
                        </div>
                        <div className="text-xl font-semibold">
                          {proj.token.totalSupplyTokens.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Sold Tokens
                        </div>
                        <div className="text-xl font-semibold">
                          {soldTokens.toLocaleString()}
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
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Funding Progress
                        </span>
                        <span className="font-medium">
                          {progressPct.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={progressPct} className="h-3" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {proj.totalRaisedEth.toLocaleString()} ETH raised
                        </span>
                        <span>
                          {proj.reqAmountEth.toLocaleString()} ETH target
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="investors" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Holders Snapshot</CardTitle>
                    <CardDescription>
                      Full investor list requires a helper like{" "}
                      <code>getInvestorCount()</code> and iterating on-chain.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Promoter Holding
                      </div>
                      <div className="text-lg font-semibold">
                        {proj.token.promoterBalanceTokens.toLocaleString()}{" "}
                        tokens
                      </div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Distributed (Sold)
                      </div>
                      <div className="text-lg font-semibold">
                        {soldTokens.toLocaleString()} tokens
                      </div>
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
                    {/* On-chain contract doesn't store property metadata; placeholders shown */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Property Type
                        </div>
                        <div className="font-semibold">—</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Area (tokens)
                        </div>
                        <div className="font-semibold">
                          {proj.areaTokens.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Occupancy
                        </div>
                        <div className="font-semibold">—</div>
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
            {statusLabel === "active" && (
              <Card>
                <CardHeader>
                  <CardTitle>Invest in {proj.token.symbol}</CardTitle>
                  <CardDescription>
                    Purchase tokens to own a share
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
                        Total Investment (est.)
                      </div>
                      <div className="text-2xl font-bold">
                        {(() => {
                          const qty = Number.parseInt(purchaseAmount) || 0;
                          const total = qty * pricePerTokenEth;
                          return `${total.toFixed(6)} ETH`;
                        })()}
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
                  <span className="text-muted-foreground">
                    Market Cap (target)
                  </span>
                  <span className="font-semibold">
                    {proj.reqAmountEth.toLocaleString()} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Change</span>
                  <span className="font-semibold">—</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liquidity</span>
                  <span className="font-semibold">—</span>
                </div>
              </CardContent>
            </Card>

            {/* Waitlisted (UI demo only) */}
            <Card>
              <CardHeader>
                <CardTitle>Waitlisted</CardTitle>
                <CardDescription>Addresses requesting access</CardDescription>
              </CardHeader>
              <CardContent>
                {waitlisted.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No addresses waitlisted.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {waitlisted.map((ens) => (
                      <div
                        key={ens}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {ens.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium">{ens}</div>
                        </div>
                        <Button
                          size="sm"
                          className="gap-2"
                          onClick={() => handleAllow(ens)}
                        >
                          <Check className="h-4 w-4" />
                          Allow
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Allowed (UI demo only) */}
            <Card>
              <CardHeader>
                <CardTitle>Allowed</CardTitle>
                <CardDescription>Addresses permitted to trade</CardDescription>
              </CardHeader>
              <CardContent>
                {allowed.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No addresses allowed yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allowed.map((ens) => (
                      <div
                        key={ens}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {ens.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="font-medium">{ens}</div>
                        </div>
                        <Badge variant="outline">Allowed</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
