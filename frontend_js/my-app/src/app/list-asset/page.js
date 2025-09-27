"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { ArrowLeft, Loader2, X } from "lucide-react";
import { ethers } from "ethers";

// ---- Minimal toast system (Tailwind-only) ----
function useMiniToast() {
  const [toasts, setToasts] = useState([]);
  const add = ({
    title,
    description,
    variant = "default",
    duration = 6000,
  }) => {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
    setToasts((t) => [...t, { id, title, description, variant }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
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

// --- Minimal ABI for ProjectFactory.createProject(...) ---
const PROJECT_FACTORY_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_insurancePool", type: "address" },
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
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "allProjects",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
      { internalType: "uint256", name: "area", type: "uint256" },
      { internalType: "uint256", name: "req_amount", type: "uint256" },
      { internalType: "uint256", name: "exp_return_amount", type: "uint256" },
      { internalType: "uint256", name: "min_threshold", type: "uint256" },
      { internalType: "uint256", name: "timeout", type: "uint256" },
    ],
    name: "createProject",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllProjects",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "insurancePool",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

const PROJECT_FACTORY_ADDRESS = "0x98B03aeF4d8BF183D5805f48AF6beF5cd571571C";

// ---- Tailwind “variants” (mimic shadcn look) ----
const btnBase =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
const btn = `${btnBase} bg-primary text-primary-foreground hover:opacity-90 px-4 py-2`;
const btnLg = `${btn} text-base py-3`;
const card =
  "rounded-lg border border-border bg-card text-card-foreground shadow-sm";
const cardHeader = "p-6";
const cardTitle = "text-lg font-semibold leading-none tracking-tight";
const cardDescription = "text-sm text-muted-foreground mt-1";
const cardContent = "p-6 pt-0";
const input =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2";
const textarea =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2";

export default function ListAssetPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
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

  const { toasts, add: toast, remove } = useMiniToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
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
      (field) => !String(formData[field] || "").trim()
    );

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first
    if (!validateForm()) return;

    try {
      setIsVerifying(true);

      // Check wallet
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No Ethereum wallet found. Please install MetaMask.");
      }

      // Request connection
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please connect your wallet.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Prepare params
      const name = formData.name.trim();
      const symbol = formData.tokenSymbol.trim().toUpperCase();

      let area, req_amount, exp_return_amount, min_threshold, timeout;
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

      // Contract
      const factory = new ethers.Contract(
        PROJECT_FACTORY_ADDRESS,
        PROJECT_FACTORY_ABI,
        signer
      );
      const tx = await factory.createProject(
        name,
        symbol,
        area,
        req_amount,
        exp_return_amount,
        min_threshold,
        timeout
      );

      toast({
        title: "Transaction Sent",
        description: `Hash: ${tx.hash.slice(0, 10)}…`,
      });

      const receipt = await tx.wait();

      // Extract ProjectCreated event (best-effort)
      let createdAddress;
      try {
        const topic = ethers.id("ProjectCreated(address,address)");
        const log = receipt.logs.find((l) => l.topics && l.topics[0] === topic);
        if (log && log.topics.length > 1) {
          createdAddress = ethers.getAddress("0x" + log.topics[1].slice(26));
        }
      } catch {
        // no-op
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
    } catch (error) {
      let errorMessage = "An unexpected error occurred.";
      if (error && typeof error === "object") {
        if (error.code === 4001)
          errorMessage = "Transaction was rejected by user.";
        else if (error.code === -32603)
          errorMessage =
            "Internal JSON-RPC error. Please check your network connection.";
        else if (error.message) errorMessage = error.message;
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
      <ToastViewport toasts={toasts} remove={remove} />

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
          <div className={card}>
            <div className={cardHeader}>
              <div className={cardTitle}>Asset Information</div>
              <div className={cardDescription}>
                Provide details about your asset to create tokenized investment
                opportunities.
              </div>
            </div>
            <div className={cardContent}>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none"
                    >
                      Asset Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="e.g., Downtown Commercial Property"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={input}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="tokenSymbol"
                      className="text-sm font-medium leading-none"
                    >
                      Token Symbol *
                    </label>
                    <input
                      id="tokenSymbol"
                      name="tokenSymbol"
                      placeholder="e.g., DCP"
                      value={formData.tokenSymbol}
                      onChange={handleInputChange}
                      maxLength={6}
                      className={input}
                      required
                    />
                  </div>
                </div>

                {/* Location and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium leading-none"
                    >
                      Location *
                    </label>
                    <input
                      id="location"
                      name="location"
                      placeholder="e.g., New York, NY"
                      value={formData.location}
                      onChange={handleInputChange}
                      className={input}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="area"
                      className="text-sm font-medium leading-none"
                    >
                      Total Tokens *
                    </label>
                    <input
                      id="area"
                      name="area"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.area}
                      onChange={handleInputChange}
                      min="1"
                      className={input}
                      required
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="amountToRaise"
                      className="text-sm font-medium leading-none"
                    >
                      Amount to Raise (ETH) *
                    </label>
                    <input
                      id="amountToRaise"
                      name="amountToRaise"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 100"
                      value={formData.amountToRaise}
                      onChange={handleInputChange}
                      min="0"
                      className={input}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="expReturn"
                      className="text-sm font-medium leading-none"
                    >
                      Expected Return (ETH)
                    </label>
                    <input
                      id="expReturn"
                      name="expReturn"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 120"
                      value={formData.expReturn}
                      onChange={handleInputChange}
                      min="0"
                      className={input}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="minThreshold"
                      className="text-sm font-medium leading-none"
                    >
                      Minimum Threshold (ETH)
                    </label>
                    <input
                      id="minThreshold"
                      name="minThreshold"
                      type="number"
                      step="0.000000000000000001"
                      placeholder="e.g., 25"
                      value={formData.minThreshold}
                      onChange={handleInputChange}
                      min="0"
                      className={input}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="timeoutDays"
                      className="text-sm font-medium leading-none"
                    >
                      Timeout (days) *
                    </label>
                    <input
                      id="timeoutDays"
                      name="timeoutDays"
                      type="number"
                      placeholder="e.g., 30"
                      value={formData.timeoutDays}
                      onChange={handleInputChange}
                      min="1"
                      className={input}
                      required
                    />
                  </div>
                </div>

                {/* Optional Display Field */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="pricePerToken"
                      className="text-sm font-medium leading-none"
                    >
                      Price per Token (display only)
                    </label>
                    <input
                      id="pricePerToken"
                      name="pricePerToken"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={formData.pricePerToken}
                      onChange={handleInputChange}
                      min="0"
                      className={input}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none"
                  >
                    Asset Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe your asset, its features, and investment potential..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className={textarea}
                    required
                  />
                </div>

                {/* File Upload (optional demo) */}
                {/* 
                <div className="space-y-2">
                  <label htmlFor="document-upload" className="text-sm font-medium leading-none">
                    Verification Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="none"><path d="M..." /></svg>
                      <div className="mt-4">
                        <label htmlFor="document-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            {uploadedFile ? uploadedFile.name : "Click to upload or drag and drop"}
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
                </div>
                */}

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`${btnLg} w-full`}
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
                </button>

                {isVerifying && (
                  <div className="text-center text-sm text-muted-foreground">
                    Please confirm the transaction in your wallet...
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
