import React from 'react';
import ReactDOM from 'react-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import HomePage from './HomePage';
import '../css/main.css';


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
