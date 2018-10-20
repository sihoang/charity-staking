pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";
import "./lib/SafeMath.sol";
import "./lib/ERC20.sol";


/**
* Smart contract to stake ERC20 and optionally lock it in for a period of time.
* Users can add more stake any time
* and whether to extend the current locked-in period or not.
* Maximum locked-in time is 365 days from now.
*
* This contract can also be used for signaling user's vote.
* User choice is passed in via the "data" parameter.
* Polls are free to participate by specifying amount = 0
* and results are processed off-chain similarly to carbonvote.
* Caveat: Even though one can stake for other users, he/she cannot vote on behalf of others.
*
* It also keeps track of the effective start time which is recorded on the very
* first stake. Think of it as the "member since" attribute.
* If user unstakes (full or partial) at any point, the effective start time is reset.
*
*/
contract TimeLockedStaking is ERC165, ISimpleStaking {
  using SafeMath for uint256;

  struct StakeInfo {
    /// total tokens this user stakes
    uint256 amount;
    /// "member since" in unix timestamp. Reset when user unstakes.
    uint256 effectiveAt;
    /// unix timestamp when user can unstake
    uint256 unlockedAt;
  }

  /// @dev Address of the ERC20 token contract used for staking
  ERC20 internal erc20Token;

  /// @dev https://solidity.readthedocs.io/en/v0.4.25/style-guide.html#avoiding-naming-collisions
  uint256 internal totalStaked_ = 0;

  /// Keep track of all stakers
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

  /// @dev msg.sender stakes for him/her self or casts a vote.
  /// @param amount Number of ERC20 to be staked. If amount == 0, just emit the vote.
  /// @param data Used for signaling the unlocked time or voting.
  /// In the order to specify the unlocked time, the right-most 8-bit bool must be set to true,
  /// and the next 256 bits represents the unix timestamp of unlockedAt.
  function stake(uint256 amount, bytes data) external {
    if (amount == 0) {
      // Must be a vote
      require(data.length > 0);
      // Casting a vote by msg.sender
      // Caveat: No one can vote on behalf of others!
      emit Staked(msg.sender, 0, stakers[msg.sender].amount, data);
      return;
    }

    this.stakeFor(msg.sender, amount, data);
  }

  /// @dev msg.sender stakes for someone else.
  /// @param amount Number of ERC20 to be staked. Must be > 0.
  /// @param data Used for signaling the unlocked time.
  /// In the order to specify the unlocked time, the right-most 8-bit bool must be set to true,
  /// and the next 256 bits represents the unix timestamp of unlockedAt.
  function stakeFor(address user, uint256 amount, bytes data) external greaterThanZero(amount) {
    require(erc20Token.transferFrom(msg.sender, address(this), amount));

    StakeInfo memory info = stakers[user];

    uint256 effectiveAt = info.effectiveAt == 0 ? block.timestamp : info.effectiveAt;
    uint256 unlockedAt = max(info.unlockedAt, getUnlockedAtSignal(data));

    stakers[user] = StakeInfo(amount.add(stakers[user].amount), effectiveAt, unlockedAt);

    totalStaked_ = totalStaked_.add(amount);

    emit Staked(user, amount, stakers[user].amount, data);
  }

  /// @dev msg.sender can unstake full amount or partial if unlockedAt =< now
  /// @notice as a result, the "member since" attribute is reset.
  /// @param amount Number of ERC20 to be unstaked. Must be > 0 and =< staked amount.
  /// @param data Just follow the interface. Don't have a use case for now.
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

  /// @dev Get the staked amount of an address.
  function totalStakedFor(address addr) external view returns (uint256) {
    return stakers[addr].amount;
  }

  /// @dev Total number of tokens this smart contract hold.
  function totalStaked() external view returns (uint256) {
    return totalStaked_;
  }

  /// @dev Address of the ERC20 used for staking.
  function token() external view returns (address) {
    return address(erc20Token);
  }

  /// @dev This smart contract does not store staking activities on chain.
  /// History is processed off-chain via event logs.
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

  /// @dev The right-most 8 bits of data indicates whether there is a unix timestamp
  /// in the next 256 bits.
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
