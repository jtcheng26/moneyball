// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Tickets' contract
//
// Deployed to : 

// ----------------------------------------------------------------------------


// ----------------------------------------------------------------------------
// Safe maths
// ----------------------------------------------------------------------------
contract SafeMath {
    function safeAdd(uint a, uint b) public pure returns (uint c) {
        c = a + b;
        require(c >= a);
    }
    function safeSub(uint a, uint b) public pure returns (uint c) {
        require(b <= a);
        c = a - b;
    }
    function safeMul(uint a, uint b) public pure returns (uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function safeDiv(uint a, uint b) public pure returns (uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract BallTicket is SafeMath {
    string public  name;
    address public admin;
    address public BTTadmin;
    address public BALLaddress;
    address public BTTaddress = 0xA0Fbd0cDDdE9fb2F91327f053448a0F3319552F7;
    uint public tixPriceBTT = 1; // BTT conversion price
    uint public tixPriceBALL = 500 * (10 ** 18); // BALL price

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => bool) public gameAdmin;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address adminMoney, address adminAddr, address tokenAddress) {
        name = "Moneyball Tickets";
        BALLaddress = tokenAddress;
        BTTadmin = adminMoney;
        admin = adminAddr;
        gameAdmin[admin] = true;
    }


    // ------------------------------------------------------------------------
    // Get the ticket balance for account tokenOwner
    // ------------------------------------------------------------------------
    function balanceOf(address ticketOwner) public view returns (uint balance) {
        return balances[ticketOwner];
    }


    // ------------------------------------------------------------------------
    // Spend tickets
    // Only game admin can invoke
    // ------------------------------------------------------------------------
    function spendTickets(address spender, uint tickets) public returns (bool success) {
        require(gameAdmin[msg.sender], "Only game admin can spend.");
        balances[spender] = safeSub(balances[spender], tickets);
        balances[admin] = safeAdd(balances[admin], tickets);
        return true;
    }

        // ------------------------------------------------------------------------
    // Refund tickets
    // Only game admin can invoke
    // ------------------------------------------------------------------------
    function earnTickets(address earner, uint tickets) public returns (bool success) {
        require(gameAdmin[msg.sender], "Only game admin can spend.");
        balances[earner] = safeAdd(balances[earner], tickets);
        return true;
    }

    // ------------------------------------------------------------------------
    // Buy tickets with native BTT
    //  Ideally for initial buy-in, but can be bought whenever
    //  Buying with game token is ideally more efficient
    // ------------------------------------------------------------------------
    function _sendBTT(address spender, uint256 value) internal {
        uint256 allowance = IERC20(BTTaddress).allowance(msg.sender, address(this));
        require(allowance >= value, "Check the token allowance");
        IERC20(BTTaddress).transferFrom(spender, BTTadmin, value);
    }

    function buyTicketsWithBTT(uint256 tickets) public {
       _sendBTT(msg.sender, tickets * tixPriceBTT);

       balances[msg.sender] = safeAdd(balances[msg.sender], tickets);
    }

    // ------------------------------------------------------------------------
    // Buy tickets with game token (BALL)
    //  BALL is earned by playing
    //  Ideally more efficient than fixed-price BTTC purchase
    // ------------------------------------------------------------------------
    function _sendBALL(address spender, uint256 value) internal {
        uint256 allowance = IERC20(BALLaddress).allowance(msg.sender, address(this));
        require(allowance >= value, "Check the token allowance");
        IERC20(BALLaddress).transferFrom(spender, BTTadmin, value);
    }

    function buyTicketsWithBALL(uint256 tickets) public {
       _sendBALL(msg.sender, tickets * tixPriceBALL);

       balances[msg.sender] = safeAdd(balances[msg.sender], tickets);
    }
}