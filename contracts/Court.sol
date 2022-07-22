// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Token.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Court' contract
//
// Deployed to : 

// ----------------------------------------------------------------------------


contract BallCourt {

    address public BALLadmin;
    address public admin;
    address public BALLaddress = 0x81ec4f121DBffa04729C03f2C81E7b54883c109B;
    mapping(address => bool) public gameAdmin;
    mapping(uint256 => mapping(uint256 => address)) public owner; // LAT, LONG
    uint256 public landPrice = 1000 * (10 ** 18);

    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address moneyAdmin, address adminAddr, address tokenAddress) {
        BALLadmin = moneyAdmin;
        BALLaddress = tokenAddress;
        admin = adminAddr;
        gameAdmin[admin] = true;
    }

    function _sendBALL(address spender, uint256 value) internal {
        uint256 allowance = BallToken(BALLaddress).allowance(spender, address(this));
        require(allowance >= value, "Check the token allowance");
        BallToken(BALLaddress).transferFrom(spender, BALLadmin, value);
    }

    // initialize court
    function create(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        _sendBALL(user, landPrice);
        owner[lat][long] = user;
        // other attributes
    }

    function setOwner(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        owner[lat][long] = user;
    }

}