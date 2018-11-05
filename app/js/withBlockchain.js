import React from 'react';
import EmbarkJS from 'Embark/EmbarkJS';
import TRST from 'Embark/contracts/TRST';
import Typography from '@material-ui/core/Typography';

// 1 TRST = 1e6 wei = 1 mwei
const getTrstBalance = account => TRST
  .methods
  .balanceOf(account)
  .call()
  .then(rawBalance => web3.utils.fromWei(rawBalance, 'mwei'));

const withBlockchain = ChildComponent => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockchainError: null,
      web3: null,
      account: null,
      networkId: 'loading',
      trstBalance: 'loading',
    };
  }

  componentDidMount() {
    EmbarkJS.onReady((err) => {
      if (err) {
        this.setState({
          blockchainError: err.message || err,
        });
        return;
      }

      const { web3 } = EmbarkJS.Blockchain;

      // Fetch account info
      Promise.all([
        web3.eth.net.getId(),
        web3.eth.getAccounts(),
      ]).then(([networkId, accounts]) => {
        this.setState({
          networkId: networkId.toString(),
          account: accounts[0],
          web3,
        });
        getTrstBalance(accounts[0]).then((trstBalance) => {
          this.setState({ trstBalance });
        });
      });

      // Setup hook/listner to the web3 changes
      web3.currentProvider.publicConfigStore.on('update', (newData) => {
        const { account, networkId } = this.state;
        const { selectedAddress, networkVersion } = newData;
        if (selectedAddress.toLowerCase() !== account.toLowerCase()) {
          this.setState({
            account: selectedAddress,
          });
        }

        if (networkVersion !== networkId) {
          this.setState({
            networkId: networkVersion,
          });
        }

        getTrstBalance(account).then((trstBalance) => {
          this.setState({ trstBalance });
        });
      });
    });
  }

  render() {
    const { web3 } = this.state;
    return !web3
      ? <Typography>Status: Cannot find Web3. Please install Metamask!</Typography>
      : <ChildComponent {...this.props} blockchain={this.state} />;
  }
};

export default withBlockchain;
