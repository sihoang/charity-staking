// this is needed because there is bug in Embark when
// the app is loaded before metamask is unlocked
export const refreshedContract = (web3, contract) => new web3
  .eth
  .Contract(contract.options.jsonInterface, contract.address);

// eslint wants export default
export default null;
