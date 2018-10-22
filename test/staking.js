// /*global contract, config, it, assert*/
/*
const SimpleStorage = require('Embark/contracts/SimpleStorage');

let accounts;

// For documentation please see https://embark.status.im/docs/contracts_testing.html
config({
  //deployment: {
  //  accounts: [
  //    // you can configure custom accounts with a custom balance
  //    // see https://embark.status.im/docs/contracts_testing.html#Configuring-accounts
  //  ]
  //},
  contracts: {
    "SimpleStorage": {
      args: [100]
    }
  }
}, (_err, web3_accounts) => {
  accounts = web3_accounts
});

contract("SimpleStorage", function () {
  this.timeout(0);

  it("should set constructor value", async function () {
    let result = await SimpleStorage.methods.storedData().call();
    assert.strictEqual(parseInt(result, 10), 100);
  });

  it("set storage value", async function () {
    await SimpleStorage.methods.set(150).send();
    let result = await SimpleStorage.methods.get().call();
    assert.strictEqual(parseInt(result, 10), 150);
  });

  it("should have account with balance", async function() {
    let balance = await web3.eth.getBalance(accounts[0]);
    assert.ok(parseInt(balance, 10) > 0);
  });
}
*/

const { getTrstBalance, getTotalStakedFor, getTotalStaked } = require('./utils');

const StakingContract = embark.require('Embark/contracts/TimeLockedStaking');
const TRST = embark.require('Embark/contracts/TRST');

let trstHolder;
config({
  contracts: {
    TRST: {
      args: ['$accounts[0]'],
    },
    TimeLockedStaking: {
      args: ['$TRST'],
    },
  },
}, (err, web3Accounts) => {
  [trstHolder] = web3Accounts;
});

contract('Staking Sanity', () => {
  it('should accept an address in the constructor', async () => {
    const erc20 = await StakingContract.methods.token().call();
    assert.strictEqual(erc20, TRST.options.address);
  });

  it('should return correct supportsInterface', async () => {
    const eip165 = await StakingContract.methods.supportsInterface('0x01ffc9a7').call();
    assert.ok(eip165);
    const eip900 = await StakingContract.methods.supportsInterface('0x8efdf8ee').call();
    assert.ok(eip900);
    const invalid = await StakingContract.methods.supportsInterface('0xffffffff').call();
    assert.ok(!invalid);
  });

  it('should be able to stake and unstake and balance is transfered correctly', async () => {
    const amount = new web3.utils.BN(web3.utils.toWei('1', 'gwei')); // 1000 TRST
    const zero = new web3.utils.BN(0);
    const stakingContractAddress = StakingContract.options.address;
    const options = {
      from: trstHolder,
    };
    const trstOriginalBalance = await getTrstBalance(TRST, trstHolder);

    // approve TRST transfer before staking
    await TRST.methods
      .approve(StakingContract.options.address, amount)
      .send({ from: trstHolder });

    // make sure StakingContract has 0 balance
    assert.deepEqual(await getTotalStaked(StakingContract), zero);
    assert.deepEqual(await getTrstBalance(TRST, stakingContractAddress), zero);

    await StakingContract.methods.stake(amount, '0x').send(options);

    // verify balance in TRST. trstHolder transfers to StakingContract.
    assert.deepEqual(
      trstOriginalBalance.sub(amount),
      await getTrstBalance(TRST, trstHolder),
    );
    assert.deepEqual(await getTrstBalance(TRST, stakingContractAddress), amount);

    // verify balance in StakingContract
    let totalStakedFor = await getTotalStakedFor(StakingContract, trstHolder);
    assert.deepEqual(totalStakedFor, amount);
    assert.deepEqual(await getTotalStaked(StakingContract), amount);

    await StakingContract.methods.unstake(amount, '0x').send(options);

    // verify balance is updated in StakingContract
    totalStakedFor = await getTotalStakedFor(StakingContract, trstHolder);
    assert.deepEqual(totalStakedFor, web3.utils.toBN(0));
    assert.deepEqual(await getTotalStaked(StakingContract), zero);

    // verify balance is updated in TRST. StakingContract transfers to trstHolder.
    assert.deepEqual(await getTrstBalance(TRST, trstHolder), trstOriginalBalance);
    assert.deepEqual(await getTrstBalance(TRST, stakingContractAddress), zero);
  });

  it('should return supportsHistory false', async () => {
    const isSupportsHistory = await StakingContract.methods.supportsHistory().call();
    assert.equal(isSupportsHistory, false);
  });
});
