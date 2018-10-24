import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = {
  grow: {
    flexGrow: 1,
  },
};

class HomePage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              WeStake
            </Typography>
            <Tabs
              indicatorColor="primary"
              fullWidth
            >
              <Tab label="Stake" />
              <Tab label="Unstake" />
              <Tab label="Dashboard" />
              <Tab label="FAQ" />
            </Tabs>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(HomePage);
