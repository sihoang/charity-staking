import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import axios from 'axios';


const styles = theme => ({
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputText: {
    padding: theme.spacing.unit,
    transition: theme.transitions.create('width'),
    width: '100%',
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
            <div>
              <Toolbar classes={{
                root: classes.root,
              }}
              >
                <Icon>search</Icon>
                <InputBase
                  placeholder="Search..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputText,
                  }}
                  {...getInputProps()}
                />
              </Toolbar>
              {isOpen ? (
                <Paper square className={classes.paper}>
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
