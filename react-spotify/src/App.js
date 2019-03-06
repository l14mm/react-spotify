import React from "react";
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles
} from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";
import grey from "@material-ui/core/colors/grey";
import Home from "./Components/Home";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from "./reducers/index";

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: grey[900]
    },
    secondary: {
      main: "#FFF"
    },
    background: {
      main: grey[900]
    }
  },
  typography: {
    useNextVariants: true
  }
});

const styles = {
  App: {
    display: "flex",
    flexDirection: "column",
    height: "100vh"
  }
};

const App = ({ classes }) => {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <div className={classes.App}>
            <Route exact path="/" component={Home} />
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
};

export default withStyles(styles)(App);
