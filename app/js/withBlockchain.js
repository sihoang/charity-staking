import React from 'react';
import EmbarkJS from 'Embark/EmbarkJS';
import Typography from '@material-ui/core/Typography';

const withBlockchain = ChildComponent => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockchainError: null,
      web3: null,
      account: null,
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
      web3.currentProvider.publicConfigStore.on('update', (event) => {
        console.log(event);
      });
      this.setState({ web3 });
      web3.eth.getAccounts().then((results) => {
        this.setState({ account: results[0] });
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
