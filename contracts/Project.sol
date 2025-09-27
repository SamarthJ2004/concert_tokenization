// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenContract.sol";
import "./InsurancePool.sol";

/// Project = tokenized event
contract Project {
    ComplianceToken public shareToken;
    InsurancePool public insurancePool;

    address public promoter;
    bool public fundingClosed;
    bool public revenueDistributed;

    uint256 public totalRaised;
    uint256 public area;
    uint256 public req_amount;
    uint256 public exp_return_amount;
    uint256 public min_threshold;
    uint256 public timeout;

    uint256 public constant INSURANCE_BP = 500; // 5% fee

    mapping(address => uint256) public investorBalances;
    address[] public investors;

    constructor(
        string memory _name,
        string memory _symbol,
        address compliance,
        address _promoter,
        address _insurancePool,
        uint256 _area,
        uint256 _req_amount,
        uint256 _exp_return_amount,
        uint256 _min_threshold,
        uint256 _timeout
    ) {
        promoter = _promoter;
        shareToken = new ComplianceToken(_name, _symbol, compliance);
        insurancePool = InsurancePool(payable(_insurancePool));
        area = _area;
        req_amount = _req_amount;
        exp_return_amount = _exp_return_amount;
        min_threshold = _min_threshold;
        timeout = _timeout;

        // promoter gets all tokens initially
        shareToken.mint(promoter, area);
    }

    modifier onlyPromoter() {
        require(msg.sender == promoter, "Not promoter");
        _;
    }

    // investors send ETH
    function invest() external payable {
        require(!fundingClosed, "Funding closed");
        require(msg.value > 0, "Zero investment");

        uint256 pricePerToken = req_amount / area;
        uint256 tokensToSend = msg.value / pricePerToken;
        require(tokensToSend > 0, "Not enough for 1 token");

        totalRaised += msg.value;
        if (investorBalances[msg.sender] == 0) {
            investors.push(msg.sender);
        }
        investorBalances[msg.sender] += msg.value;

        // transfer tokens from promoter to investor
        shareToken.transferFrom(promoter, msg.sender, tokensToSend);
    }

    // promoter closes fundraising and contributes to pool
    function closeFunding() external onlyPromoter {
        require(!fundingClosed, "Already closed");
        fundingClosed = true;

        uint256 insuranceCut = (totalRaised * INSURANCE_BP) / 10000;

        // contribute to insurance pool
        insurancePool.contribute{value: insuranceCut}(address(this));

        // promoter withdraws remaining
        uint256 promoterAmount = totalRaised - insuranceCut;
        payable(promoter).transfer(promoterAmount);
    }

    // simulate revenue distribution in PROFIT case
    function distributeProfit(uint256 revenue) external onlyPromoter {
        require(fundingClosed, "Funding not closed");
        require(!revenueDistributed, "Already distributed");
        revenueDistributed = true;

        // distribute based on tokens held
        for (uint256 i = 0; i < investors.length; i++) {
            address inv = investors[i];
            uint256 balance = shareToken.balanceOf(inv);
            if (balance > 0) {
                uint256 share = (revenue * balance) / area;
                payable(inv).transfer(share);
            }
        }
    }

    // simulate LOSS case: claim insurance to cover part of principal
    function distributeLoss(uint256 lossAmount) external onlyPromoter {
        require(fundingClosed, "Funding not closed");
        require(!revenueDistributed, "Already distributed");
        revenueDistributed = true;

        // claim from pool (say promoter requests 50% of loss)
        uint256 payout = insurancePool.claim(address(this), lossAmount);

        // distribute insurance payout to investors pro-rata by invested amount
        for (uint256 i = 0; i < investors.length; i++) {
            address inv = investors[i];
            uint256 invested = investorBalances[inv];
            if (invested > 0) {
                uint256 share = (payout * invested) / totalRaised;
                payable(inv).transfer(share);
            }
        }
    }
}

