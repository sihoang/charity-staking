pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";


contract Staking is ERC165, ISimpleStaking {

  /// @dev Address of the ERC20 token contract used for staking
  address internal erc20Token;

  constructor(address erc20TokenContract) public {
    erc20Token = erc20TokenContract;
  }

  /// @dev Implement ERC165
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return
      interfaceID == this.supportsInterface.selector ||
      interfaceID == this.stake.selector ^ this.stakeFor.selector ^ this.unstake.selector ^ this.totalStakedFor.selector ^ this.totalStaked.selector ^ this.token.selector ^ this.supportsHistory.selector;
  }

  function stake(uint256 amount, bytes data) external {
    // TODO implementation
  }

  function stakeFor(address user, uint256 amount, bytes data) external {
    // TODO implementation
  }

  function unstake(uint256 amount, bytes data) external {
    // TODO implementation
  }

  function totalStakedFor(address addr) external view returns (uint256) {
    // TODO implementation
    return 0;
  }

  function totalStaked() external view returns (uint256) {
    // TODO implementation
    return 0;
  }

  function token() external view returns (address) {
    // TODO implementation
    return erc20Token;
  }

  function supportsHistory() external pure returns (bool) {
    // TODO implementation
    return false;
  }
}
