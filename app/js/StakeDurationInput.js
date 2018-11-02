import React from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import InputAdornment from '@material-ui/core/InputAdornment';

const durations = [
  {
    value: '1',
    label: '1 month',
  },
  {
    value: '6',
    label: '6 months',
  },
  {
    value: '12',
    label: '12 months',
  },
];

class StakeDurationInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: durations[0].value,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      duration: event.target.value,
    });
  }

  render() {
    const { duration } = this.state;
    return (
      <div>
        <TextField
          fullWidth
          select
          value={duration}
          onChange={this.handleChange}
          label="Select a lock-up duration"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Duration</InputAdornment>,
          }}
        >
          {
            durations.map(options => (
              <MenuItem
                key={options.value}
                value={options.value}
              >
                {options.label}
              </MenuItem>
            ))
          }
        </TextField>
      </div>
    );
  }
}

export default StakeDurationInput;
