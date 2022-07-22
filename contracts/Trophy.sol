// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Ticket.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Trophies' contract
//
// Deployed to : 

// ----------------------------------------------------------------------------

contract BallTrophy is SafeMath {
    string public name;
    address public admin;

    mapping(address => uint) balances;
    mapping(address => bool) public gameAdmin;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address adminAddr) {
        name = "Moneyball Trophies";
        admin = adminAddr;
        gameAdmin[admin] = true;
    }


    // ------------------------------------------------------------------------
    // Get the trophy count for account trophyOwner
    // ------------------------------------------------------------------------
    function trophyCount(address trophyOwner) public view returns (uint balance) {
        return balances[trophyOwner];
    }

    // ------------------------------------------------------------------------
    // Award game trophies
    // Only game admin can invoke
    // ------------------------------------------------------------------------
    function awardGameTrophies(address earner, uint earnerTrophies, address loser, uint loserTrophies) public returns (bool success) {
        require(gameAdmin[msg.sender], "Only game admin can award.");
        balances[earner] = safeAdd(balances[earner], earnerTrophies);
        balances[loser] = safeSub(balances[loser], loserTrophies);
        return true;
    }

    
    // ------------------------------------------------------------------------
    // Award trophies
    // Only game admin can invoke
    // ------------------------------------------------------------------------
    function awardTrophies(address earner, uint earnerTrophies) public returns (bool success) {
        require(gameAdmin[msg.sender], "Only game admin can award.");
        balances[earner] = safeAdd(balances[earner], earnerTrophies);
        return true;
    }


    // ------------------------------------------------------------------------
    // Lose trophies
    // Only game admin can invoke
    // ------------------------------------------------------------------------
    function loseTrophies(address loser, uint loserTrophies) public returns (bool success) {
        require(gameAdmin[msg.sender], "Only game admin can award.");
        balances[loser] = safeSub(balances[loser], loserTrophies);
        return true;
    }
}