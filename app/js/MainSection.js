import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dashboard from './Dashboard';

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
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Typography align="center" variant="h1">Stake your TRST</Typography>
          </Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Dashboard />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MainSection);
