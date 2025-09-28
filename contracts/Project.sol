// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenContract.sol";
import "./InsurancePool.sol";


contract Project {
  
    uint256 private constant DECIMALS = 1e18;
    uint256 public constant INSURANCE_BP = 500;


    ComplianceToken public immutable shareToken;
    InsurancePool public immutable insurancePool;

    address public immutable promoter;

    uint256 public immutable area;              
    uint256 public immutable req_amount;      
    uint256 public immutable exp_return_amount; 
    uint256 public immutable min_threshold;     
    uint256 public immutable timeout;           

    uint256 public immutable pricePerWholeToken; 
  
    uint256 public soldWholeTokens; 
    uint256 public totalRaised;     
    mapping(address => uint256) public investorWholeTokens; 

 
    event TokensPurchased(address indexed buyer, uint256 wholeTokens, uint256 paidWei, uint256 insuranceCut);
    event InsuranceClaimed(uint256 payoutWei);
    event RevenueWithdrawn(address indexed to, uint256 amountWei);

  
    constructor(
        string memory _name,
        string memory _symbol,
        address _promoter,
        address _insurancePool,
        uint256 _area,
        uint256 _req_amount,
        uint256 _exp_return_amount,
        uint256 _min_threshold,
        uint256 _timeout
    ) {
        require(_promoter != address(0), "Invalid promoter");
        require(_insurancePool != address(0), "Invalid insurance pool");
        require(_area > 0, "Area must be > 0");
        require(_req_amount > 0, "Req amount must be > 0");
        require(_req_amount % _area == 0, "req_amount must divide area exactly");

        promoter = _promoter;
        insurancePool = InsurancePool(payable(_insurancePool));

        area = _area;
        req_amount = _req_amount;
        exp_return_amount = _exp_return_amount;
        min_threshold = _min_threshold;
        timeout = _timeout;

        pricePerWholeToken = _req_amount / _area;

      
        shareToken = new ComplianceToken(_name, _symbol);

       
        shareToken.mint(address(this), _area * DECIMALS);
    }

  
    function totalTokens() public view returns (uint256) {
        return area;
    }

 
    function soldTokens() public view returns (uint256) {
        return soldWholeTokens;
    }

    function availableTokens() public view returns (uint256) {
   
        uint256 bal = shareToken.balanceOf(address(this));
        return bal / DECIMALS;
    }


    function tokenAddress() external view returns (address) {
        return address(shareToken);
    }


    function buyTokens(uint256 wholeTokens) external payable {
        require(wholeTokens > 0, "Zero token amount");
        require(availableTokens() >= wholeTokens, "Not enough available");

        uint256 cost = wholeTokens * pricePerWholeToken;
        require(msg.value == cost, "Incorrect ETH sent");

  
        soldWholeTokens += wholeTokens;
        totalRaised += msg.value;
        investorWholeTokens[msg.sender] += wholeTokens;


        shareToken.transfer(msg.sender, wholeTokens * DECIMALS);


        uint256 insuranceCut = (msg.value * INSURANCE_BP) / 10000;
        if (insuranceCut > 0) {
            insurancePool.contribute{value: insuranceCut}(address(this));
        }
        uint256 promoterProceeds = msg.value - insuranceCut;
        payable(promoter).transfer(promoterProceeds);

        emit TokensPurchased(msg.sender, wholeTokens, msg.value, insuranceCut);
    }


    function buyWithETH() external payable {
        require(msg.value > 0, "Zero ETH");
        require(msg.value % pricePerWholeToken == 0, "ETH not multiple of price");
        uint256 wholeTokens = msg.value / pricePerWholeToken;
        require(availableTokens() >= wholeTokens, "Not enough available");

        soldWholeTokens += wholeTokens;
        totalRaised += msg.value;
        investorWholeTokens[msg.sender] += wholeTokens;

        shareToken.transfer(msg.sender, wholeTokens * DECIMALS);

        uint256 insuranceCut = (msg.value * INSURANCE_BP) / 10000;
        if (insuranceCut > 0) {
            insurancePool.contribute{value: insuranceCut}(address(this));
        }
        uint256 promoterProceeds = msg.value - insuranceCut;
        payable(promoter).transfer(promoterProceeds);

        emit TokensPurchased(msg.sender, wholeTokens, msg.value, insuranceCut);
    }




    function claimInsurance(uint256 amountWei) external returns (uint256) {
        require(msg.sender == promoter, "Only promoter");
        uint256 payout = insurancePool.claim(address(this), amountWei);
        emit InsuranceClaimed(payout);
        return payout;
    }

  
    function withdrawRevenue(uint256 amountWei) external {
        require(msg.sender == promoter, "Only promoter");
        require(amountWei <= address(this).balance, "Insufficient balance");
        payable(promoter).transfer(amountWei);
        emit RevenueWithdrawn(promoter, amountWei);
    }
}
