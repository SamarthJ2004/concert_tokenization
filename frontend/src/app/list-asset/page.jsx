"use client";

import React from "react";

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

export default function ListAssetPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFile, setUploadedFile] = (useState < File) | (null > null);
  const [formData, setFormData] = useState({
    name: "",
    tokenSymbol: "",
    area: "",
    location: "",
    pricePerToken: "",
    amountToRaise: "",
    description: "",
  });
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadedFile) {
      toast({
        title: "File Required",
        description: "Please upload ownership verification documents.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    // Simulate verification process for 5 seconds
    setTimeout(() => {
      setIsVerifying(false);
      toast({
        title: "Asset Listed Successfully!",
        description:
          "Your property is now being listed on the marketplace and will be available for investors soon.",
        duration: 5000,
      });

      // Reset form
      setFormData({
        name: "",
        tokenSymbol: "",
        area: "",
        location: "",
        pricePerToken: "",
        amountToRaise: "",
        description: "",
      });
      setUploadedFile(null);
    }, 5000);
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
                    <Label htmlFor="name">Asset Name</Label>
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
                    <Label htmlFor="tokenSymbol">Token Symbol</Label>
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
                    <Label htmlFor="location">Location</Label>
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
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input
                      id="area"
                      name="area"
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.area}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Financial Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerToken">Price per Token (USD)</Label>
                    <Input
                      id="pricePerToken"
                      name="pricePerToken"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={formData.pricePerToken}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amountToRaise">Amount to Raise (USD)</Label>
                    <Input
                      id="amountToRaise"
                      name="amountToRaise"
                      type="number"
                      placeholder="e.g., 1000000"
                      value={formData.amountToRaise}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Asset Description</Label>
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

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="verification">
                    Ownership Verification Documents
                  </Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                    <input
                      id="verification"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                    <label htmlFor="verification" className="cursor-pointer">
                      {uploadedFile ? (
                        <div className="flex items-center justify-center gap-2 text-accent">
                          <FileText className="h-6 w-6" />
                          <span>{uploadedFile.name}</span>
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium">
                              Upload verification documents
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PDF, DOC, or image files (max 10MB)
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying Asset...
                    </>
                  ) : (
                    "List Property"
                  )}
                </Button>

                {isVerifying && (
                  <div className="text-center text-sm text-muted-foreground">
                    Please wait while we verify your asset documentation...
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
