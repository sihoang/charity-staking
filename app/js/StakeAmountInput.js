import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class StakeAmountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 100,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      amount: event.target.value,
    });
  }

  render() {
    const { amount } = this.state;
    return (
      <div>
        <TextField
          fullWidth
          label="Enter the amount"
          onChange={this.handleChange}
          value={amount}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">TRST</InputAdornment>,
          }}
        />
      </div>
    );
  }
}

export default StakeAmountInput;
