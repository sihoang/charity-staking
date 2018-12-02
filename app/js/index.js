import React from 'react';
import ReactDOM from 'react-dom';
import EmbarkJS from 'Embark/EmbarkJS';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import web3App from './reducers';
import theme from './theme';
import HomePage from './HomePage';
import {
  findWeb3, unlockAccount, findNetworkId, lockAccount,
} from './actions';
import {
  dispatchTRSTBalance,
  dispatchAccountActivities,
} from './dispatch';

import '../css/main.css';

const store = createStore(web3App);
const { dispatch } = store;

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


const onNewAccount = (account) => {
  dispatch(unlockAccount(account));
  dispatchAccountActivities(dispatch, account);
  dispatchTRSTBalance(dispatch, account);
};

EmbarkJS.onReady(() => {
  dispatch(findWeb3());

  web3.eth.getAccounts().then((accounts) => {
    if (accounts[0]) {
      onNewAccount(accounts[0].toLowerCase());
    } else {
      dispatch(lockAccount());
    }
  });

  web3.eth.net.getId().then((networkId) => {
    dispatch(findNetworkId(networkId));
  });

  const { publicConfigStore } = web3.currentProvider;
  if (publicConfigStore) {
  // Setup hook/listner to the web3 changes
    publicConfigStore.on('update', (updates) => {
      const { selectedAddress, networkVersion } = updates;
      if (!selectedAddress) {
        dispatch(lockAccount());
        return;
      }

      const { account, networkId } = store.getState();

      if (account !== selectedAddress) {
        onNewAccount(selectedAddress);
        web3.eth.defaultAccount = selectedAddress;
      }

      if (networkId !== networkVersion) {
        dispatch(findNetworkId(networkVersion));
        dispatchTRSTBalance(dispatch, selectedAddress);
        dispatchAccountActivities(dispatch, selectedAddress);
      }
    });
  }
});

ReactDOM.render(<App />, document.querySelector('#app'));
