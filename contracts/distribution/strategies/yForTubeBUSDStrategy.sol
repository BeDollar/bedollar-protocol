pragma solidity ^0.6.0;

import './ForTube.sol';

contract yForTubeBUSDStrategy is ForTube {
    constructor()
        public
        ForTube(
            0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56,
            0x57160962Dc107C8FBC2A619aCA43F79Fd03E7556
        )
    {}
}
