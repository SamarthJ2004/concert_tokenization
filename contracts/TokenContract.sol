// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Compliance.sol";

/// @notice Minimal ERC-3643 style token.
/// Transfers restricted via Compliance rules.
contract ComplianceToken is ERC20 {
    Compliance public compliance;
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        address compliance_
    ) ERC20(name_, symbol_) {
        owner = msg.sender;
        compliance = Compliance(compliance_);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(compliance.isAllowedTransfer(address(0), to), "Receiver not compliant");
        _mint(to, amount);
    }

    modifier _beforeTokenTransfer(
        address from,
        address to
    ) {
        require(compliance.isAllowedTransfer(from, to), "Transfer not compliant");
       _;

    }

    function transfer(address to, uint256 value) public _beforeTokenTransfer(msg.sender,to) override returns (bool) {
        owner = _msgSender();
        _transfer(owner, to, value);
        return true;
    }


}
