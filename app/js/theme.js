import { createMuiTheme } from '@material-ui/core/styles';

// https://material.io/tools/color/#!/?view.left=0&view.right=0&secondary.color=4DB6AC&secondary.text.color=FAFAFA&primary.color=F5F5F5&primary.text.color=26A69A
//
const theme = createMuiTheme({
  palette: {
    primary: { main: '#F5F5F5', contrastText: '#26A69A' },
    secondary: { main: '#4DB6AC', contrastText: '#FAFAFA' },
    text: {
      primary: '#616161',
    },
  },
  typography: {
    useNextVariants: true,
  },
});

export default theme;
