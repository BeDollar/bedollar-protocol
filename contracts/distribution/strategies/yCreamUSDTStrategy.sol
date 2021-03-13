pragma solidity ^0.6.0;

import './Cream.sol';

contract yCreamUSDTStrategy is Cream {
    constructor()
        public
        Cream(
            0x55d398326f99059fF775485246999027B3197955,
            0xEF6d459FE81C3Ed53d292c936b2df5a8084975De
        )
    {}
}
