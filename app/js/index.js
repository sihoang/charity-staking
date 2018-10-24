import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import HomePage from './HomePage';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <HomePage />
    </MuiThemeProvider>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
