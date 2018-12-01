import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import Section from './Section';
import SectionHeader from './SectionHeader';

const styles = theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
    maxWidth: theme.breakpoints.values.lg,
    margin: 'auto',
  },
  table: {
    minWidth: 700,
  },
  unstake: {
    margin: `${theme.mixins.toolbar.minHeight}px auto`,
    textAlign: 'center',
  },
});

class ActivitiesSection extends React.Component {
  renderNoActivities() {
    return (
      <TableRow>
        <TableCell>
          No activities
        </TableCell>
      </TableRow>
    );
  }

  render() {
    const { classes, color } = this.props;
    return (
      <Section id="activities-section" color={color}>
        <SectionHeader>Staking Activities</SectionHeader>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  NPO Name
                </TableCell>
                <TableCell>
                  Amount (TRST)
                </TableCell>
                <TableCell>
                  Locked Until
                </TableCell>
                <TableCell>
                  Created At
                </TableCell>
                <TableCell>
                  Transaction Receipt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody />
          </Table>
        </Paper>
        <div className={classes.unstake}>
          <Button
            variant="contained"
            color="disabled"
            disabled
          >
            Unstake
          </Button>
        </div>
      </Section>
    );
  }
}

export default withStyles(styles)(ActivitiesSection);
