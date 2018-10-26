import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = {
  container: {
    minHeight: '100vh',
  },
};

class MainSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.container}
        >
          <Grid item xs={8}>
            <Typography align="center" variant="h1">Stake your TRST</Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="center" variant="h1">Right</Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MainSection);
