import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./utils/PrivateRoute";
import NoMatch from "./pages/NoMatch";
// import Login from "./pages/Login";
// import SignUp from "./components/SignUp";
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import Settings from './pages/Settings/Settings';
import Home from "./pages/Home/Home";
import Post from './pages/Post/Post'
export class App extends Component {
  render() {
    return (
      <div>
        
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            {/* <Route exact path="/signup" component={SignUp} /> */}
            {/* <Route exact path="/login" component={Login}/> */}
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/profile/:id" component={Profile} />
            <PrivateRoute exact path='/settings' component={Settings} />
            <Route exact path='/post/:id' component={Post} />
            <Route exact component={NoMatch} />
          </Switch>
        </Router>

      </div>
    );
  }
}

export default App;
