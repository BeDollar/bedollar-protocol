pragma solidity ^0.6.0;

import './Cream.sol';

contract yCreamBUSDStrategy is Cream {
    constructor()
        public
        Cream(
            0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56,
            0x2Bc4eb013DDee29D37920938B96d353171289B7C
        )
    {}
}
