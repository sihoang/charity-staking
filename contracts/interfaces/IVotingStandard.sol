pragma solidity ^0.4.22;


/**
 * https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1202.md
 * @notice Use interface instead of contract
 * - Multiple issue
 * - Multiple selection
 * - Ordered multiple result
 * Discussion:
 *   1. Each address has a weight determined by other input decided by the actual implementation
 *      which is suggested to be set upon the initialization
 *   2. Is there certain naming convention to follow?
 */
interface IVotingStandard {

    // Vote with an option. The caller needs to handle success or not
  function vote(uint issueId, uint option) external returns (bool success);
  function setStatus(uint issueId, bool isOpen) external returns (bool success);

  function issueDescription(uint issueId) external view returns (string desc);
  function availableOptions(uint issueId) external view returns (uint[] options);
  function optionDescription(uint issueId, uint option) external view returns (string desc);
  function ballotOf(uint issueId, address addr) external view returns (uint option);
  function weightOf(uint issueId, address addr) external view returns (uint weight);
  function getStatus(uint issueId) external view returns (bool isOpen);
  function weightedVoteCountsOf(uint issueId, uint option) external view returns (uint count);
  function topOptions(uint issueId, uint limit) external view returns (uint[] topOptions_);

  event OnVote(uint issueId, address indexed _from, uint _value);
  event OnStatusChange(uint issueId, bool newIsOpen);
}
