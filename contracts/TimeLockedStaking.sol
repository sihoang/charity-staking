pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";
import "./lib/SafeMath.sol";
import "./lib/ERC20.sol";


contract TimeLockedStaking is ERC165, ISimpleStaking {
  using SafeMath for uint256;

  struct StakeInfo {
    uint256 amount; // total token staked of this user
    uint256 effectiveAt; // member since
    uint256 unlockedAt; // time when user can unstake
  }

  /// @dev Address of the ERC20 token contract used for staking
  ERC20 internal erc20Token;

  /// @dev https://solidity.readthedocs.io/en/v0.4.25/style-guide.html#avoiding-naming-collisions
  uint256 internal totalStaked_ = 0;

  mapping (address => StakeInfo) public stakers;

  modifier greaterThanZero(uint256 num) {
    require(num > 0, "Must be greater than 0.");
    _;
  }

  constructor(address token) public {
    erc20Token = ERC20(token);
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

  function stakeFor(address user, uint256 amount, bytes data) external greaterThanZero(amount) {
    require(erc20Token.transferFrom(msg.sender, address(this), amount));

    StakeInfo memory info = stakers[user];

    uint256 effectiveAt = info.effectiveAt == 0 ? block.timestamp : info.effectiveAt;
    uint256 unlockedAt = max(info.unlockedAt, getUnlockedAtSignal(data));

    stakers[user] = StakeInfo(amount.add(stakers[user].amount), effectiveAt, unlockedAt);

    totalStaked_ = totalStaked_.add(amount);
    emit Staked(user, amount, stakers[user].amount, data);
  }

  function unstake(uint256 amount, bytes data)
    external
    greaterThanZero(stakers[msg.sender].effectiveAt) // must be a member
    greaterThanZero(block.timestamp - stakers[msg.sender].unlockedAt) // must be unlocked
    greaterThanZero(amount)
  {
    address user = msg.sender;
    stakers[user].amount = stakers[user].amount.sub(amount);
    stakers[user].effectiveAt = block.timestamp;

    totalStaked_ = totalStaked_.sub(amount);

    require(erc20Token.transfer(user, amount));
    emit Unstaked(user, amount, stakers[user].amount, data);
  }

  function totalStakedFor(address addr) external view returns (uint256) {
    return stakers[addr].amount;
  }

  function totalStaked() external view returns (uint256) {
    return totalStaked_;
  }

  function token() external view returns (address) {
    return address(erc20Token);
  }

  function supportsHistory() external pure returns (bool) {
    return false;
  }

  /// Helpers
  ///

  function max(uint256 a, uint256 b) public pure returns (uint256) {
    return a > b ? a : b;
  }

  function min(uint256 a, uint256 b) public pure returns (uint256) {
    return a > b ? b : a;
  }

  function getUnlockedAtSignal(bytes data) public view returns (uint256) {
    bool signalFlag; // equivalent to uint8
    uint256 unlockedAt;
    assembly {
      signalFlag := mload(add(data, 8))
      unlockedAt := mload(add(data, 264))
    }

    // Maximum 365 days from now
    uint256 oneYearFromNow = block.timestamp + 365 days;

    return signalFlag ? min(unlockedAt, oneYearFromNow) : 0;
  }
}
