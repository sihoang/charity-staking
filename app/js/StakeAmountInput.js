import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

class StakeAmountInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: props.defaultAmount || 100,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      amount: event.target.value,
    });

    // trigger parent's onChange
    const { onChange } = this.props;
    if (onChange) {
      onChange(event);
    }
  }

  render() {
    const { amount } = this.state;
    return (
      <div>
        <TextField
          fullWidth
          label="Enter an amount"
          onChange={this.handleChange}
          value={amount}
          type="number"
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
