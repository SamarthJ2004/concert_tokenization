// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Project.sol";


contract ProjectFactory {
    address public immutable insurancePool;
    address[] public allProjects;

    event ProjectCreated(address indexed project, address indexed promoter, address token);

    constructor(address _insurancePool) {
        require(_insurancePool != address(0), "Invalid pool");
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
    ) external returns (address projectAddr, address tokenAddr) {
        Project project = new Project(
            name,
            symbol,
            msg.sender,       // promoter
            insurancePool,
            area,
            req_amount,
            exp_return_amount,
            min_threshold,
            timeout
        );
        allProjects.push(address(project));

        emit ProjectCreated(address(project), msg.sender, project.tokenAddress());
        return (address(project), project.tokenAddress());
    }

    function getAllProjects() external view returns (address[] memory) {
        return allProjects;
    }
}
