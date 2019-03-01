import React, { Component } from 'react';
import Home from './Components/Home';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends Component {

    render() {
      return (
        <Router>
          <div>
            {/* <Header /> */}
    
            <Route exact path="/" component={Home} />
          </div>
        </Router>
      )
    }
}

export default App;