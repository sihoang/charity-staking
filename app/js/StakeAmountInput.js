import React from 'react';
import TextField from '@material-ui/core/TextField';

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
          type="number"
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
    );
  }
}

export default StakeAmountInput;
