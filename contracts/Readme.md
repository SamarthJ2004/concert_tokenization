This repo contains the core smart contracts powering **Token2025**, a decentralized platform for financing real-world events using **ERC-3643-compliant tokens**.

---

## 📂 Contracts Overview

### 1. **IdentityRegistry.sol**

* Minimal ERC-3643-style identity system.
* Keeps track of verified (KYC/AML-approved) addresses.
* Only verified addresses can hold or transfer tokens.

**Key Functions:**

* `registerIdentity(address user)` → Whitelists a wallet.
* `removeIdentity(address user)` → Removes verification.
* `isVerified[user]` → Public mapping for compliance checks.

---

### 2. **ComplianceToken.sol**

* ERC20-compatible token extended with compliance checks.
* Every project creates its own instance.
* Only `isVerified` wallets can receive tokens.

**Key Functions:**

* `mint(address to, uint256 amount)` → Mints tokens to verified addresses.
* `transfer(from, to, amount)` → Transfers only if both addresses are verified.
* `approve/spend` → Standard ERC20 flow.

---

### 3. **InsurancePool.sol**

* Shared liquidity pool for **risk mitigation**.
* Receives a % of each project’s raise.
* Can payout to investors in case of **loss scenario**.

**Key Functions:**

* `contribute()` → Projects deposit a cut (e.g., 5%).
* `payout(address to, uint256 amount)` → Sends funds to investors.
* `getBalance()` → Returns pool reserves.

---

### 4. **Project.sol**

* Represents a **single event or concert**.
* Handles fundraising, token distribution, and revenue sharing.
* Integrates with `ComplianceToken` and `InsurancePool`.

**Key Logic:**

1. **Initialization**:

   * Deploys new `ComplianceToken` for the event.
   * Mints all tokens to promoter.
   * Approves contract to move tokens.

2. **Investment**:

   * Investors deposit ETH.
   * Price per token = `req_amount / area`.
   * Tokens transferred from promoter → investors.

3. **Funding Close**:

   * Promoter closes raise.
   * Sends insurance cut to `InsurancePool`.
   * Withdraws net funds.

4. **Revenue Distribution**:

   * **Profit**: Promoter deposits final revenue. Funds distributed pro-rata to token holders.
   * **Loss**: Contract calls `InsurancePool` to distribute refunds.

---

### 5. **ProjectFactory.sol**

* Deploys new projects and manages registry of events.
* Ensures **standardized deployment flow**.
* Promoter interacts only with `ProjectFactory`, not bare contracts.

**Key Functions:**

* `createProject(name, symbol, area, req_amount, exp_return, min_threshold, timeout)` → Deploys new `Project`.
* Stores reference in `projects[]`.

---

## 🔄 Contract Interaction Flow

<img width="1202" height="458" alt="image" src="https://github.com/user-attachments/assets/f33b66ce-43d9-456d-bb24-32d156c54f4b" />


---

## 🧪 Testing Flow (MVP with Hardhat/Foundry)

1. **Setup**

   * Deploy `IdentityRegistry`, `InsurancePool`, and `ProjectFactory`.
   * Register promoter + investors in `IdentityRegistry`.

2. **Create Event**

   * Promoter calls `createProject(...)`.
   * Check promoter received all tokens.

3. **Investment**

   * Investor sends ETH → receives proportional tokens.
   * Verify balances updated.

4. **Close Funding**

   * Promoter calls `closeFunding()`.
   * InsurancePool receives contribution.
   * Promoter withdraws net raise.

5. **Profit Case**

   * Promoter calls `depositRevenue(>req_amount)`.
   * Investors receive pro-rata revenue distribution.

6. **Loss Case**

   * Promoter calls `declareLoss()`.
   * InsurancePool pays out partial refunds.
