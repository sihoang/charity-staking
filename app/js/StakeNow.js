import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
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
    };
    this.onSelectedNpo = this.onSelectedNpo.bind(this);
    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
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
    const { classes, color, component } = props;
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
          component={component}
          variant="contained"
        >
          {text}
        </Button>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    const { npo, amount, durationInDays } = this.state;
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center"
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
          alignItems="center"
          alignContent="center"
        >
          {this.renderButton({
            ...this.props,
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
