import React, { Component } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Components/Home";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2c387e"
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
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
      </MuiThemeProvider>
    );
  }
}

export default App;
