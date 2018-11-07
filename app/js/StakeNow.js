import React from 'react';
import { connect } from 'react-redux';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@material-ui/core/Icon';
import TimeLockedStaking from 'Embark/contracts/TimeLockedStaking';
import SearchInput from './SearchInput';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';
import NPOInfo from './NPOInfo';
import loadContract from './loadContract';

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

const status = {
  PENDING: 'PENDING',
  NOT_STARTED: 'NOT_STARTED',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};
class StakeNow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      npo: {},
      durationInDays: 30,
      amount: 100,
      errorMessage: null,
      isStaking: false,
      approvalStatus: status.NOT_STARTED,
      stakingStatus: status.NOT_STARTED,
    };
    this.onSelectedNpo = this.onSelectedNpo.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.handleStakeNow = this.handleStakeNow.bind(this);
    this.setErrorMessage = this.setErrorMessage.bind(this);
    this.renderStakingSteps = this.renderStakingSteps.bind(this);
    this.setApprovalSuccess = this.setApprovalSuccess.bind(this);
    this.setApprovalFailure = this.setApprovalFailure.bind(this);
    this.setStakingSuccess = this.setStakingSuccess.bind(this);
    this.setStakingFailure = this.setStakingFailure.bind(this);
    this.renderStakingSteps = this.renderStakingSteps.bind(this);
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

  setErrorMessage(err) {
    window.clearTimeout(this.timeOut);
    this.setState({
      errorMessage: err,
    });
    this.timeOut = window.setTimeout(() => this.setState({
      errorMessage: null,
    }), 5000);
  }

  setApprovalSuccess() {
    this.setState({
      approvalStatus: status.SUCCESS,
      stakingStatus: status.PENDING,
    });
  }

  setApprovalFailure(err) {
    this.setState({
      approvalStatus: status.FAILURE,
      stakingStatus: status.FAILURE,
    });
    this.setErrorMessage(err.message || 'Error while approving TRST transfer.');
  }

  setStakingSuccess() {
    this.setState({
      stakingStatus: status.SUCCESS,
    });
  }

  setStakingFailure(err) {
    this.setState({
      stakingStatus: status.FAILURE,
    });
    this.setErrorMessage(err.message || 'Error while calling Stake contract.');
  }

  startStaking() {
    this.setState({
      isStaking: true,
      approvalStatus: status.PENDING,
      stakingStatus: status.NOT_STARTED,
    });
  }

  handleStakeNow(e) {
    e.preventDefault();

    const inputError = this.validateInput(this.props, this.state);
    if (inputError) {
      this.setErrorMessage(inputError);
      return;
    }

    this.startStaking();

    const { amount } = this.state;
    const stakeAmount = web3.utils.toWei(amount.toString(), 'mwei');
    loadContract('TRST')
      .methods
      .approve(TimeLockedStaking.address, stakeAmount)
      .send()
      .then(() => {
        this.setApprovalSuccess();
        loadContract('TimeLockedStaking').methods.stake(stakeAmount, '0x').send()
          .then(() => {
            this.setStakingSuccess();
            console.log('Thanks for staking!');
          })
          .catch((err) => {
            this.setStakingFailure(err);
          });
      })
      .catch((err) => {
        this.setApprovalFailure(err);
      });
  }


  validateInput(props, state) {
    const {
      hasWeb3, account, trstBalance, networkId,
    } = props;
    const { amount, npo, durationInDays } = state;

    if (!hasWeb3) {
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

  renderStatusIcon(currentStatus) {
    let className;
    switch (currentStatus) {
      case status.SUCCESS:
        className = 'fa fa-check-circle';
        break;
      case status.FAILURE:
        className = 'fa fa-exclamation-circle';
        break;
      case status.NOT_STARTED:
        className = 'fa fa-circle';
        break;
      default:
        className = 'fas fa-spinner fa-pulse';
    }

    return (
      <ListItemIcon>
        <Icon className={className} />
      </ListItemIcon>
    );
  }

  renderStep(number, text, currentStatus) {
    return (
      <ListItem>
        {this.renderStatusIcon(currentStatus)}
        <ListItemText
          primary={`Step ${number}: ${text}`}
          primaryTypographyProps={{
            variant: 'subtitle1',
          }}
        />
      </ListItem>
    );
  }

  renderStakingSteps() {
    const { approvalStatus, stakingStatus } = this.state;
    return (
      <Grid
        container
        justify="center"
      >
        <List>
          {this.renderStep(1, 'Approve TRST transfer.', approvalStatus)}
          {this.renderStep(2, 'Calling Stake contract.', stakingStatus)}
        </List>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const {
      npo, amount, durationInDays, errorMessage, isStaking,
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
          {isStaking && this.renderStakingSteps()}
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

const mapStateToProps = state => ({
  account: state.account,
  networkId: state.networkId,
  trstBalance: state.trstBalance,
  hasWeb3: state.hasWeb3,
});

export default connect(mapStateToProps)(withStyles(styles)(StakeNow));
