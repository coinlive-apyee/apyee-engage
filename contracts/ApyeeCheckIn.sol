// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ApyeeCheckIn is Ownable {
    mapping(address => mapping(uint256 => bool)) private _checkIns;
    mapping(address => uint256) public userCheckInCount;
    uint256 public totalCheckIns;

    event CheckedIn(address indexed user, uint256 indexed day);

    constructor() Ownable(msg.sender) {}

    function checkIn() external {
        uint256 today = block.timestamp / 1 days;
        require(!_checkIns[msg.sender][today], "Already checked in today");

        _checkIns[msg.sender][today] = true;
        userCheckInCount[msg.sender]++;
        totalCheckIns++;

        emit CheckedIn(msg.sender, today);
    }

    function hasCheckedInToday(address user) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return _checkIns[user][today];
    }

    function hasCheckedIn(address user, uint256 day) external view returns (bool) {
        return _checkIns[user][day];
    }
}
