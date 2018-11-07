import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import NumberCard from './NumberCard';
import TRSTIcon from './TRSTIcon';

const styles = {
  root: {
    margin: 'auto',
  },
};


class Dashboard extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <NumberCard
          title="Current Stakes"
          mainNumber="7,000,000"
          mainUnit={<TRSTIcon />}
        />
        <NumberCard
          title="Avarage stake"
          mainNumber="1,670"
          mainUnit={<TRSTIcon />}
          subText="$21,310"
        />
        <NumberCard
          title="Current stakers"
          mainNumber="1,670"
          mainUnit={<Icon>people</Icon>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
