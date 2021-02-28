pragma solidity ^0.6.0;

import './Cream.sol';

contract yCreamDAIStrategy is Cream {
    constructor()
        public
        Cream(
            0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3,
            0x9095e8d707E40982aFFce41C61c10895157A1B22
        )
    {}
}
