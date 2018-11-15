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
        address: '0x838A95A661BA3A9c314ED4951bD9Addc220A04A7',
      },
      TimeLockedStaking: {
        address: '0x9b8d8961931B271468f27bB89ceAb4C5e656d862',
      },
      SafeMath: {
        address: '0x897635BC992549E9B74ACAE2dE8B857c72dF4bb5',
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
