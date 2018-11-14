import contracts from 'Embark/contracts';
import assert from 'assert';

const paddedBytes = (numberString) => {
  const { utils } = web3;
  const hex = utils.toHex(numberString);
  const padded = utils.padLeft(hex, 32);
  return utils.hexToBytes(padded);
};

/**
 * Build stake payload from timeSignal and voteSignal
 * @param timeSignal Locked in duration in seconds
 * @param voteSignal Any number in string. It is emitted in the event log
 * but not stored
 */
const buildBytesInput = (timeSignal, voteSignal) => {
  const paddedTimeSignal = paddedBytes(timeSignal, 32);
  const paddedVoteSignal = paddedBytes(voteSignal, 32);
  const data = paddedBytes('0').concat(paddedTimeSignal, paddedVoteSignal);
  const hex = web3.utils.bytesToHex(data);
  return hex;
};

// This method is for working around Embark's issue
// with stale contracts.
// Case 1: Load the app first and then log in
// Case 2: Change account in metamask
export default function loadContract(contractName) {
  const contract = contracts[contractName];
  assert(contract);
  return new web3.eth.Contract(
    contract.options.jsonInterface,
    contract.address,
    {
      from: web3.eth.defaultAccount,
    },
  );
}

export function getStakePayload(durationInDays, npo) {
  const durationInSeconds = durationInDays * 24 * 60 * 60;
  assert(npo.ein.length > 0, 'EIN not found.');
  return buildBytesInput(durationInSeconds, npo.ein);
}
