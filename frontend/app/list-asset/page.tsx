"use client";

import type React from "react";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// --- Minimal ABI for ProjectFactory.createProject(...) ---
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

const PROJECT_FACTORY_ADDRESS = "0x98B03aeF4d8BF183D5805f48AF6beF5cd571571C";

export default function ListAssetPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    tokenSymbol: "",
    area: "",
    location: "",
    pricePerToken: "",
    amountToRaise: "",
    expReturn: "",
    minThreshold: "",
    timeoutDays: "",
    description: "",
  });
  const { toast } = useToast();

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
        title: "Invalid Area",
        description: "Area must be a positive number",
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

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Form submitted"); // Debug log

    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      setIsVerifying(true);

      // Check if wallet is available
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      }

      console.log("Connecting to wallet..."); // Debug log

      // Request wallet connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please connect your wallet.");
      }

      console.log("Wallet connected:", accounts[0]); // Debug log

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      console.log("Preparing transaction parameters..."); // Debug log

      // Prepare transaction parameters with better error handling
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
      } catch (parseError) {
        throw new Error("Invalid numeric values. Please check your inputs.");
      }

      console.log("Transaction parameters:", {
        name,
        symbol,
        area: area.toString(),
        req_amount: req_amount.toString(),
        exp_return_amount: exp_return_amount.toString(),
        min_threshold: min_threshold.toString(),
        timeout: timeout.toString(),
      });

      // Create contract instance
      const factory = new ethers.Contract(
        PROJECT_FACTORY_ADDRESS,
        PROJECT_FACTORY_ABI,
        signer
      );

      console.log("Calling createProject..."); // Debug log

      // Call the contract function
      const tx = await factory.createProject(
        name,
        symbol,
        area,
        req_amount,
        exp_return_amount,
        min_threshold,
        timeout
      );

      console.log("Transaction sent:", tx.hash);

      toast({
        title: "Transaction Sent",
        description: `Hash: ${tx.hash.slice(0, 10)}…`,
      });

      console.log("Waiting for transaction confirmation..."); // Debug log

      const receipt = await tx.wait();

      console.log("Transaction confirmed:", receipt);

      // Try to extract the created project address from events
      let createdAddress: string | undefined;
      try {
        const projectCreatedTopic = ethers.id(
          "ProjectCreated(address,address)"
        );
        const log = receipt.logs.find(
          (log: any) => log.topics && log.topics[0] === projectCreatedTopic
        );
        if (log && log.topics.length > 1) {
          createdAddress = ethers.getAddress("0x" + log.topics[1].slice(26));
        }
      } catch (eventError) {
        console.warn("Could not parse ProjectCreated event:", eventError);
      }

      toast({
        title: "Project Created Successfully!",
        description: createdAddress
          ? `Project Address: ${createdAddress}`
          : "Transaction confirmed successfully!",
        duration: 8000,
      });

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
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Failed to Create Project",
        description: errorMessage,
        variant: "destructive",
        duration: 8000,
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

                {/* Optional Display Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerToken">
                      Price per Token (display only)
                    </Label>
                    <Input
                      id="pricePerToken"
                      name="pricePerToken"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={formData.pricePerToken}
                      onChange={handleInputChange}
                      min="0"
                    />
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

                {/* File Upload Section */}
                {/* <div className="space-y-2">
                  <Label htmlFor="document-upload">
                    Verification Documents (Optional)
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label
                          htmlFor="document-upload"
                          className="cursor-pointer"
                        >
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {uploadedFile
                              ? uploadedFile.name
                              : "Click to upload or drag and drop"}
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PDF, DOC, DOCX up to 10MB
                          </span>
                        </label>
                        <input
                          id="document-upload"
                          name="document-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>
                </div> */}

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
