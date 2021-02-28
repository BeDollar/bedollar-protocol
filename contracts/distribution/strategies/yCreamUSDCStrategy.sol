pragma solidity ^0.6.0;

import './Cream.sol';

contract yCreamUSDCStrategy is Cream {
    constructor()
        public
        Cream(
            0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d,
            0xD83C88DB3A6cA4a32FFf1603b0f7DDce01F5f727
        )
    {}
}
