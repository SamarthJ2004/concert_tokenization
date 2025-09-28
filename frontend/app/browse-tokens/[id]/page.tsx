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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { normalize, namehash } from "viem/ens";
import { createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { createWalletClient, http } from "viem";

// ---------- ethers v6 ----------
import {
  BrowserProvider,
  Contract,
  formatEther,
  getAddress,
  parseUnits,
} from "ethers";

// ---------------- CONFIG ----------------
// TODO: set your real deployed factory address here
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
type ProjectUi = {
  address: string;
  promoter: string;
  totalRaisedEth: number;
  areaTokens: number; // totalTokens()
  reqAmountEth: number; // req_amount (ETH)
  expReturnEth: number; // exp_return_amount (ETH)
  minThresholdEth: number; // min_threshold (ETH)
  timeout: number; // raw uint
  pricePerWholeTokenWei: bigint; // exact on-chain price per whole token in wei
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    totalSupplyTokens: number; // ERC20 totalSupply scaled down by decimals
    projectBalanceTokens: number; // balance held by the Project (i.e., unsold inventory)
  };
};

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const routeId = String(params.id);
  const { toast } = useToast();
  const [ENSName, setENSName] = useState<string | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(""); // tokens (whole)
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [proj, setProj] = useState<ProjectUi | null>(null);

  // ---- helpers ----
  const isAddressLike = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s);

  async function resolveProjectAddress(
    provider: BrowserProvider
  ): Promise<string> {
    if (isAddressLike(routeId)) return getAddress(routeId);

    // treat as index (1-based or 0-based)
    const idxRaw = Number(routeId);
    if (Number.isFinite(idxRaw) && idxRaw >= 0) {
      const factory = new Contract(FACTORY_ADDRESS, FACTORY_ABI, provider);
      const all: string[] = await factory.getAllProjects();
      if (idxRaw > 0 && idxRaw <= all.length)
        return getAddress(all[idxRaw - 1]);
      if (idxRaw < all.length) return getAddress(all[idxRaw]);
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
        if (!(globalThis as any)?.ethereum)
          throw new Error("No wallet provider found.");

        const provider = new BrowserProvider((globalThis as any).ethereum);
        try {
          await provider.send("eth_requestAccounts", []);
        } catch { }

        const projectAddr = await resolveProjectAddress(provider);
        const project = new Contract(projectAddr, PROJECT_ABI, provider);

        const [
          promoter,
          areaBN,
          reqAmountBN,
          expReturnBN,
          minThresholdBN,
          timeout,
          pricePerWholeTokenWei,
          totalRaisedBN,
          totalTokensBN,
          availableTokensBN,
          tokenAddr,
        ] = await Promise.all([
          project.promoter(),
          project.area(),
          project.req_amount(),
          project.exp_return_amount(),
          project.min_threshold(),
          project.timeout(),
          project.pricePerWholeToken(),
          project.totalRaised(),
          project.totalTokens(),
          project.availableTokens(),
          project.tokenAddress(),
        ]);

        const token = new Contract(tokenAddr, ERC20_MIN_ABI, provider);
        const [name, symbol, decimals, totalSupplyBN, projectBalBN] =
          await Promise.all([
            token.name(),
            token.symbol(),
            token.decimals(),
            token.totalSupply(),
            token.balanceOf(projectAddr), // inventory held by Project
          ]);

        const base = 10 ** Number(decimals);
        const ui: ProjectUi = {
          address: projectAddr,
          promoter,
          totalRaisedEth: Number(formatEther(totalRaisedBN)),
          areaTokens: Number(totalTokensBN),
          reqAmountEth: Number(formatEther(reqAmountBN)),
          expReturnEth: Number(formatEther(expReturnBN)),
          minThresholdEth: Number(formatEther(minThresholdBN)),
          timeout: Number(timeout),
          pricePerWholeTokenWei: BigInt(pricePerWholeTokenWei.toString()),
          token: {
            address: tokenAddr,
            name,
            symbol,
            decimals: Number(decimals),
            totalSupplyTokens: Number(totalSupplyBN) / base,
            projectBalanceTokens: Number(projectBalBN) / base,
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

  // ENS name lookup for project contract address
  useEffect(() => {
    if (proj?.address) {
      fetchENSName();
    }
  }, [proj?.address]);

  async function fetchENSName() {
    try {
      // 🚀 HACKATHON QUICKFIX: Read ENS name from localStorage
      const address = proj!.address;
      const existingMappings = JSON.parse(localStorage.getItem('ensNames') || '{}');
      const ensName = existingMappings[address.toLowerCase()];

      if (ensName) {
        setENSName(ensName);
        console.log("Found stored ENS name:", ensName, "for address:", address);
      } else {
        setENSName(null);
        console.log("No stored ENS name found for address:", address);
      }
    } catch (error) {
      console.warn("Failed to fetch stored ENS name:", error);
      setENSName(null);
    }
  }

  // -------- derived UI values --------
  const soldTokens = useMemo(() => {
    if (!proj) return 0;
    // Sold = totalTokens - inventory (held by Project)
    return Math.max(0, proj.areaTokens - proj.token.projectBalanceTokens);
  }, [proj]);

  const availableTokens = useMemo(() => {
    if (!proj) return 0;
    return proj.token.projectBalanceTokens; // inventory equals available to sell
  }, [proj]);

  const pricePerTokenEth = useMemo(() => {
    if (!proj) return 0;
    // Convert exact on-chain wei price to ETH number for display only
    return Number(formatEther(proj.pricePerWholeTokenWei));
  }, [proj]);

  const progressPct = useMemo(() => {
    if (!proj) return 0;
    return proj.reqAmountEth > 0
      ? (proj.totalRaisedEth / proj.reqAmountEth) * 100
      : 0;
  }, [proj]);

  const statusLabel: "active" | "funded" = useMemo(() => {
    if (!proj) return "active";
    return availableTokens === 0 || proj.totalRaisedEth >= proj.reqAmountEth
      ? "funded"
      : "active";
  }, [proj, availableTokens]);

  // ---------- actions ----------
  const handleBuyTokens = async () => {
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
        description: `Only ${availableTokens} tokens available.`,
        variant: "destructive",
      });
      return;
    }

    try {
      if (!(globalThis as any)?.ethereum)
        throw new Error("No wallet provider found.");
      const provider = new BrowserProvider((globalThis as any).ethereum);
      const signer = await provider.getSigner();

      const project = new Contract(proj.address, PROJECT_ABI, signer);
      const value = proj.pricePerWholeTokenWei * BigInt(qty);

      const tx = await project.buyTokens(qty, { value });
      toast({ title: "Transaction Sent", description: `Hash: ${tx.hash}` });
      await tx.wait();
      toast({
        title: "Purchase Confirmed",
        description: `${qty} ${proj.token.symbol} purchased.`,
      });
      setPurchaseAmount("");
      // soft refresh
      const refreshedProvider = new BrowserProvider(
        (globalThis as any).ethereum
      );
      const projectRo = new Contract(
        proj.address,
        PROJECT_ABI,
        refreshedProvider
      );
      const [totalRaisedBN, availableBN] = await Promise.all([
        projectRo.totalRaised(),
        projectRo.availableTokens(),
      ]);
      setProj(
        (p) =>
          p && {
            ...p,
            totalRaisedEth: Number(formatEther(totalRaisedBN)),
            token: { ...p.token, projectBalanceTokens: Number(availableBN) },
          }
      );
    } catch (e: any) {
      console.error(e);
      toast({
        title: "Purchase Failed",
        description: e?.shortMessage ?? e?.message ?? "Unknown error",
        variant: "destructive",
      });
    }
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
                      <MapPin className="h-4 w-4" /> —
                    </CardDescription>
                    {ENSName && (
                      <CardDescription className="mt-2 text-sm font-medium text-primary">
                        ENS: {ENSName}
                      </CardDescription>
                    )}
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
                  Primary sales handled by the Project contract. Price and
                  supply come directly from chain.
                </p>
              </CardHeader>
            </Card>

            {/* Key Metrics */}
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
                    Investors (add helper)
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
                          {proj.areaTokens.toLocaleString()}
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
                      Full investor enumeration is not stored on-chain in this
                      version; add helper view(s) or indexer to list all
                      holders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Inventory (held by Project)
                      </div>
                      <div className="text-lg font-semibold">
                        {proj.token.projectBalanceTokens.toLocaleString()}{" "}
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
                    Purchase tokens directly from the Project
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
                    {/* <Button
                      variant="outline"
                      className="w-full gap-2 bg-transparent"
                      disabled
                    >
                      <Wallet className="h-4 w-4" />
                      Sell Tokens (TBD)
                    </Button> */}
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
                  <span className="text-muted-foreground">Insurance Cut</span>
                  <span className="font-semibold">5% per purchase</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Liquidity</span>
                  <span className="font-semibold">Primary sale only</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
