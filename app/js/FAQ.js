import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const styles = {
  root: {
    minHeight: '70vh',
  },
};

class FAQ extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Typography variant="h1" align="center">FAQ</Typography>
      </div>
    );
  }
}

export default withStyles(styles)(FAQ);
