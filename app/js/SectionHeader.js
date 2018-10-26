import React from 'react';
import Typography from '@material-ui/core/Typography';

class SectionHeader extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Typography color="secondary" variant="h2" align="center">{children}</Typography>
    );
  }
}

export default SectionHeader;
