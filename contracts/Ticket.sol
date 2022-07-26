// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Tickets' contract
//
// Deployed to: 0x3df3D38806778422b39b49ef8E5D2CDC47C3334B
// Deployed on ETH Goerli Testnet using the mapped BTT asset because Metamask mobile has issues with custom RPC providers.
// Other actual game contracts are deployed on BTTC.
// Tickets are verified server-side for the time being until Metamask fixes their problem.
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
    address public BTTaddress = 0xA0Fbd0cDDdE9fb2F91327f053448a0F3319552F7;
    uint public tixPriceBTT = 10 * (10 ** 18); // BTT conversion price

    mapping(address => uint) balances;
    mapping(address => mapping(address => uint)) allowed;
    mapping(address => bool) public gameAdmin;


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor(address adminMoney) {
        name = "Moneyball Tickets";
        BTTadmin = adminMoney;
        admin = adminMoney;
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
}