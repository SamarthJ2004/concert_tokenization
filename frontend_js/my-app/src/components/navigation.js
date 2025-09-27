"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

// ⚠️ Replace with your deployed IdentityRegistry address
const IDENTITY_REGISTRY_ADDRESS = "0x5084Dde399164592E96E6cF6306897DaddFC671D";

// Minimal ABI for IdentityRegistry
const IDENTITY_REGISTRY_ABI = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "IdentityRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
    ],
    name: "IdentityRemoved",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "registerIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "removeIdentity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

export function Navigation() {
  const [account, setAccount] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [verified, setVerified] = useState(null);

  useEffect(() => {
    const eth = typeof window !== "undefined" ? window.ethereum : null;
    if (!eth) return;

    eth
      .request({ method: "eth_accounts" })
      .then((accs) => {
        if (accs && accs.length > 0) {
          setAccount(accs[0]);
          checkVerified(accs[0]).catch(() => {});
        }
      })
      .catch(() => {});

    const onAccountsChanged = (accs) => {
      const a = accs?.[0] ?? null;
      setAccount(a);
      if (a) checkVerified(a).catch(() => setVerified(null));
      else setVerified(null);
    };

    eth.on?.("accountsChanged", onAccountsChanged);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
    };
  }, []);

  async function checkVerified(addr) {
    const eth = typeof window !== "undefined" ? window.ethereum : null;
    if (!eth) return;
    const provider = new ethers.BrowserProvider(eth);
    const reg = new ethers.Contract(
      IDENTITY_REGISTRY_ADDRESS,
      IDENTITY_REGISTRY_ABI,
      provider
    );
    try {
      const v = await reg.isVerified(addr);
      setVerified(!!v);
    } catch {
      setVerified(null);
    }
  }

  async function connectAndRegister() {
    try {
      setConnecting(true);
      const eth = typeof window !== "undefined" ? window.ethereum : null;
      if (!eth) throw new Error("MetaMask not found");

      const provider = new ethers.BrowserProvider(eth);
      const accs = await eth.request({ method: "eth_requestAccounts" });
      const selected = accs[0];
      setAccount(selected);

      const signer = await provider.getSigner();
      const registry = new ethers.Contract(
        IDENTITY_REGISTRY_ADDRESS,
        IDENTITY_REGISTRY_ABI,
        signer
      );

      const tx = await registry.registerIdentity(selected);
      await tx.wait();

      await checkVerified(selected);
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setAccount(null);
    setVerified(null);
  }

  const short = (a) => `${a.slice(0, 6)}…${a.slice(-4)}`;

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-foreground">
              RWA<span className="text-accent">Chain</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/marketplace"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Marketplace
              </Link>
              <Link
                href="/assets"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                My Assets
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* MetaMask connect/register + disconnect */}
          <div className="flex items-center gap-2">
            {account ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {short(account)}
                </span>

                {verified === true && (
                  <span className="text-xs px-2 py-1 rounded-full border border-green-600/30 bg-green-600/10">
                    Verified
                  </span>
                )}
                {verified === false && (
                  <span className="text-xs px-2 py-1 rounded-full border border-yellow-600/30 bg-yellow-600/10">
                    Not Verified
                  </span>
                )}
                {verified === null && (
                  <span className="text-xs px-2 py-1 rounded-full border border-gray-600/30 bg-gray-600/10">
                    Unknown
                  </span>
                )}

                <button
                  onClick={disconnectWallet}
                  className="px-3 py-2 rounded-md border border-border hover:bg-red-600/10 hover:text-red-600 transition-colors text-sm"
                >
                  Disconnect
                </button>
              </div>
            ) : null}

            {!account && (
              <button
                onClick={connectAndRegister}
                disabled={connecting}
                className="px-3 py-2 rounded-md border border-border hover:bg-accent/10 transition-colors text-sm"
              >
                {connecting ? "Connecting…" : "Connect MetaMask"}
              </button>
            )}

            {account && verified === false && (
              <button
                onClick={connectAndRegister}
                disabled={connecting}
                className="px-3 py-2 rounded-md border border-border hover:bg-accent/10 transition-colors text-sm"
              >
                {connecting ? "Registering…" : "Register Identity"}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
