// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BallToken is ERC20 {
    address public admin = 0xA3D199F96535c98c716BbfD7F5A1A94FCB8170be;
    constructor() ERC20("Moneyball Token", "BALL") {
        _mint(admin, 1000000000 * (10 ** 18));
    }
}