module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: 'localhost', // Host of the blockchain node
      port: 8545, // Port of the blockchain node
      type: 'rpc', // Type of connection (ws or rpc),
      // Accounts to use instead of the default account to populate your wallet
      /* ,accounts: [
        {
          privateKey: "your_private_key",
          balance: "5 ether"  // You can set the balance of the account in the dev environment
                              // Balances are in Wei, but you can specify the unit with its name
        },
        {
          // Either a keystore or a list of keys, separated by , or ;
          privateKeyFile: "path/to/file",
          password: "passwordForTheKeystore" // Needed to decrypt the keystore file
        },
        {
          mnemonic: "12 word mnemonic",
          addressIndex: "0", // Optionnal. The index to start getting the address
          numAddresses: "1", // Optionnal. The number of addresses to get
          hdpath: "m/44'/60'/0'/0/" // Optionnal. HD derivation path
        }
      ] */
    },
    // order of connections the dapp should connect to
    dappConnection: [
      '$WEB3', // uses pre existing web3 object if available (e.g in Mist)
      'ws://localhost:8546',
      'http://localhost:8545',
    ],
    gas: 'auto',
    accounts: [
      {
        mnemonic: 'clerk next anxiety funny ability vital catalog horn town clever body meat',
        balance: '6 ether',
        numAddresses: 4,
      },
    ],
    contracts: {
      TRST: {
        args: ['$accounts[0]'],
      },
      TimeLockedStaking: {
        args: ['$TRST'],
      },
    },
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      'ws://localhost:8546',
      'http://localhost:8545',
      '$WEB3', // uses pre existing web3 object if available (e.g in Mist)
    ],
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
    contracts: {
      TRST: {
        address: '0x21036C54e16521B8809553956123E44054120226',
      },
      TimeLockedStaking: {
        address: '0x4007ed250e8c1f84fD50008A6aA7c310EC88b1cA',
      },
      SafeMath: {
        address: '0xCfBce6FE7DF7BC3556A690199D4d8Cc4b30Ada91',
      },
    },
    dappConnection: [
      '$WEB3',
    ],
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  // custom_name: {
  // }
};
