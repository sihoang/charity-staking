import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import axios from 'axios';


const styles = theme => ({
  root: {
  },
  results: {
    marginTop: theme.spacing.unit,
  },
});

class SearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      charities: [],
    };

    this.queryDataByName = this.queryDataByName.bind(this);
  }

  onStateChange() {
    return debounce(({ inputValue }) => {
      if (typeof inputValue !== 'undefined') {
        console.log(`debounced ${inputValue}`);
        this.queryDataByName(inputValue);
      }
    }, 500);
  }

  getSuggestions(charities, inputValue) {
    return charities.filter(
      item => (
        !inputValue
        || item.name.toLowerCase().includes(inputValue.toLowerCase())
      ),
    );
  }

  queryDataByName(name) {
    axios.get(
      `http://localhost:8001/charities?name=${name}`,
    ).then((res) => {
      const charities = res.data.records;
      this.setState({ charities });
    });
  }

  renderSuggestion({
    item, index, itemProps, highlightedIndex, selectedItem,
  }) {
    const isHighlighted = highlightedIndex === index;
    const isSelected = selectedItem === item;

    return (
      <MenuItem
        {...itemProps}
        key={item.name}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 'bold' : 'normal',
        }}
      >
        {item.name}
      </MenuItem>
    );
  }

  render() {
    const { classes } = this.props;
    const { charities } = this.state;
    return (
      <Downshift
        // TODO: onSelected should cancel onStateChange so that
        // it does not do additional query for the selected item
        onChange={selection => console.log(`You have selected ${selection.name}`)}
        itemToString={item => (item ? item.name : '')}
        onStateChange={this.onStateChange()}
      >
        {
          ({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex,
            selectedItem,
          }) => (
            <div className={classes.root}>
              <TextField
                fullWidth
                label="Enter your favorite non-profit's name"
                type="search"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                {...getInputProps()}
              />
              {isOpen ? (
                <Paper square className={classes.results}>
                  {
                    this.getSuggestions(charities, inputValue)
                      .map((item, index) => this.renderSuggestion({
                        item,
                        index,
                        itemProps: getItemProps({
                          item,
                          index,
                        }),
                        highlightedIndex,
                        selectedItem,
                      }))
                  }
                </Paper>
              ) : null}
            </div>
          )
        }
      </Downshift>
    );
  }
}

export default withStyles(styles)(SearchInput);
