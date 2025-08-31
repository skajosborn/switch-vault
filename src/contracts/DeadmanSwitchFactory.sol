// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeadManSwitchVault.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeadManSwitchFactory is Ownable {
    
    struct VaultInfo {
        address vaultAddress;
        address user;
        address walletAddress;
        uint256 createdAt;
        bool isActive;
    }
    
    mapping(address => VaultInfo) public userVaults;
    mapping(address => bool) public deployedVaults;
    
    event VaultDeployed(address indexed user, address vaultAddress, address walletAddress);
    event VaultRemoved(address indexed user, address vaultAddress);
    
    constructor() {
        // Initialize factory
    }
    
    /**
     * @dev Deploy a new vault for a user
     * @param _walletAddress The wallet address to monitor
     * @param _checkInDeadline Initial check-in deadline
     * @param _gracePeriod Grace period after deadline
     */
    function deployVault(
        address _walletAddress,
        uint256 _checkInDeadline,
        uint256 _gracePeriod
    ) external returns (address) {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(!deployedVaults[msg.sender], "Vault already deployed");
        
        // Deploy new vault contract
        DeadManSwitchVault vault = new DeadManSwitchVault();
        
        // Initialize the vault
        vault.createVault(_walletAddress, _checkInDeadline, _gracePeriod);
        
        // Transfer ownership to the user
        vault.transferOwnership(msg.sender);
        
        // Store vault information
        userVaults[msg.sender] = VaultInfo({
            vaultAddress: address(vault),
            user: msg.sender,
            walletAddress: _walletAddress,
            createdAt: block.timestamp,
            isActive: true
        });
        
        deployedVaults[msg.sender] = true;
        
        emit VaultDeployed(msg.sender, address(vault), _walletAddress);
        
        return address(vault);
    }
    
    /**
     * @dev Get vault address for a user
     * @param _user Address of the user
     */
    function getVaultAddress(address _user) external view returns (address) {
        require(deployedVaults[_user], "Vault not found");
        return userVaults[_user].vaultAddress;
    }
    
    /**
     * @dev Remove a vault (only by owner)
     * @param _user Address of the user
     */
    function removeVault(address _user) external onlyOwner {
        require(deployedVaults[_user], "Vault not found");
        
        VaultInfo storage vaultInfo = userVaults[_user];
        vaultInfo.isActive = false;
        deployedVaults[_user] = false;
        
        emit VaultRemoved(_user, vaultInfo.vaultAddress);
    }
    
    /**
     * @dev Check if user has a deployed vault
     * @param _user Address of the user
     */
    function hasVault(address _user) external view returns (bool) {
        return deployedVaults[_user];
    }
    
    /**
     * @dev Get vault information
     * @param _user Address of the user
     */
    function getVaultInfo(address _user) external view returns (
        address vaultAddress,
        address walletAddress,
        uint256 createdAt,
        bool isActive
    ) {
        require(deployedVaults[_user], "Vault not found");
        
        VaultInfo storage vaultInfo = userVaults[_user];
        return (
            vaultInfo.vaultAddress,
            vaultInfo.walletAddress,
            vaultInfo.createdAt,
            vaultInfo.isActive
        );
    }
}

