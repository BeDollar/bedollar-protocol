pragma solidity ^0.6.0;

// SPDX-License-Identifier: UNLICENSED

// File: @openzeppelin/contracts/GSN/Context.sol

import '@openzeppelin/contracts/GSN/Context.sol';

// File: @openzeppelin/contracts/utils/ReentrancyGuard.sol

import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';

// File: @openzeppelin/contracts/token/ERC20/IERC20.sol

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

// File: @openzeppelin/contracts/math/Math.sol

import '@openzeppelin/contracts/math/Math.sol';

// File: @openzeppelin/contracts/math/SafeMath.sol

import '@openzeppelin/contracts/math/SafeMath.sol';

// File: @openzeppelin/contracts/utils/Address.sol

import '@openzeppelin/contracts/utils/Address.sol';

// File: @openzeppelin/contracts/token/ERC20/SafeERC20.sol

import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';

// File: contracts/interfaces/IUniswapV2ERC20.sol

import '../interfaces/IUniswapV2ERC20.sol';
import '../interfaces/IyToken.sol';

contract YSDMultiPool is ReentrancyGuard {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /* ========== STATE VARIABLES ========== */

    IERC20 public rewardsToken;
    uint256 public startTime;
    uint256 public periodFinish = 0;
    uint256 public rewardRate = 0;
    uint256 public rewardsDuration = 14 days;
    uint256 public lastUpdateTime;
    uint256 public rewardPerTokenStored;
    address public owner;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;
    mapping(address => uint256) public supportedToken;
    mapping(address => IyToken) public yTokens;

    uint256 private _totalSupply;
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _subBalances;

    /* ========== CONSTRUCTOR ========== */

    constructor(
        address _rewardsToken,
        address _owner,
        uint256 _startTime
    ) public {
        rewardsToken = IERC20(_rewardsToken);
        owner = address(_owner);
        startTime = _startTime;
    }

    /* ========== VIEWS ========== */

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function subBalanceOf(address account, address token)
        external
        view
        returns (uint256)
    {
        return _subBalances[account][token];
    }

    function lastTimeRewardApplicable() public view returns (uint256) {
        return Math.min(block.timestamp, periodFinish);
    }

    function addSupportedToken(address token, uint256 weight)
        external
        onlyOwner()
    {
        supportedToken[token] = weight;
    }
    function addYToken(address token, address yToken)
        external
        onlyOwner()
        onlySupportedToken(token)
    {
        if (address(yTokens[token]) != address(0)) {
            withdrawAll(token);
            IERC20(supportedToken[token]).safeApprove(yToken, 0);
        }

        yTokens[token] = IyToken(yToken);
        IERC20(supportedToken[token]).safeApprove(yToken, uint(-1));
    }

    function rewardPerToken() public view returns (uint256) {
        if (_totalSupply == 0) {
            return rewardPerTokenStored;
        }
        return
            rewardPerTokenStored.add(
                lastTimeRewardApplicable()
                    .sub(lastUpdateTime)
                    .mul(rewardRate)
                    .mul(1e18)
                    .div(_totalSupply)
            );
    }

    function earned(address account) public view returns (uint256) {
        return
            _balances[account]
                .mul(rewardPerToken().sub(userRewardPerTokenPaid[account]))
                .div(1e18)
                .add(rewards[account]);
    }

    function getRewardForDuration() external view returns (uint256) {
        return rewardRate.mul(rewardsDuration);
    }

    /* ========== MUTATIVE FUNCTIONS ========== */

    function stake(address token, uint256 amount)
        public
        nonReentrant
        updateReward(msg.sender)
        onlySupportedToken(token)
        checkStart
    {
        require(amount > 0, 'Cannot stake 0');
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        _subBalances[msg.sender][token] = _subBalances[msg.sender][token].add(
            amount
        );
        emit Staked(msg.sender, token, amount);
        amount = amount.mul(supportedToken[token]);
        _totalSupply = _totalSupply.add(amount);
        _balances[msg.sender] = _balances[msg.sender].add(amount);
        if (address(yTokens[token]) != address(0)) {
            depositAll(token);
        }
    }

    function withdraw(address token, uint256 amount)
        public
        nonReentrant
        updateReward(msg.sender)
        onlySupportedToken(token)
        checkStart
    {
        require(amount > 0, 'Cannot withdraw 0');
        uint balance = IERC20(token).balanceOf(address(this));
        if (amount > balance) {
            yTokens[token].withdraw(amount.sub(balance));
        }
        IERC20(token).safeTransfer(msg.sender, amount);
        _subBalances[msg.sender][token] = _subBalances[msg.sender][token].sub(
            amount
        );
        emit Withdrawn(msg.sender, token, amount);
        amount = amount.mul(supportedToken[token]);
        _totalSupply = _totalSupply.sub(amount);
        _balances[msg.sender] = _balances[msg.sender].sub(amount);
    }

    function getReward()
        public
        nonReentrant
        updateReward(msg.sender)
        checkStart
    {
        uint256 reward = rewards[msg.sender];
        if (reward > 0) {
            rewards[msg.sender] = 0;
            rewardsToken.safeTransfer(msg.sender, reward);
            emit RewardPaid(msg.sender, reward);
        }
    }

    function exit(address token) external {
        withdraw(token, _balances[msg.sender]);
        getReward();
    }

    function depositAll(address token) public onlySupportedToken(token) {
        yTokens[token].deposit(IERC20(token).balanceOf(address(this)));
    }
    function withdrawAll(address token) public onlySupportedToken(token) onlyOwner {
        yTokens[token].withdraw(yTokens[token].balanceOf(address(this)));
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function notifyRewardAmount(uint256 reward)
        external
        updateReward(address(0))
    {
        if (block.timestamp > startTime) {
            if (block.timestamp >= periodFinish) {
                rewardRate = reward.div(rewardsDuration);
            } else {
                uint256 lastRate = rewardRate;
                uint256 remaining = periodFinish.sub(block.timestamp);
                uint256 leftover = remaining.mul(rewardRate);
                rewardRate = reward.add(leftover).div(rewardsDuration);
                require(rewardRate >= lastRate, 'rewardRate >= lastRate');
            }

            // Ensure the provided reward amount is not more than the balance in the contract.
            // This keeps the reward rate in the right range, preventing overflows due to
            // very high values of rewardRate in the earned and rewardsPerToken functions;
            // Reward + leftover must be less than 2^256 / 10^18 to avoid overflow.
            uint256 balance = rewardsToken.balanceOf(address(this));
            require(
                rewardRate <= balance.div(rewardsDuration),
                'Provided reward too high'
            );

            lastUpdateTime = block.timestamp;
            periodFinish = block.timestamp.add(rewardsDuration);
            emit RewardAdded(reward);
        } else {
            rewardRate = reward.div(rewardsDuration);
            lastUpdateTime = startTime;
            periodFinish = startTime.add(rewardsDuration);
            emit RewardAdded(reward);
        }
    }

    /* ========== MODIFIERS ========== */

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner == msg.sender, 'Ownable: caller is not the owner');
        _;
    }

    /**
     * @dev Throws if used token is not a supportedToken.
     */
    modifier onlySupportedToken(address token) {
        require(supportedToken[token] != 0, 'Token is not supported');
        _;
    }

    modifier checkStart() {
        require(block.timestamp >= startTime, 'YSDMultiPool: not start');
        _;
    }

    modifier updateReward(address account) {
        rewardPerTokenStored = rewardPerToken();
        lastUpdateTime = lastTimeRewardApplicable();
        if (account != address(0)) {
            rewards[account] = earned(account);
            userRewardPerTokenPaid[account] = rewardPerTokenStored;
        }
        _;
    }

    /* ========== EVENTS ========== */

    event RewardAdded(uint256 reward);
    event Staked(address indexed user, address indexed token, uint256 amount);
    event Withdrawn(
        address indexed user,
        address indexed token,
        uint256 amount
    );
    event RewardPaid(address indexed user, uint256 reward);
}
