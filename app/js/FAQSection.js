import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Section from './Section';
import SectionHeader from './SectionHeader';
import FAQItem from './FAQItem';
import faq from './faq.json';

const styles = theme => ({
  root: {
  },
  container: {
    paddingTop: theme.mixins.toolbar.minHeight,
    margin: 'auto',
    maxWidth: theme.breakpoints.values.md,
  },
});

class FAQ extends React.Component {
  renderFAQItems() {
    return faq.map(item => (
      <FAQItem
        key={item.question}
        question={item.question}
        answer={item.answer}
      />
    ));
  }

  render() {
    const { classes, className, color } = this.props;
    return (
      <Section color={color} className={classnames(classes.root, className)}>
        <SectionHeader>FAQ</SectionHeader>
        <div className={classes.container}>
          {this.renderFAQItems()}
        </div>
      </Section>
    );
  }
}

export default withStyles(styles)(FAQ);
