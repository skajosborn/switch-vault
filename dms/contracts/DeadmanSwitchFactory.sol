// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./DeadmanSwitchVault.sol";

contract DeadmanSwitchFactory {
    event VaultCreated(address indexed vault, address indexed owner, uint256 frequency, uint256 grace);
    
    function createVault(
        uint256 _frequencySec,
        uint256 _graceSec,
        DeadmanSwitchVault.Beneficiary[] calldata _beneficiaries
    ) external payable returns (address) {
        DeadmanSwitchVault vault = new DeadmanSwitchVault(
            msg.sender,
            _frequencySec,
            _graceSec,
            _beneficiaries
        );
        
        // Transfer any ETH sent with the transaction to the new vault
        if (msg.value > 0) {
            (bool success, ) = address(vault).call{value: msg.value}("");
            require(success, "Failed to transfer ETH to vault");
        }
        
        emit VaultCreated(address(vault), msg.sender, _frequencySec, _graceSec);
        return address(vault);
    }
}
