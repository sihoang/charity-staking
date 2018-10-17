pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";
import "./lib/SafeMath.sol";


contract Staking is ERC165, ISimpleStaking {
  using SafeMath for uint256;

  struct StakeInfo {
    uint256 amount;
    bytes data;
  }

  /// @dev Address of the ERC20 token contract used for staking
  address internal erc20Token;

  /// @dev https://solidity.readthedocs.io/en/v0.4.25/style-guide.html#avoiding-naming-collisions
  uint256 internal totalStaked_ = 0;

  mapping (address => StakeInfo) internal stakers;

  constructor(address token) public {
    erc20Token = token;
  }

  /// @dev Implement ERC165
  /// With three or more supported interfaces (including ERC165 itself as a required supported interface),
  /// the mapping approach (in every case) costs less gas than the pure approach (at worst case).
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return
      interfaceID == this.supportsInterface.selector ||
      interfaceID == this.stake.selector ^ this.stakeFor.selector ^ this.unstake.selector ^ this.totalStakedFor.selector ^ this.totalStaked.selector ^ this.token.selector ^ this.supportsHistory.selector;
  }

  function stake(uint256 amount, bytes data) external {
    this.stakeFor(msg.sender, amount, data);
  }

  function stakeFor(address user, uint256 amount, bytes data) external {
    // TODO transfer ERC20
    if (stakers[user].amount > 0) {
      stakers[user].amount = stakers[user].amount.add(amount);
      stakers[user].data = data;
    } else {
      stakers[user] = StakeInfo(amount, data);
    }

    totalStaked_ = totalStaked_.add(amount);
    emit Staked(user, amount, stakers[user].amount, data);
  }

  function unstake(uint256 amount, bytes data) external {
    // TODO return ERC20
    address user = msg.sender;
    stakers[user].amount = stakers[user].amount.sub(amount);
    stakers[user].data = data;

    totalStaked_ = totalStaked_.sub(amount);
    emit Unstaked(user, amount, stakers[user].amount, data);
  }

  function totalStakedFor(address addr) external view returns (uint256) {
    return stakers[addr].amount;
  }

  function totalStaked() external view returns (uint256) {
    return totalStaked_;
  }

  function token() external view returns (address) {
    return erc20Token;
  }

  function supportsHistory() external pure returns (bool) {
    return false;
  }
}
