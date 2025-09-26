// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityRegistry.sol";

/// @notice Minimal compliance contract for ERC-3643.
/// Delegates permission checks to IdentityRegistry.
contract Compliance {
    IdentityRegistry public identityRegistry;
    address public owner;

    constructor(address _identityRegistry) {
        identityRegistry = IdentityRegistry(_identityRegistry);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function isAllowedTransfer(address from, address to) external view returns (bool) {
        if (from != address(0) && !identityRegistry.isVerified(from)) return false;
        if (to != address(0) && !identityRegistry.isVerified(to)) return false;
        return true;
    }
}
