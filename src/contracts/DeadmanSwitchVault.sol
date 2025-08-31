// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeadManSwitchVault is ReentrancyGuard, Ownable {
    
    struct WalletConfig {
        address walletAddress;
        uint256 checkInDeadline;
        uint256 gracePeriod;
        bool isActive;
        uint256 lastCheckIn;
    }
    
    struct Beneficiary {
        address beneficiaryAddress;
        uint256 sharePercentage; // Basis points (10000 = 100%)
        bool isActive;
    }
    
    struct UserVault {
        WalletConfig walletConfig;
        Beneficiary[] beneficiaries;
        mapping(address => uint256) beneficiaryIndex;
        uint256 totalBeneficiaryShares;
        bool fundsTransferred;
    }
    
    mapping(address => UserVault) public userVaults;
    mapping(address => bool) public registeredUsers;
    
    event VaultCreated(address indexed user, address walletAddress);
    event CheckInUpdated(address indexed user, uint256 timestamp);
    event BeneficiaryAdded(address indexed user, address beneficiary, uint256 share);
    event FundsTransferred(address indexed user, address beneficiary, uint256 amount);
    event VaultDeactivated(address indexed user);
    
    uint256 public constant MIN_GRACE_PERIOD = 1 days;
    uint256 public constant MAX_GRACE_PERIOD = 30 days;
    uint256 public constant BASIS_POINTS = 10000;
    
    constructor() {
        // Initialize contract
    }
    
    /**
     * @dev Create a new vault for a user
     * @param _walletAddress The wallet address to monitor
     * @param _checkInDeadline Initial check-in deadline
     * @param _gracePeriod Grace period after deadline
     */
    function createVault(
        address _walletAddress,
        uint256 _checkInDeadline,
        uint256 _gracePeriod
    ) external {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(_gracePeriod >= MIN_GRACE_PERIOD && _gracePeriod <= MAX_GRACE_PERIOD, "Invalid grace period");
        require(_checkInDeadline > block.timestamp, "Deadline must be in the future");
        require(!registeredUsers[msg.sender], "Vault already exists");
        
        UserVault storage vault = userVaults[msg.sender];
        vault.walletConfig = WalletConfig({
            walletAddress: _walletAddress,
            checkInDeadline: _checkInDeadline,
            gracePeriod: _gracePeriod,
            isActive: true,
            lastCheckIn: block.timestamp
        });
        
        registeredUsers[msg.sender] = true;
        
        emit VaultCreated(msg.sender, _walletAddress);
    }
    
    /**
     * @dev Add a beneficiary to receive funds
     * @param _beneficiaryAddress Address of the beneficiary
     * @param _sharePercentage Share percentage in basis points
     */
    function addBeneficiary(address _beneficiaryAddress, uint256 _sharePercentage) external {
        require(registeredUsers[msg.sender], "Vault not found");
        require(_beneficiaryAddress != address(0), "Invalid beneficiary address");
        require(_sharePercentage > 0 && _sharePercentage <= BASIS_POINTS, "Invalid share percentage");
        require(userVaults[msg.sender].beneficiaryIndex[_beneficiaryAddress] == 0, "Beneficiary already exists");
        
        UserVault storage vault = userVaults[msg.sender];
        
        // Check if adding this beneficiary would exceed 100%
        require(vault.totalBeneficiaryShares + _sharePercentage <= BASIS_POINTS, "Total shares exceed 100%");
        
        vault.beneficiaries.push(Beneficiary({
            beneficiaryAddress: _beneficiaryAddress,
            sharePercentage: _sharePercentage,
            isActive: true
        }));
        
        vault.beneficiaryIndex[_beneficiaryAddress] = vault.beneficiaries.length;
        vault.totalBeneficiaryShares += _sharePercentage;
        
        emit BeneficiaryAdded(msg.sender, _beneficiaryAddress, _sharePercentage);
    }
    
    /**
     * @dev Check in to extend the deadline
     */
    function checkIn() external {
        require(registeredUsers[msg.sender], "Vault not found");
        require(userVaults[msg.sender].walletConfig.isActive, "Vault not active");
        
        UserVault storage vault = userVaults[msg.sender];
        vault.walletConfig.lastCheckIn = block.timestamp;
        vault.walletConfig.checkInDeadline = block.timestamp + vault.walletConfig.gracePeriod;
        
        emit CheckInUpdated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Transfer funds to beneficiaries if deadline has passed
     * @param _user Address of the user whose funds should be transferred
     */
    function transferFundsIfDeadlinePassed(address _user) external nonReentrant {
        require(registeredUsers[_user], "Vault not found");
        
        UserVault storage vault = userVaults[_user];
        require(vault.walletConfig.isActive, "Vault not active");
        require(!vault.fundsTransferred, "Funds already transferred");
        require(block.timestamp > vault.walletConfig.checkInDeadline + vault.walletConfig.gracePeriod, "Deadline not passed");
        
        // Mark funds as transferred
        vault.fundsTransferred = true;
        
        // Get the wallet balance
        uint256 walletBalance = address(vault.walletConfig.walletAddress).balance;
        
        if (walletBalance > 0) {
            // Transfer ETH to beneficiaries
            for (uint i = 0; i < vault.beneficiaries.length; i++) {
                Beneficiary storage beneficiary = vault.beneficiaries[i];
                if (beneficiary.isActive && beneficiary.sharePercentage > 0) {
                    uint256 transferAmount = (walletBalance * beneficiary.sharePercentage) / BASIS_POINTS;
                    if (transferAmount > 0) {
                        (bool success, ) = beneficiary.beneficiaryAddress.call{value: transferAmount}("");
                        require(success, "Transfer failed");
                        emit FundsTransferred(_user, beneficiary.beneficiaryAddress, transferAmount);
                    }
                }
            }
        }
        
        // Deactivate the vault
        vault.walletConfig.isActive = false;
    }
    
    /**
     * @dev Transfer ERC20 tokens to beneficiaries
     * @param _user Address of the user
     * @param _tokenAddress ERC20 token address
     */
    function transferERC20IfDeadlinePassed(address _user, address _tokenAddress) external nonReentrant {
        require(registeredUsers[_user], "Vault not found");
        
        UserVault storage vault = userVaults[_user];
        require(vault.walletConfig.isActive, "Vault not active");
        require(!vault.fundsTransferred, "Funds already transferred");
        require(block.timestamp > vault.walletConfig.checkInDeadline + vault.walletConfig.gracePeriod, "Deadline not passed");
        
        IERC20 token = IERC20(_tokenAddress);
        uint256 tokenBalance = token.balanceOf(vault.walletConfig.walletAddress);
        
        if (tokenBalance > 0) {
            // Transfer tokens to beneficiaries
            for (uint i = 0; i < vault.beneficiaries.length; i++) {
                Beneficiary storage beneficiary = vault.beneficiaries[i];
                if (beneficiary.isActive && beneficiary.sharePercentage > 0) {
                    uint256 transferAmount = (tokenBalance * beneficiary.sharePercentage) / BASIS_POINTS;
                    if (transferAmount > 0) {
                        require(token.transferFrom(vault.walletConfig.walletAddress, beneficiary.beneficiaryAddress, transferAmount), "Token transfer failed");
                        emit FundsTransferred(_user, beneficiary.beneficiaryAddress, transferAmount);
                    }
                }
            }
        }
    }
    
    /**
     * @dev Deactivate a vault (only by owner)
     * @param _user Address of the user
     */
    function deactivateVault(address _user) external onlyOwner {
        require(registeredUsers[_user], "Vault not found");
        
        UserVault storage vault = userVaults[_user];
        vault.walletConfig.isActive = false;
        
        emit VaultDeactivated(_user);
    }
    
    /**
     * @dev Get vault information
     * @param _user Address of the user
     */
    function getVaultInfo(address _user) external view returns (
        address walletAddress,
        uint256 checkInDeadline,
        uint256 gracePeriod,
        bool isActive,
        uint256 lastCheckIn,
        uint256 beneficiaryCount,
        bool fundsTransferred
    ) {
        require(registeredUsers[_user], "Vault not found");
        
        UserVault storage vault = userVaults[_user];
        return (
            vault.walletConfig.walletAddress,
            vault.walletConfig.checkInDeadline,
            vault.walletConfig.gracePeriod,
            vault.walletConfig.isActive,
            vault.walletConfig.lastCheckIn,
            vault.beneficiaries.length,
            vault.fundsTransferred
        );
    }
    
    /**
     * @dev Get beneficiary information
     * @param _user Address of the user
     * @param _index Index of the beneficiary
     */
    function getBeneficiary(address _user, uint256 _index) external view returns (
        address beneficiaryAddress,
        uint256 sharePercentage,
        bool isActive
    ) {
        require(registeredUsers[_user], "Vault not found");
        require(_index < userVaults[_user].beneficiaries.length, "Invalid index");
        
        Beneficiary storage beneficiary = userVaults[_user].beneficiaries[_index];
        return (
            beneficiary.beneficiaryAddress,
            beneficiary.sharePercentage,
            beneficiary.isActive
        );
    }
    
    /**
     * @dev Check if deadline has passed for a user
     * @param _user Address of the user
     */
    function isDeadlinePassed(address _user) external view returns (bool) {
        require(registeredUsers[_user], "Vault not found");
        
        UserVault storage vault = userVaults[_user];
        return block.timestamp > vault.walletConfig.checkInDeadline + vault.walletConfig.gracePeriod;
    }
    
    /**
     * @dev Emergency function to recover stuck funds (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance > 0) {
            (bool success, ) = owner().call{value: balance}("");
            require(success, "Emergency withdrawal failed");
        }
    }
    
    // Allow contract to receive ETH
    receive() external payable {}
}