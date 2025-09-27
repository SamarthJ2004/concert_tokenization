// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Minimal identity registry for ERC-3643.
/// Only whitelisted addresses can hold or transfer tokens.
contract IdentityRegistry {
    mapping(address => bool) public isVerified;
    address public owner;

    event IdentityRegistered(address indexed user);
    event IdentityRemoved(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerIdentity(address user) external onlyOwner {
        isVerified[user] = true;
        emit IdentityRegistered(user);
    }

    function removeIdentity(address user) external onlyOwner {
        isVerified[user] = false;
        emit IdentityRemoved(user);
    }
}
