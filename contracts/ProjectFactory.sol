// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Project.sol";

/// Deploys new projects
contract ProjectFactory {
    address public compliance;
    address public insurancePool;
    address[] public allProjects;

    event ProjectCreated(address project, address promoter);

    constructor(address _compliance, address _insurancePool) {
        compliance = _compliance;
        insurancePool = _insurancePool;
    }

    function createProject(
        string memory name,
        string memory symbol,
        uint256 area,
        uint256 req_amount,
        uint256 exp_return_amount,
        uint256 min_threshold,
        uint256 timeout
    ) external returns (address) {
        Project project = new Project(name, symbol, compliance, msg.sender, insurancePool, area, req_amount, exp_return_amount, min_threshold,timeout);
        allProjects.push(address(project));
        project.shareToken().approve(address(project), project.area());
        // insurancePool.registerProject(address(project));
        emit ProjectCreated(address(project), msg.sender);
        return address(project);
    }

    function getAllProjects() external view returns (address[] memory) {
        return allProjects;
    }
}

