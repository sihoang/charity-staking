import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Dashboard from './Dashboard';
import Section from './Section';
import StakeNow from './StakeNow';

const styles = {
  container: {
    minHeight: '80vh',
  },
};

class MainSection extends React.Component {
  render() {
    const { classes, color } = this.props;
    return (
      <Section
        color={color}
        className={classes.container}
      >
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item xs={12} sm={12} md={12} lg={8}>
            <Typography align="center" variant="h1">Stake your TRST</Typography>
            <StakeNow />
          </Grid>
          <Grid item xs={12} sm={8} md={6} lg={4}>
            <Dashboard />
          </Grid>
        </Grid>
      </Section>
    );
  }
}

export default withStyles(styles)(MainSection);
