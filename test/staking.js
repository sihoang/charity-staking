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

let accounts;
config({
  deployment: {
    accounts: [
      {
        mnemonic: 'clerk next anxiety funny ability vital catalog horn town clever body meat',
        balance: '6ether',
        numAddresses: 2,
      },
    ],
  },
}, (err, web3Accounts) => {
  accounts = web3Accounts;
});

const Staking = embark.require('Embark/contracts/TimeLockedStaking');
const TRST = embark.require('Embark/contracts/TRST');

contract('Staking Sanity', () => {
  let trstHolder;
  let trstContract;
  let stakingContract;

  before(async () => {
    [trstHolder] = accounts;
    trstContract = await TRST.deploy({ arguments: [trstHolder] }).send({ from: trstHolder });
    stakingContract = await Staking.deploy({ arguments: [trstContract.options.address] }).send();
  });

  it('should accept an address in the constructor', async () => {
    const erc20 = await stakingContract.methods.token().call();
    assert.strictEqual(erc20, trstContract.options.address);
  });

  it('should return correct supportsInterface', async () => {
    const eip165 = await stakingContract.methods.supportsInterface('0x01ffc9a7').call();
    assert.ok(eip165);
    const eip900 = await stakingContract.methods.supportsInterface('0x8efdf8ee').call();
    assert.ok(eip900);
    const invalid = await stakingContract.methods.supportsInterface('0xffffffff').call();
    assert.ok(!invalid);
  });

  it('should be able to stake and unstake and balance is transfered correctly', async () => {
    const amount = new web3.utils.BN(web3.utils.toWei('1', 'gwei')); // 1000 TRST
    const zero = new web3.utils.BN(0);
    const stakingContractAddress = stakingContract.options.address;
    const options = {
      from: trstHolder,
    };
    const trstOriginalBalance = await getTrstBalance(trstContract, trstHolder);

    // approve TRST transfer before staking
    await trstContract.methods
      .approve(stakingContract.options.address, amount)
      .send({ from: trstHolder });

    // make sure stakingContract has 0 balance
    assert.deepEqual(await getTotalStaked(stakingContract), zero);
    assert.deepEqual(await getTrstBalance(trstContract, stakingContractAddress), zero);

    await stakingContract.methods.stake(amount, '0x').send(options);

    // verify balance in trstContract. trstHolder transfers to stakingContract.
    assert.deepEqual(
      trstOriginalBalance.sub(amount),
      await getTrstBalance(trstContract, trstHolder),
    );
    assert.deepEqual(await getTrstBalance(trstContract, stakingContractAddress), amount);

    // verify balance in stakingContract
    let totalStakedFor = await getTotalStakedFor(stakingContract, trstHolder);
    assert.deepEqual(totalStakedFor, amount);
    assert.deepEqual(await getTotalStaked(stakingContract), amount);

    await stakingContract.methods.unstake(amount, '0x').send(options);

    // verify balance is updated in stakingContract
    totalStakedFor = await getTotalStakedFor(stakingContract, trstHolder);
    assert.deepEqual(totalStakedFor, web3.utils.toBN(0));
    assert.deepEqual(await getTotalStaked(stakingContract), zero);

    // verify balance is updated in trstContract. stakingContract transfers to trstHolder.
    assert.deepEqual(await getTrstBalance(trstContract, trstHolder), trstOriginalBalance);
    assert.deepEqual(await getTrstBalance(trstContract, stakingContractAddress), zero);
  });

  it('should return supportsHistory false', async () => {
    const isSupportsHistory = await stakingContract.methods.supportsHistory().call();
    assert.equal(isSupportsHistory, false);
  });
});
