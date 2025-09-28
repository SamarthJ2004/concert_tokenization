// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract InsurancePool {
    address public owner;

 
    mapping(address => uint256) public contributions;


    mapping(address => uint256) public claims;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

 
    function contribute(address project) external payable {
        require(msg.value > 0, "Zero contribution");
        contributions[project] += msg.value;
    }


    function claim(address project, uint256 amount) external returns (uint256) {
        require(msg.sender == project, "Only project can claim");
        uint256 poolBalance = address(this).balance;

        uint256 payout = amount <= poolBalance ? amount : poolBalance;

        claims[project] += payout;

        payable(project).transfer(payout);
        return payout;
    }


    function emergencyWithdraw(address to, uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "Insufficient balance");
        payable(to).transfer(amount);
    }
}
