const getTrstBalance = async (contract, address) => {
  const BigNumber = web3.utils.BN;
  return new BigNumber(await contract.methods.balanceOf(address).call());
};

const getTotalStakedFor = async (contract, address) => {
  const BigNumber = web3.utils.BN;
  return new BigNumber(await contract.methods.totalStakedFor(address).call());
};

const getTotalStaked = async contract => new web3.utils.BN(
  await contract.methods.totalStaked().call(),
);

module.exports = {
  getTrstBalance,
  getTotalStakedFor,
  getTotalStaked,
};
