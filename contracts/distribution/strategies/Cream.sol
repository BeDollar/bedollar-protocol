pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';

import '../../interfaces/IyToken.sol';
import '../../interfaces/IUniswapV2Factory.sol';

interface ICreamController is IERC20 {
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
}

contract Cream is ERC20, IyToken {

    address constant factory = address(0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470);
    IERC20 constant public creamReward = IERC20(0xd4CB328A82bDf5f03eB737f37Fa6B370aef3e888); // CREAM

    IERC20 public _u;
    ICreamController public _y;

    using SafeMath for uint;
    using SafeERC20 for IERC20;

    uint public pool; // How many u token in the pool

    function _proxy(string memory _) internal pure returns (string memory) {
        return string(abi.encodePacked(bytes(_), '_cream_strategy'));
    }

    constructor (address u, address y) ERC20(_proxy(ERC20(u).name()), _proxy(ERC20(u).symbol())) public {
        _u = IERC20(u);
        _y = ICreamController(y);
        _u.safeApprove(y, uint(-1));
    }

    function deposit(uint _amount) override external {
        require(_amount > 0, "stake amount must be greater than 0");
        _u.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
        pool = pool.add(_amount);
        depositAll();
    }
    function withdraw(uint _shares) override external {
        require(_shares > 0, "unstake shares must be greater than 0");
        uint r = _u.balanceOf(address(this));
        if (r < _shares) {
            _y.redeemUnderlying(_shares.sub(r));
        }
        _burn(msg.sender, _shares);
        _u.safeTransfer(msg.sender, _shares);
        pool = pool.sub(_shares);
    }

    function depositAll() public {
        _y.mint(_u.balanceOf(address(this)));
    }

    function harvest() external {
        _y.redeem(_y.balanceOf(address(this)));
        address feeTo = IUniswapV2Factory(factory).feeTo();

        uint delta = _u.balanceOf(address(this)).sub(pool);
        if (delta > 0) {
            _u.safeTransfer(feeTo, delta);
        }

        delta = creamReward.balanceOf(address(this));
        if (delta > 0) {
            creamReward.safeTransfer(feeTo, delta);
        }

        depositAll();
    }
}
