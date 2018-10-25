import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar';

const styles = {
  grow: {
    flexGrow: 1,
  },
  brandImage: {
    height: '1.5rem',
  },
};

class HomePage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar>
          <Toolbar>
            <div className={classes.grow}>
              <img src="images/logo-trimmed.png" alt="WeTrust" className={classes.brandImage} />
            </div>
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
