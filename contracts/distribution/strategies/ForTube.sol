pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';

import '../../interfaces/IyToken.sol';
import '../../interfaces/IUniswapV2Factory.sol';

interface IForTubeBank {
    function deposit(address token, uint256 amount) external;
    function withdraw(address underlying, uint256 withdrawTokens) external;
    function withdrawUnderlying(address underlying, uint256 withdrawAmount) external;
}

contract ForTube is ERC20, IyToken {

    address constant factory = address(0x32CE36F6eA8d97f9fC19Aab83b9c6D2F52D74470);
    address constant fortubeBank = address(0x0cEA0832e9cdBb5D476040D58Ea07ecfbeBB7672);
    address constant fortubeBankController = address(0xc78248D676DeBB4597e88071D3d889eCA70E5469);
    IERC20 constant public fortubeReward = IERC20(0x658A109C5900BC6d2357c87549B651670E5b0539); // FOR

    IERC20 public _u;
    IERC20 public _y;

    using SafeMath for uint;
    using SafeERC20 for IERC20;

    uint public pool; // How many u token in the pool

    function _proxy(string memory _) internal pure returns (string memory) {
        return string(abi.encodePacked(bytes(_), '_fortube_strategy'));
    }

    constructor (address u, address y) ERC20(_proxy(ERC20(u).name()), _proxy(ERC20(u).symbol())) public {
        _u = IERC20(u);
        _y = IERC20(y);
        _u.safeApprove(fortubeBankController, uint(-1));
    }

    function deposit(uint _amount) override external {
        require(_amount > 0, "stake amount must be greater than 0");
        _u.safeTransferFrom(msg.sender, address(this), _amount);
        _mint(msg.sender, _amount);
        pool = pool.add(_amount);
        IForTubeBank(fortubeBank).deposit(address(_u), _u.balanceOf(address(this)));
    }
    function withdraw(uint _shares) override external {
        require(_shares > 0, "unstake shares must be greater than 0");
        uint r = _u.balanceOf(address(this));
        if (r < _shares) {
            IForTubeBank(fortubeBank).withdrawUnderlying(address(_u), _shares.sub(r));
        }
        _burn(msg.sender, _shares);
        _u.safeTransfer(msg.sender, _shares);
        pool = pool.sub(_shares);
    }

    function harvest() external {
        IForTubeBank(fortubeBank).withdraw(address(_u), _y.balanceOf(address(this)));
        address feeTo = IUniswapV2Factory(factory).feeTo();

        uint delta = _u.balanceOf(address(this)).sub(pool);
        if (delta > 0) {
            _u.safeTransfer(feeTo, delta);
        }

        delta = fortubeReward.balanceOf(address(this));
        if (delta > 0) {
            fortubeReward.safeTransfer(feeTo, delta);
        }
    }
}
