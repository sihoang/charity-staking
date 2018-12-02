import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import axios from 'axios';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import web3App from './reducers';
import theme from './theme';
import HomePage from './HomePage';
import {
  findWeb3, unlockAccount, findNetworkId, lockAccount, findTrstBalance,
  fetchAccountActivities,
} from './actions';
import loadContract, { parseStakePayload } from './loadContract';

import '../css/main.css';

const store = createStore(web3App);
function App() {
  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <HomePage />
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

const { BN } = web3.utils;
const onNewAccount = (account) => {
  store.dispatch(unlockAccount(account));

  loadContract('TRST').methods.balanceOf(account).call()
    .then((trstBalance) => {
      store.dispatch(findTrstBalance(trstBalance));
    });

  loadContract('TimeLockedStaking').getPastEvents('Staked', {
    fromBlock: 0,
    toBlock: 'latest',
    filter: {
      user: account,
    },
  }, (err, events) => {
    const transformed = events.map((event) => {
      const {
        id, blockNumber, transactionHash, returnValues,
      } = event;
      const { amount, data } = returnValues;
      const { ein, lockedUntil } = parseStakePayload(data);
      return {
        id,
        ein,
        amount: new BN(amount).div(new BN(1e6)).toString(),
        lockedUntil,
        blockNumber,
        transactionHash,
      };
    });

    const populatedNPOPromises = transformed.map(async (record) => {
      const res = await axios.get(
        `${CMS_URL}/charities?search=${record.ein}`,
      );
      const npo = res.data && res.data.records && res.data.records[0];
      return {
        ...npo,
        ...record,
      };
    });

    Promise.all(populatedNPOPromises).then((completed) => {
      store.dispatch(fetchAccountActivities(completed));
    });
  });
};

EmbarkJS.onReady(() => {
  store.dispatch(findWeb3());
  web3.eth.getAccounts().then((accounts) => {
    if (accounts[0]) {
      onNewAccount(accounts[0].toLowerCase());
    } else {
      store.dispatch(lockAccount());
    }
  });

  web3.eth.net.getId().then((networkId) => {
    store.dispatch(findNetworkId(networkId));
  });

  const { publicConfigStore } = web3.currentProvider;
  if (publicConfigStore) {
  // Setup hook/listner to the web3 changes
    publicConfigStore.on('update', (updates) => {
      const { selectedAddress, networkVersion } = updates;
      if (!selectedAddress) {
        store.dispatch(lockAccount());
        return;
      }

      const { account, networkId } = store.getState();

      if (account !== selectedAddress) {
        onNewAccount(selectedAddress);
        web3.eth.defaultAccount = selectedAddress;
      }

      if (networkId !== networkVersion) {
        store.dispatch(findNetworkId(networkVersion));
        loadContract('TRST').methods.balanceOf(selectedAddress).call()
          .then((trstBalance) => {
            store.dispatch(findTrstBalance(trstBalance));
          }).catch(console.log);
      }
    });
  }
});

ReactDOM.render(<App />, document.querySelector('#app'));
