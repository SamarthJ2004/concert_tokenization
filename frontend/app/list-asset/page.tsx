"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";
import { normalize, namehash } from "viem/ens";
import { createPublicClient } from "viem";
import { sepolia } from "viem/chains";
import { createWalletClient, http, custom } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { set } from "date-fns";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * --- Updated Minimal ABI for ProjectFactory (new contracts) ---
 * - createProject returns (address project, address token)
 * - ProjectCreated(project indexed, promoter indexed, token non-indexed)
 */
const PROJECT_FACTORY_ABI = [
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

const PROJECT_FACTORY_ADDRESS = "0x165Ec032B5F1CDb9001C8c206e026082c1a1A8a7";
// ENS contract addresses (Sepolia) - Updated with correct addresses
const REVERSE_REGISTRAR_ADDRESS = "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6";
const PUBLIC_RESOLVER_ADDRESS = "0x42D63ae25990889E35F215bC95884039Ba354115";

export default function ListAssetPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ENSName, setENSName] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    tokenSymbol: "",
    area: "",
    location: "",
    pricePerToken: "", // purely display; we auto-fill based on amountToRaise/area if possible
    amountToRaise: "",
    expReturn: "",
    minThreshold: "",
    timeoutDays: "",
    ensName: "",
    description: "",
  });
  const { toast } = useToast();

  // auto-calc the (display) price per token if amountToRaise & area are filled and valid
  useEffect(() => {
    const areaNum = Number(formData.area);
    const amt = formData.amountToRaise;
    if (!isNaN(areaNum) && areaNum > 0 && amt) {
      const a = BigInt(isFinite(areaNum) ? Math.floor(areaNum) : 0);
      try {
        const reqWei = ethers.parseEther(amt);
        if (a > BigInt(0)) {
          const priceWei = reqWei / a;
          // if not exact division, leave display blank to hint it's not valid
          if (reqWei % a === BigInt(0)) {
            // show in ETH with up to 6 decimals for readability
            const priceEth = Number(ethers.formatEther(priceWei));
            setFormData((prev) => ({
              ...prev,
              pricePerToken: priceEth.toFixed(6).replace(/\.?0+$/, ""),
            }));
          }
        }
      } catch {
        /* ignore display calc errors */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.amountToRaise, formData.area]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file);
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "tokenSymbol",
      "area",
      "location",
      "amountToRaise",
      "timeoutDays",
      "description",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData].trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    // Validate numeric fields
    if (isNaN(Number(formData.area)) || Number(formData.area) <= 0) {
      toast({
        title: "Invalid Total Tokens",
        description: "Total tokens must be a positive integer",
        variant: "destructive",
      });
      return false;
    }

    if (
      isNaN(Number(formData.amountToRaise)) ||
      Number(formData.amountToRaise) <= 0
    ) {
      toast({
        title: "Invalid Amount",
        description: "Amount to raise must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    if (
      isNaN(Number(formData.timeoutDays)) ||
      Number(formData.timeoutDays) <= 0
    ) {
      toast({
        title: "Invalid Timeout",
        description: "Timeout days must be a positive number",
        variant: "destructive",
      });
      return false;
    }

    // NEW: enforce req_amount % area == 0 (in wei) to match contract requirement
    try {
      const areaBig = BigInt(formData.area);
      const reqWei = ethers.parseEther(formData.amountToRaise);
      if (reqWei % areaBig !== BigInt(0)) {
        toast({
          title: "Invalid Price Per Token",
          description:
            "Amount to raise must be divisible by Total Tokens (in wei). Adjust either value so price per token is an exact amount.",
          variant: "destructive",
          duration: 8000,
        });
        return false;
      }
    } catch {
      toast({
        title: "Invalid Numbers",
        description: "Please check Total Tokens and Amount to Raise.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsVerifying(true);

      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please connect your wallet.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const name = formData.name.trim();
      const symbol = formData.tokenSymbol.trim().toUpperCase();

      let area: bigint;
      let req_amount: bigint;
      let exp_return_amount: bigint;
      let min_threshold: bigint;
      let timeout: bigint;

      try {
        area = BigInt(formData.area);
        req_amount = ethers.parseEther(formData.amountToRaise);
        exp_return_amount = formData.expReturn
          ? ethers.parseEther(formData.expReturn)
          : BigInt(0);
        min_threshold = formData.minThreshold
          ? ethers.parseEther(formData.minThreshold)
          : BigInt(0);
        timeout = BigInt(Math.floor(Number(formData.timeoutDays) * 86400));
      } catch {
        throw new Error("Invalid numeric values. Please check your inputs.");
      }

      // Final safety check for divisibility (exact same as in validateForm)
      if (req_amount % area !== BigInt(0)) {
        throw new Error(
          "Amount to raise must be divisible by Total Tokens (exact, in wei)."
        );
      }

      const factory = new ethers.Contract(
        PROJECT_FACTORY_ADDRESS,
        PROJECT_FACTORY_ABI,
        signer
      );

      // Note: You'll need to modify your contract to accept ENS name as parameter
      const tx = await factory.createProject(
        name,
        symbol,
        area,
        req_amount,
        exp_return_amount,
        min_threshold,
        timeout
        // TODO: Add ensName parameter when contract is updated
        // formData.ensName.trim()
      );

      toast({
        title: "Transaction Sent",
        description: `Hash: ${tx.hash.slice(0, 10)}…`,
      });

      const receipt = await tx.wait();

      // Parse ProjectCreated(project, promoter, token)
      let projectAddr: string | undefined;
      let tokenAddr: string | undefined;
      try {
        const iface = new ethers.Interface(PROJECT_FACTORY_ABI as any);
        for (const log of receipt.logs) {
          try {
            const parsed = iface.parseLog(log);
            if (parsed?.name === "ProjectCreated") {
              projectAddr = parsed.args.project as string;
              tokenAddr = parsed.args.token as string;
              break;
            }
          } catch {
            // not our event; skip
          }
        }
      } catch (err) {
        console.warn("Event parsing failed:", err);
      }

      toast({
        title: "Project Created Successfully!",
        description:
          projectAddr && tokenAddr
            ? `Project: ${projectAddr}  •  Token: ${tokenAddr}`
            : "Transaction confirmed successfully!",
        duration: 9000,
      });

      // 🚀 HACKATHON QUICKFIX: Store ENS name locally instead of on-chain
      const ensName = formData.ensName.trim();
      if (ensName && projectAddr) {
        // Store the ENS name mapping in localStorage
        const existingMappings = JSON.parse(localStorage.getItem('ensNames') || '{}');
        existingMappings[projectAddr.toLowerCase()] = ensName;
        localStorage.setItem('ensNames', JSON.stringify(existingMappings));

        toast({
          title: "ENS Name Saved!",
          description: `${ensName} linked to project ${projectAddr.slice(0, 6)}...`,
        });

        console.log(`Saved ENS mapping: ${projectAddr} -> ${ensName}`);
      }
      // Reset form
      setFormData({
        name: "",
        tokenSymbol: "",
        area: "",
        location: "",
        pricePerToken: "",
        amountToRaise: "",
        expReturn: "",
        minThreshold: "",
        timeoutDays: "",
        ensName: "",
        description: "",
      });
      setUploadedFile(null);
    } catch (error: any) {
      console.error("Error creating project:", error);

      let errorMessage = "An unexpected error occurred.";
      if (error.code === 4001) {
        errorMessage = "Transaction was rejected by user.";
      } else if (error.code === -32603) {
        errorMessage =
          "Internal JSON-RPC error. Please check your network connection.";
      } else if (error.reason) {
        errorMessage = error.reason;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to Create Project",
        description: errorMessage,
        variant: "destructive",
        duration: 9000,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">List Your Asset</h1>
            <p className="text-muted-foreground">
              Tokenize your real-world asset and make it available for
              fractional investment.
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Information</CardTitle>
              <CardDescription>
                Provide details about your asset to create tokenized investment
                opportunities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Asset Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Downtown Commercial Property"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                    <Input
                      id="tokenSymbol"
                      name="tokenSymbol"
                      placeholder="e.g., DCP"
                      value={formData.tokenSymbol}
                      onChange={handleInputChange}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>

                {/* Location and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Total Tokens *</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.area}
                      onChange={handleInputChange}
                      min="1"
                      step="1"
                      required
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amountToRaise">
                      Amount to Raise (ETH) *
                    </Label>
                    <Input
                      id="amountToRaise"
                      name="amountToRaise"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 100"
                      value={formData.amountToRaise}
                      onChange={handleInputChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expReturn">Expected Return (ETH)</Label>
                    <Input
                      id="expReturn"
                      name="expReturn"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 120"
                      value={formData.expReturn}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minThreshold">
                      Minimum Threshold (ETH)
                    </Label>
                    <Input
                      id="minThreshold"
                      name="minThreshold"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 25"
                      value={formData.minThreshold}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeoutDays">Timeout (days) *</Label>
                    <Input
                      id="timeoutDays"
                      name="timeoutDays"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.timeoutDays}
                      onChange={handleInputChange}
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* Display-only Price Per Token (auto-filled if divisible) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerToken">
                      Price per Token (auto)
                    </Label>
                    <Input
                      id="pricePerToken"
                      name="pricePerToken"
                      type="text"
                      placeholder="auto-calculated"
                      value={formData.pricePerToken}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ensName">Custom Name (optional)</Label>
                    <Input
                      id="ensName"
                      name="ensName"
                      type="text"
                      placeholder="e.g., MyAwesome.Project"
                      value={formData.ensName}
                      onChange={handleInputChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      Custom display name for your project (shown instead of address)
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Asset Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your asset, its features, and investment potential..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Project...
                    </span>
                  ) : (
                    "List Property"
                  )}
                </Button>

                {isVerifying && (
                  <div className="text-center text-sm text-muted-foreground">
                    Please confirm the transaction in your wallet...
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
