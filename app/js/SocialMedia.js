import React from 'react';
import classnames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
  item: {
    display: 'flex',
    flexFlow: 'row wrap',
    alignItems: 'strech',
    background: theme.palette.primary.main,
  },
  href: {
    color: theme.palette.secondary.main,
  },
  fab: {
    fontSize: '3em',
  },
});

class SocialMedia extends React.Component {
  constructor(props) {
    super(props);
    this.renderSocialItem = this.renderSocialItem.bind(this);
  }

  renderSocialItem(faName, href) {
    const { classes } = this.props;
    return (
      <Grid item className={classes.item}>
        <a
          className={classes.href}
          target="_blank"
          rel="noopener noreferrer"
          href={href}
        >
          <Icon
            className={classnames(classes.fab, `fab fa-${faName}`)}
          />
        </a>
      </Grid>
    );
  }

  render() {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={8}
      >
        {this.renderSocialItem('facebook-square', 'https://www.facebook.com/wetrustplatform')}
        {this.renderSocialItem('twitter-square', 'https://twitter.com/wetrustplatform')}
        {this.renderSocialItem('medium', 'https://medium.com/wetrust-blog')}
        {this.renderSocialItem('reddit-square', 'https://www.reddit.com/r/WeTrustPlatform')}
        {this.renderSocialItem('github-square', 'https://github.com/wetrustplatform')}
      </Grid>
    );
  }
}

export default withStyles(styles)(SocialMedia);
