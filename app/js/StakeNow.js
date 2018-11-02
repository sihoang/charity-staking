import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import SearchInput from './SearchInput';
import StakeAmountInput from './StakeAmountInput';
import StakeDurationInput from './StakeDurationInput';

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
    const { classes, color } = props;
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
          variant="contained"
        >
          {text}
        </Button>
      </Grid>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center"
        >
          {this.renderGridItem(this.props, <StakeAmountInput />)}
          {this.renderGridItem(this.props, <StakeDurationInput />)}
        </Grid>

        <SearchInput />

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
          }, 'Stake!')}

          {this.renderButton({
            ...this.props,
          }, 'Learn more')}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(StakeNow);
