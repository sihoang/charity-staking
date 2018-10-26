import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Section from './Section';
import SectionHeader from './SectionHeader';

const styles = {
  root: {
    minHeight: '70vh',
  },
};

class FAQ extends React.Component {
  render() {
    const { classes, className } = this.props;
    return (
      <Section primary className={classnames(classes.root, className)}>
        <SectionHeader>FAQ</SectionHeader>
      </Section>
    );
  }
}

export default withStyles(styles)(FAQ);
