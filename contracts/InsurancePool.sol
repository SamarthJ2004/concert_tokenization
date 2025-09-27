// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// Shared insurance pool used by multiple projects
contract InsurancePool {
    address public owner;

    // Track how much each project has contributed
    mapping(address => uint256) public contributions;

    // Track how much a project has claimed already
    mapping(address => uint256) public claims;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    /// project contributes a fee to pool
    function contribute(address project) external payable {
        require(msg.value > 0, "Zero contribution");
        contributions[project] += msg.value;
    }

    /// project requests payout for its investors
    function claim(address project, uint256 amount) external returns (uint256) {
        require(msg.sender == project, "Only project can claim");
        uint256 poolBalance = address(this).balance;

        // cannot claim more than pool has
        uint256 payout = amount <= poolBalance ? amount : poolBalance;

        // update accounting
        claims[project] += payout;

        // send to project for further distribution
        payable(project).transfer(payout);

        return payout;
    }

    /// emergency withdrawal (only owner)
    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(to).transfer(amount);
    }
}

