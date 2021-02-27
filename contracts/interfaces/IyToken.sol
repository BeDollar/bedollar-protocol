pragma solidity ^0.6.0;

// SPDX-License-Identifier: UNLICENSED

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IyToken is IERC20 {
    function deposit(uint) external;
    function withdraw(uint) external;
}
