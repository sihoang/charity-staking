import contracts from 'Embark/contracts';
import assert from 'assert';

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
