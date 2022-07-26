// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Courts' contract
//
// Deployed to: 0x0E52ad42C5674029425D0f923D5d82dd51Fff66C
// Deployed on BTTC Testnet Donau
// ----------------------------------------------------------------------------


contract BallCourt {

    address public BTTadmin; // for dev purposes, will switch to game contract in prod
    address public admin;
    mapping(address => bool) public gameAdmin;
    mapping(uint256 => mapping(uint256 => address)) public owner; // LAT, LONG
    mapping(uint256 => mapping(uint256 => string)) public name;
    mapping(uint256 => mapping(uint256 => string)) public image;
    uint256 public landPrice = 1000 * (10 ** 18);

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address moneyAdmin, address adminAddr) {
        BTTadmin = moneyAdmin;
        admin = adminAddr;
        gameAdmin[admin] = true;
    }

    // initialize court
    function create(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        owner[lat][long] = user;
        // other attributes
    }

    function setOwner(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        owner[lat][long] = user;
    }

}
