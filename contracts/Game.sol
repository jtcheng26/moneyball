// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./Token.sol";
import "./Ticket.sol";
import "./Trophy.sol";
import "./Court.sol";

// ----------------------------------------------------------------------------
// 'Moneyball Tickets' contract
//
// Deployed to : 

// ----------------------------------------------------------------------------

struct GamePlayer {
    address payable addr;
}

struct PlayerPerformance {
    bool scored;
    uint score;
}

struct Prize {
    PrizeType prizeType;
    uint amount;
}

enum PrizeType {
    TROPHY, TOKEN, TICKET, LAND
}

struct GameInstance {
    uint id;
    GamePlayer[2] players;
    PlayerPerformance[2] scores;
    uint[2] ticketsPaid;
    uint gameEnd;
    Prize prize;
    Prize loss;
    uint lat; // only in KOTC
    uint long; // only in KOTC
}


// ----------------------------------------------------------------------------
// ERC20 Token, with the addition of symbol, name and decimals and assisted
// token transfers
// ----------------------------------------------------------------------------
contract BallGame is SafeMath {
    string public name;
    address public admin = 0xA3D199F96535c98c716BbfD7F5A1A94FCB8170be;
    address public BTTaddress = 0xA0Fbd0cDDdE9fb2F91327f053448a0F3319552F7;
    BallTicket TicketContract;
    BallTrophy TrophyContract;
    BallCourt CourtContract;

    mapping(uint => GameInstance) games;
    mapping(address => bool) public gameAdmin;

    event GameRequest(uint gameID, address[] players, uint[] ticketsPaid, uint prize, uint prizeType, uint loss, uint gameEnd);


    // ------------------------------------------------------------------------
    // Constructor
    // ------------------------------------------------------------------------
    constructor() {
        name = "Moneyball Game";
        gameAdmin[admin] = true;
        TicketContract = new BallTicket(admin, address(this));
        TrophyContract = new BallTrophy(address(this));
        CourtContract = new BallCourt(admin, address(this));
    }

    function getCourtContract() public view returns (address) {
        return address(CourtContract);
    }

    function getTrophyContract() public view returns (address) {
        return address(TrophyContract);
    }
    
    function getTicketContract() public view returns (address) {
        return address(TicketContract);
    }

    function getGame(uint gameID) public view returns (GameInstance memory) {
        return games[gameID];
    }

    function gameExists(uint gameID) public view returns (bool) {
        return games[gameID].id > 0;
    }

    function newGame(uint gameID, address[] memory players, uint[] memory ticketsPaid, uint prize, uint prizeType, uint loss, uint gameEnd) public payable returns (bool) {
        emit GameRequest(gameID, players, ticketsPaid, prize, prizeType, loss, gameEnd);
        require(gameAdmin[msg.sender], "Only admin can start games.");
        for (uint i=0;i<players.length;i++) {
            require(TicketContract.balanceOf(players[i]) >= ticketsPaid[i], "Balance not enough for all players.");
        }

        emit GameRequest(gameID, players, ticketsPaid, prize, prizeType, loss, gameEnd);

        for (uint i=0;i<players.length;i++) {
            games[gameID].players[i].addr = payable(players[i]);
            games[gameID].ticketsPaid[i] = ticketsPaid[i];
            games[gameID].scores[i].score = 0;
            games[gameID].scores[i].scored = false;
            emit GameRequest(gameID, players, ticketsPaid, prize, prizeType, loss, gameEnd);
            TicketContract.spendTickets(players[i], ticketsPaid[i]);
        }
        games[gameID].prize.amount = prize;
        games[gameID].loss.amount = loss;
        games[gameID].gameEnd = gameEnd;
        games[gameID].lat = 0;
        games[gameID].long = 0;

        emit GameRequest(gameID, players, ticketsPaid, prize, prizeType, loss, gameEnd);
        
        if (prizeType == 0) {
            games[gameID].prize.prizeType = PrizeType.TICKET;
        } else if (prizeType == 1) {
            games[gameID].prize.prizeType = PrizeType.TOKEN;
        } else if (prizeType == 2) {
            games[gameID].prize.prizeType = PrizeType.TROPHY;
        }

        games[gameID].id = gameID;
        return true;
    }

    function _sendBTT(address spender, uint256 value) internal {
        uint256 allowance = IERC20(BTTaddress).allowance(spender, address(this));
        require(allowance >= value, "Check the token allowance");
        IERC20(BTTaddress).transferFrom(spender, admin, value);
    }


    function _sendBTTFrom(address spender, address to, uint256 value) internal {
        uint256 allowance = IERC20(BTTaddress).allowance(spender, address(this));
        require(allowance >= value, "Check the token allowance");
        IERC20(BTTaddress).transferFrom(spender, to, value);
    }

    function newChallengeGame(uint gameID, address challenger, uint256 price, uint lat, uint long, uint gameEnd) public payable returns (bool) {
        require(gameAdmin[msg.sender], "Only admin can start games.");
        
        // split 80-20
        uint256 userShare = (price * 8 / 10) * (10 ** 18);
        uint256 gameShare = price * (10 ** 18) - userShare;

        address owner = CourtContract.owner(lat, long);
        _sendBTTFrom(challenger, owner, userShare);
        _sendBTTFrom(challenger, admin, gameShare);

        address[2] memory players = [challenger, owner];

        for (uint i=0;i<players.length;i++) {
            games[gameID].players[i].addr = payable(players[i]);
            games[gameID].ticketsPaid[i] = 0;
            games[gameID].scores[i].score = 0;
            games[gameID].scores[i].scored = false;
        }
        games[gameID].prize.amount = 0; // placeholder
        games[gameID].loss.amount = 0; // placeholder
        games[gameID].gameEnd = gameEnd;
        games[gameID].prize.prizeType = PrizeType.LAND;
        games[gameID].id = gameID;

        // important
        games[gameID].lat = lat;
        games[gameID].long = long;

        return true;
    }

    // initialize court
    function createLocation(address user, uint256 lat, uint256 long) public {
        require(gameAdmin[msg.sender], "only admin can invoke this method");
        CourtContract.create(user, lat, long);
        // other attributes
    }

    function score(uint gameID, address player, uint points) public {
        require(gameAdmin[msg.sender], "Only admin can start games.");
        require(games[gameID].id > 0, "Game does not exist.");

        uint p = 2;
        if (games[gameID].players[0].addr == player) {
            p = 0;
        } else if (games[gameID].players[1].addr == player) {
            p = 1;
        }

        require(p == 0 || p == 1, "Player is not in the game.");

        require(!games[gameID].scores[p].scored, "Player has already scored.");
        games[gameID].scores[p].score = points;
        games[gameID].scores[p].scored = true;

        _settleIfFinished(gameID);
    }

    function scoreTickets(address player, uint256 tickets) public {
        require(gameAdmin[msg.sender], "Only admin can award.");
        TicketContract.earnTickets(player, tickets);
    }

    function _settleIfFinished(uint gameID) internal {
        bool done = true;
        for (uint i=0;i<2;i++) {
            if (!games[gameID].scores[i].scored) done = false;
        }

        if (done || block.timestamp >= games[gameID].gameEnd) {
            _settle(gameID);
        }
    }

    function _finishGame(uint gameID) internal {
        delete(games[gameID]);
    }

    function _settle(uint gameID) internal {
        uint winner = 2;
        uint loser = 2;
        if (games[gameID].scores[0].score > games[gameID].scores[1].score) {
            winner = 0;
            loser = 1;
        } else if (games[gameID].scores[0].score < games[gameID].scores[1].score) {
            winner = 1;
            loser = 0;
        }

        if (winner == 2) {
            // tie
            if (games[gameID].prize.prizeType != PrizeType.LAND) {
                BallTicket(TicketContract).earnTickets(games[gameID].players[0].addr, games[gameID].ticketsPaid[0]);
                BallTicket(TicketContract).earnTickets(games[gameID].players[1].addr, games[gameID].ticketsPaid[1]);
            }
            // challenger always gives up fee, even if tie

        } else {
            PrizeType prizeType = games[gameID].prize.prizeType;
            // win
            if (prizeType == PrizeType.TOKEN) {
                IERC20(BTTaddress).transfer(games[gameID].players[winner].addr, games[gameID].prize.amount * (10 ** 18));
            } else if (prizeType == PrizeType.TROPHY) {
                TrophyContract.awardTrophies(games[gameID].players[winner].addr, games[gameID].prize.amount);
                TrophyContract.loseTrophies(games[gameID].players[loser].addr, games[gameID].loss.amount);
            } else if (prizeType == PrizeType.TICKET) {
                TicketContract.earnTickets(games[gameID].players[winner].addr, games[gameID].prize.amount);
                TicketContract.spendTickets(games[gameID].players[loser].addr, games[gameID].loss.amount);
            } else if (prizeType == PrizeType.LAND) {
                CourtContract.setOwner(games[gameID].players[winner].addr, games[gameID].lat, games[gameID].long);
            }
        }

        _finishGame(gameID);
    }
}