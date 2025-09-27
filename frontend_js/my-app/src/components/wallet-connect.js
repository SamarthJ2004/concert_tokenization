"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async (walletType: string) => {
    // Simulate wallet connection
    console.log(`Connecting to ${walletType}...`);

    // Mock connection logic
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress("0x1234...5678");
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
  };

  if (isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            {walletAddress}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={disconnectWallet}>
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="gap-2">
          <Wallet className="h-4 w-4" />
          Connect Wallet
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => connectWallet("MetaMask")}>
          MetaMask
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => connectWallet("WalletConnect")}>
          WalletConnect
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => connectWallet("Coinbase Wallet")}>
          Coinbase Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
