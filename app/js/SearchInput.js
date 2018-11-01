import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Icon from '@material-ui/core/Icon';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Downshift from 'downshift';
import debounce from 'lodash.debounce';
import axios from 'axios';


const styles = theme => ({
  root: {
    borderStyle: 'solid',
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    pointerEvents: 'none',
    textAlign: 'right',
  },
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

  queryDataByName(name) {
    axios.get(
      `http://localhost:8001/charities?name=${name}`,
    ).then((res) => {
      const charities = res.data.records;
      this.setState({ charities });
    });
  }

  render() {
    const { classes } = this.props;
    const { charities } = this.state;
    return (
      <Downshift
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
                <div className={classes.searchIcon}>
                  <Icon>search</Icon>
                </div>
                <InputBase
                  placeholder="Search your favorite NPO..."
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputText,
                  }}
                  {...getInputProps()}
                />
              </Toolbar>
              {isOpen ? (
                <div>
                  {charities
                    .filter(
                      item => (
                        !inputValue
                        || item.name.toLowerCase().includes(inputValue.toLowerCase())
                      ),
                    )
                    .map((item, index) => (
                      <div
                        {...getItemProps({
                          key: item.name,
                          index,
                          item,
                          style: {
                            backgroundColor:
                        highlightedIndex === index ? 'lightgray' : 'white',
                            fontWeight: selectedItem === item ? 'bold' : 'normal',
                          },
                        })}
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              ) : null}
            </div>
          )
        }
      </Downshift>
    );
  }
}

export default withStyles(styles)(SearchInput);
