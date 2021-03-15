pragma solidity ^0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

import '../interfaces/IDistributor.sol';
import '../interfaces/IRewardDistributionRecipient.sol';

contract InitialShareDistributor is IDistributor {
    using SafeMath for uint256;

    event Distributed(address pool, uint256 cashAmount);

    bool public once = true;

    IERC20 public share;
    IRewardDistributionRecipient public busdysdLPPool;
    uint256 public busdysdInitialBalance;
    IRewardDistributionRecipient public busdyssLPPool;
    uint256 public busdyssInitialBalance;
    IRewardDistributionRecipient public busdy3dLPPool;
    uint256 public busdy3dInitialBalance;

    constructor(
        IERC20 _share,
        IRewardDistributionRecipient _busdysdLPPool,
        uint256 _busdysdInitialBalance,
        IRewardDistributionRecipient _busdyssLPPool,
        uint256 _busdyssInitialBalance,
        IRewardDistributionRecipient _busdy3dLPPool,
        uint256 _busdy3dInitialBalance
    ) public {
        share = _share;
        busdysdLPPool = _busdysdLPPool;
        busdysdInitialBalance = _busdysdInitialBalance;
        busdyssLPPool = _busdyssLPPool;
        busdyssInitialBalance = _busdyssInitialBalance;
        // new
        busdy3dLPPool = _busdy3dLPPool;
        busdy3dInitialBalance = _busdy3dInitialBalance;
    }

    function distribute() public override {
        require(
            once,
            'InitialShareDistributor: you cannot run this function twice'
        );

        share.transfer(address(busdysdLPPool), busdysdInitialBalance);
        busdysdLPPool.notifyRewardAmount(busdysdInitialBalance);
        emit Distributed(address(busdysdLPPool), busdysdInitialBalance);

        share.transfer(address(busdyssLPPool), busdyssInitialBalance);
        busdyssLPPool.notifyRewardAmount(busdyssInitialBalance);
        emit Distributed(address(busdyssLPPool), busdyssInitialBalance);

        share.transfer(address(busdy3dLPPool), busdy3dInitialBalance);
        busdyssLPPool.notifyRewardAmount(busdy3dInitialBalance);
        emit Distributed(address(busdy3dLPPool), busdy3dInitialBalance);

        once = false;
    }
}
