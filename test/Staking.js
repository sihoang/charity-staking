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


let accounts;
config({
  deployment: {
    accounts: [
      {
        "mnemonic": "clerk next anxiety funny ability vital catalog horn town clever body meat",
        balance: "6ether",
      }
    ]
  },
}, (err, web3Accounts) => {
  accounts = web3Accounts;
})

const Staking = require('Embark/contracts/Staking');
const TRST = require('Embark/contracts/TRST');

describe("Staking", () => {
  let trstContract;
  let stakingContract;

  before(async () => {
    trstContract = await TRST.deploy({arguments: [accounts[0]]}).send();
    stakingContract = await Staking.deploy({arguments: [trstContract._address]}).send();
  });

  it("should accept an address in the constructor", async () => {
    const erc20 = await stakingContract.methods.erc20Token().call();
    assert.strictEqual(erc20, trstContract._address);
  });
});
