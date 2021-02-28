pragma solidity ^0.6.0;

import './ForTube.sol';

contract yForTubeUSDT is ForTube {
    constructor()
        public
        ForTube(
            0x55d398326f99059fF775485246999027B3197955,
            0xBf9213D046C2c1e6775dA2363fC47F10C4471255
        )
    {}
}
