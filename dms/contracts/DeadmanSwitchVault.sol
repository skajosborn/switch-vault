// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * Owner deposits ETH -> must call checkIn() before (lastCheckIn + frequency + grace).
 * If time expires, anyone (incl. Automation) can performUpkeep() to distribute funds.
 * Beneficiaries split in basis points (sum to 10000).
 */
contract DeadmanSwitchVault is AutomationCompatibleInterface, Ownable, ReentrancyGuard {
    struct Beneficiary { address account; uint96 bps; } // 1% = 100 bps

    uint256 public frequencySec;   // e.g., 7d / 30d / 182d
    uint256 public graceSec;       // cushion, e.g., 72h
    uint256 public lastCheckIn;    // unix time of last check-in
    bool    public executed;       // set true once funds disbursed forever

    Beneficiary[] public beneficiaries;

    event CheckedIn(address indexed owner, uint256 timestamp, uint256 nextDeadline);
    event ScheduleUpdated(uint256 frequencySec, uint256 graceSec);
    event BeneficiariesUpdated(Beneficiary[] newList);
    event Deposited(address indexed from, uint256 amount);
    event Disbursed(uint256 total, uint256 when);
    event CancelledByOwner(uint256 refunded, uint256 when);

    constructor(
        address _owner,
        uint256 _frequencySec,
        uint256 _graceSec,
        Beneficiary[] memory _beneficiaries
    ) Ownable(_owner) {
        require(_frequencySec > 0, "frequency=0");
        _setBeneficiaries(_beneficiaries);
        frequencySec = _frequencySec;
        graceSec = _graceSec;
        lastCheckIn = block.timestamp;
    }

    // fund vault
    receive() external payable { emit Deposited(msg.sender, msg.value); }
    function deposit() external payable { require(msg.value > 0, "no value"); emit Deposited(msg.sender, msg.value); }

    // owner ops
    function checkIn() external onlyOwner {
        require(!executed, "executed");
        lastCheckIn = block.timestamp;
        emit CheckedIn(msg.sender, block.timestamp, nextDeadline());
    }

    function updateSchedule(uint256 _frequencySec, uint256 _graceSec) external onlyOwner {
        require(!executed, "executed");
        require(_frequencySec > 0, "frequency=0");
        frequencySec = _frequencySec;
        graceSec = _graceSec;
        emit ScheduleUpdated(_frequencySec, _graceSec);
    }

    function setBeneficiaries(Beneficiary[] calldata list) external onlyOwner {
        require(!executed, "executed");
        _setBeneficiaries(list);
        emit BeneficiariesUpdated(list);
    }

    function cancelAndRefundOwner() external onlyOwner nonReentrant {
        require(!executed, "executed");
        require(!_expired(), "past deadline");
        executed = true;
        uint256 bal = address(this).balance;
        if (bal > 0) {
            (bool ok, ) = owner().call{value: bal}("");
            require(ok, "refund failed");
        }
        emit CancelledByOwner(bal, block.timestamp);
    }

    // views
    function beneficiariesLength() external view returns (uint256) { return beneficiaries.length; }
    function nextDeadline() public view returns (uint256) { return lastCheckIn + frequencySec + graceSec; }
    function expired() external view returns (bool) { return _expired(); }

    // automation interface
    function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
        upkeepNeeded = _expired() && !executed && address(this).balance > 0;
        return (upkeepNeeded, bytes(""));
    }

    function performUpkeep(bytes calldata) external override nonReentrant {
        require(_expired(), "not expired");
        require(!executed, "executed");
        executed = true;

        uint256 bal = address(this).balance;
        if (bal == 0) { emit Disbursed(0, block.timestamp); return; }

        uint256 remaining = bal;
        for (uint256 i = 0; i < beneficiaries.length; i++) {
            uint256 amount = (i == beneficiaries.length - 1) ? remaining : (bal * beneficiaries[i].bps) / 10_000;
            if (amount > 0) {
                remaining -= amount;
                (bool ok, ) = beneficiaries[i].account.call{value: amount}("");
                require(ok, "payout failed");
            }
        }
        emit Disbursed(bal, block.timestamp);
    }

    // internals
    function _expired() internal view returns (bool) {
        if (executed) return false;
        return block.timestamp >= nextDeadline();
    }

    function _setBeneficiaries(Beneficiary[] memory list) internal {
        delete beneficiaries;
        uint256 total;
        for (uint256 i = 0; i < list.length; i++) {
            require(list[i].account != address(0), "zero addr");
            require(list[i].bps > 0, "bps=0");
            beneficiaries.push(list[i]);
            total += list[i].bps;
        }
        require(total == 10_000, "total bps != 10000");
    }
}