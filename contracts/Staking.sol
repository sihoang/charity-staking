pragma solidity ^0.4.25;

import "./interfaces/ERC165.sol";
import "./interfaces/ISimpleStaking.sol";

contract Staking is ERC165, ISimpleStaking {

  /// @dev Address of the ERC20 token contract used for staking
  address public erc20Token;

  constructor(address erc20TokenContract) public {
    erc20Token = erc20TokenContract;
  }

  /// @dev Implement ERC165
  function supportsInterface(bytes4 interfaceID) external view returns (bool) {
    return
      interfaceID == this.supportsInterface.selector || // ERC165
        interfaceID == this.stake.selector
                        ^ this.stakeFor.selector
                        ^ this.unstake.selector
                        ^ this.totalStakedFor.selector
                        ^ this.totalStaked.selector
                        ^ this.token.selector
                        ^ this.supportsHistory.selector; // ERC900
  }
}
