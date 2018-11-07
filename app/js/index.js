import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import TRST from 'Embark/contracts/TRST';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import web3App from './reducers';
import theme from './theme';
import HomePage from './HomePage';
import {
  findWeb3, unlockAccount, findNetworkId, lockAccount, findTrstBalance,
} from './actions';

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

EmbarkJS.onReady(() => {
  store.dispatch(findWeb3(web3));
  web3.eth.getAccounts().then((accounts) => {
    if (accounts[0]) {
      store.dispatch(unlockAccount(accounts[0].toLowerCase()));
      TRST.methods.balanceOf(accounts[0]).call()
        .then((trstBalance) => {
          store.dispatch(findTrstBalance(trstBalance));
        });
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
        store.dispatch(unlockAccount(selectedAddress));
      }
      if (networkId !== networkVersion) {
        store.dispatch(findNetworkId(networkVersion));
      }
      TRST.methods.balanceOf(selectedAddress).call()
        .then((trstBalance) => {
          store.dispatch(findTrstBalance(trstBalance));
        });
    });
  }
});

ReactDOM.render(<App />, document.querySelector('#app'));
