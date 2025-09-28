# 🎟️ Token2025: Decentralized Event Financing & RWA Tokenization

**Token2025 is a next-generation platform for tokenizing and trading real-world assets, starting with live event financing. Built on Integra (an EVM-compatible chain for RWAs), Token2025 leverages ERC-3643 for compliance and ENS-powered identity to make investing secure, user-friendly, and transparent.**

We empower promoters to tokenize the future revenue of concerts and sports seasons, allowing verified investors anywhere in the world to buy a stake in their success.

---

## 🏆 The Problem

Financing for live events is a **multi-billion dollar industry**, but:

* Locked behind **institutional capital**.
* Riddled with **middlemen & opaque terms**.
* Illiquid and **inaccessible to everyday investors**.

---

## 💡 The Solution

Token2025 replaces intermediaries with **autonomous smart contracts**, creating a direct bridge between creators and communities.

* Promoters launch **compliant fundraising campaigns**.
* Investors buy **tokenized revenue shares**.
* A shared **insurance pool** mitigates risk.
* Identity is enforced via **ENS-based profiles + verifiable credentials**.

---

## 🔄 How It Works: Event Lifecycle

1. **Promoter Onboarding (Self-Identity)**

   * Promoter connects via wallet.
   * Provides **Verifiable Credentials (VCs)** (e.g., KYC, track record).
   * Mapped to an ENS subdomain: `promoter.token2025.eth`.

2. **Launch Campaign (ERC-3643)**

   * Promoter deploys a `Project` contract via `ProjectFactory`.
   * A new **ComplianceToken (ERC-3643 variant)** is minted, e.g., `ConcertToken (CRT)`.
   * Token compliance checks `IdentityRegistry` to ensure only **KYC-verified wallets** can invest.

3. **Shared Safety Net (Insurance Pool)**

   * A % of the raise is automatically contributed to `InsurancePool`.
   * Protects investors in case of **event cancellation or loss**.

4. **Event Outcome**

   * **Profit case**: Promoter submits revenue → funds distributed proportionally to token holders.
   * **Loss case**: Insurance pool pays out compensation (e.g., 50% of raised amount) to investors.

---

## 🧩 System Architecture

### Contracts

* **IdentityRegistry.sol** → ERC-3643-inspired compliance. Registers & verifies investors.
* **ComplianceToken.sol** → ERC20-like token with compliance checks. Each event gets its own.
* **InsurancePool.sol** → Shared risk pool; holds premiums and pays out losses.
* **Project.sol** → Event-specific contract. Handles fundraising, payouts, profit/loss logic.
* **ProjectFactory.sol** → Deploys new projects and their associated tokens.

### Tokenization Flow

* Each **event = new ERC-3643 token (ComplianceToken)**.
* **Promoter initially receives all tokens** but contract auto-approves itself.
* Revenue or insurance payouts flow back proportionally to CRT holders.

---

## ✨ Core Features

* **ERC-3643 Compliance Engine** → Permissioned transfers, only verified wallets can invest.
* **ENS-Powered Identity** → Each verified user gets a subdomain (e.g., `alice.token2025.eth`).
* **Dynamic Profiles** → Users manage ENS text records (KYC, accreditation, etc.).
* **Insurance Pool** → Built-in safety net for investor confidence.

---

## 💻 Technology Stack

* **Smart Contracts**: Solidity, OpenZeppelin, ERC-3643, Integra L2
* **Identity**: ENS subdomains + Verifiable Credentials
* **Frontend**: Next.js, Ethers.js

---

## 🔗 Example Flow (Concert Financing)

1. Promoter creates `Concert Project`.
2. 100 shares minted (CRT).
3. Investors commit → receive 1 CRT.
4. Event ends →

   * If **profit**: revenue → distributed to CRT holders.
   * If **loss**: InsurancePool distributes partial refund.
  
<img width="8045" height="7663" alt="flowchart" src="https://github.com/user-attachments/assets/23ee288c-c626-4bb2-9ea5-193bf71cf728" />


---

## 🚀 Future Extensions

* Extension to Crop market and Rent market
* Secondary market for CRT tokens (DEX + compliance).
* NFT tickets linked with fractional ownership.
* Cross-chain RWA registry (events, real estate, etc.).
* DAO-governed insurance pools.
