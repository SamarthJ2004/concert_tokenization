"use client";

import { useEffect, useRef, useState } from "react";
import { Wallet, ChevronDown } from "lucide-react";

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const connectWallet = async (walletType) => {
    console.log(`Connecting to ${walletType}...`);
    setOpen(false);
    setTimeout(() => {
      setIsConnected(true);
      setWalletAddress("0x1234...5678");
    }, 1000);
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress("");
    setOpen(false);
  };

  // Shared button styles (mimics shadcn button)
  const baseBtn =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const solidBtn = `${baseBtn} bg-primary text-primary-foreground hover:opacity-90 px-4 py-2`;
  const outlineBtn = `${baseBtn} border border-input bg-transparent hover:bg-accent hover:text-accent-foreground px-4 py-2`;

  // If you're not using a Tailwind theme with these CSS vars, you can replace them with colors:
  // bg-primary -> "bg-black", text-primary-foreground -> "text-white", etc.
  // border-input -> "border-gray-300", hover:bg-accent -> "hover:bg-gray-100", etc.
  // hover:text-accent-foreground -> "hover:text-gray-900"

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      {/* Trigger */}
      <button
        type="button"
        className={isConnected ? outlineBtn : solidBtn}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Wallet className="h-4 w-4" />
        {isConnected ? walletAddress : "Connect Wallet"}
        <ChevronDown className="h-4 w-4" />
      </button>

      {/* Menu */}
      {open && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md border border-gray-200 bg-white shadow-md focus:outline-none"
        >
          {!isConnected ? (
            <div className="py-1">
              <button
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => connectWallet("MetaMask")}
              >
                MetaMask
              </button>
              <button
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => connectWallet("WalletConnect")}
              >
                WalletConnect
              </button>
              <button
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => connectWallet("Coinbase Wallet")}
              >
                Coinbase Wallet
              </button>
            </div>
          ) : (
            <div className="py-1">
              <button
                role="menuitem"
                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                onClick={disconnectWallet}
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
