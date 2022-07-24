// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Court' contract
//
// Deployed to : 

// ----------------------------------------------------------------------------


contract BallCourt {

    address public BTTadmin; // for dev purposes, will switch to game contract in prod
    address public admin;
    address public BTTaddress = 0xA0Fbd0cDDdE9fb2F91327f053448a0F3319552F7;
    mapping(address => bool) public gameAdmin;
    mapping(uint256 => mapping(uint256 => address)) public owner; // LAT, LONG
    uint256 public landPrice = 1000 * (10 ** 18);

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address moneyAdmin, address adminAddr) {
        BALLadmin = moneyAdmin;
        admin = adminAddr;
        gameAdmin[admin] = true;
    }

    function _sendBTT(address spender, uint256 value) internal {
        uint256 allowance = IERC20(BTTaddress).allowance(spender, address(this));
        require(allowance >= value, "Check the token allowance");
        IERC20(BTTaddress).transferFrom(spender, BTTadmin, value);
    }

    // initialize court
    function create(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        _sendBTT(user, landPrice);
        owner[lat][long] = user;
        // other attributes
    }

    function setOwner(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        owner[lat][long] = user;
    }

}