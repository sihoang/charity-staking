import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit * 4,
  },
});

class NumberCard extends React.Component {
  render() {
    const {
      title, mainNumber, mainUnit, subText, classes,
    } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography gutterBottom color="secondary" variant="h6">
            {title}
          </Typography>
          <Typography gutterBottom variant="h5">
            {mainNumber}
            {' '}
            {mainUnit}
          </Typography>
          {
          subText
          && (
          <Typography color="textSecondary" variant="subtitle1">
            {subText}
          </Typography>
          )
          }
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(NumberCard);
