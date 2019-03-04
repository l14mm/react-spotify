import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import rootReducer from "./reducers/index";

const store = createStore(rootReducer, applyMiddleware(reduxThunk));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000063"
    },
    secondary: {
      main: "#FFF"
    }
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <Router>
            <div
              className="App"
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh"
              }}
            >
              <Header />
              <Route exact path="/" component={Home} />
            </div>
          </Router>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
