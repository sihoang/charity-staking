import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    paddingTop: theme.mixins.toolbar.minHeight * 2,
    paddingBottom: theme.mixins.toolbar.minHeight * 2,
  },
  primary: {
    backgroundColor: theme.palette.primary.main,
  },
  default: {
    backgroundColor: theme.palette.primary.light,
  },
});

class Section extends React.Component {
  render() {
    const {
      classes, children, primary, className,
    } = this.props;
    const customClass = primary ? classes.primary : classes.default;
    return (
      <div className={classnames(classes.root, customClass, className)}>
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Section);
