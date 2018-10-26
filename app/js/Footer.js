import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    minHeight: theme.mixins.toolbar.minHeight,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class Footer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography>© 2018 WeTrustPlatform. All rights reserved.</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
