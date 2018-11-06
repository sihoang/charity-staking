import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import SearchInput from './SearchInput';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';
import NPOInfo from './NPOInfo';
import withBlockchain from './withBlockchain';

const styles = theme => ({
  root: {
    margin: `${theme.mixins.toolbar.minHeight}px auto`,
    maxWidth: theme.breakpoints.values.md,
  },
  input: {
    padding: theme.spacing.unit * 2,
  },
  button: {
    padding: theme.spacing.unit * 2,
  },
  buttonGrid: {
    marginTop: theme.mixins.toolbar.minHeight,
  },
});

class StakeNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      npo: {},
      durationInDays: 30,
      amount: 100,
      errorMessage: null,
    };
    this.onSelectedNpo = this.onSelectedNpo.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.handleStakeNow = this.handleStakeNow.bind(this);
  }

  onSelectedNpo(data) {
    this.setState({
      npo: data,
    });
  }

  onChangeAmount(event) {
    this.setState({
      amount: event.target.value,
    });
  }

  onChangeDuration(event) {
    this.setState({
      durationInDays: event.target.value,
    });
  }

  handleStakeNow(e) {
    e.preventDefault();

    const err = this.validateInput(this.props, this.state);
    if (err) {
      window.clearTimeout(this.timeOut);
      this.setState({
        errorMessage: err,
      });
      this.timeOut = window.setTimeout(() => this.setState({
        errorMessage: null,
      }), 2000);
    }
  }

  validateInput(props, state) {
    const {
      web3, account, trstBalance, networkId, EmbarkJS,
    } = props.blockchain;
    const { amount, npo, durationInDays } = state;

    if (!web3) {
      return 'Cannot find Web3. Please install metamask.';
    }

    if (!account) {
      return 'Please unlock your account.';
    }

    const { BN } = web3.utils;
    const trstBalanceBN = new BN(trstBalance);
    const amountBN = new BN(amount);
    if (amountBN.lte(0)) {
      return 'Amount must be positive.';
    }
    if (trstBalanceBN.lt(amountBN)) {
      return 'Your TRST balance is not sufficient.';
    }

    if (!durationInDays) {
      return 'Please select a lock-up duration.';
    }

    if (!npo.ein) {
      return 'Please choose your favorite NPO.';
    }

    // TODO validate network id
    if (EmbarkJS.environment === 'testnet') {
      if (networkId !== '4') {
        return 'Please use Rinkeby network.';
      }
    }

    if (EmbarkJS.environment === 'livenet') {
      if (networkId !== '1') {
        return 'Please use Main Ethereum network.';
      }
    }
    return null;
  }

  renderGridItem(props, child) {
    const { classes } = props;
    return (
      <Grid
        item
        className={classes.input}
        sm={12}
        md={6}
      >
        {child}
      </Grid>
    );
  }

  renderButton(props, text) {
    const {
      classes, color, component, onClick,
    } = props;
    return (
      <Grid
        item
        sm={6}
        md={3}
        className={classes.button}
      >
        <Button
          fullWidth
          color={color}
          onClick={onClick}
          component={component}
          variant="contained"
        >
          {text}
        </Button>
      </Grid>
    );
  }

  renderErrorMessage(errorMessage) {
    return (
      <Grid
        container
        justify="center"
      >
        <Typography color="error">
          {errorMessage}
        </Typography>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      npo, amount, durationInDays, errorMessage,
    } = this.state;
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
        >
          {this.renderGridItem(
            this.props,
            <StakeAmountInput
              amount={amount}
              onChange={this.onChangeAmount}
            />,
          )}
          {this.renderGridItem(
            this.props,
            <StakeDurationInput
              duration={durationInDays}
              onChange={this.onChangeDuration}
            />,
          )}
        </Grid>

        <SearchInput onSelected={this.onSelectedNpo} />
        { npo.name
            && <NPOInfo data={npo} />
        }

        <Grid
          container
          direction="row"
          justify="center"
          className={classes.buttonGrid}
        >
          {errorMessage && this.renderErrorMessage(errorMessage)}
          {this.renderButton({
            ...this.props,
            onClick: this.handleStakeNow,
            color: 'primary',
          }, 'Stake Now')}

          {this.renderButton({
            ...this.props,
            component: props => <Link smooth to="#faq-section"><Button {...props} /></Link>,
          }, 'Learn more')}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(withBlockchain(StakeNow));
