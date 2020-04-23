import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./style.css";

import Login from "../../components/LoginSignup/Login";
import SignUp from "../../components/LoginSignup/SignUp";

export class Home extends Component {
  state = {
    loginForm: true,
    formSwitch: (formSwitch) => {
      console.log("clicked");

      if (this.state.loginForm === true) {
        this.setState({
          loginForm: false,
        });
      } else if (this.state.loginForm === false) {
        this.setState({
          loginForm: true,
        });
      }
    },
  };

  render() {
    let LSform;
    let LSbutton;

    if (this.state.loginForm) {
      LSform = <Login className="login" formSwitch={this.state.formSwitch} />;
      LSbutton= <button className="form-switch-button" onClick={this.state.formSwitch}>SIGN UP</button>
    } else {
      LSform = <SignUp className="signup" formSwitch={this.state.formSwitch} />;
      LSbutton= <button className="form-switch-button" onClick={this.state.formSwitch}>LOG IN</button>
    }
    return (
      <div>
        {LSbutton}
        <h1>FEED</h1>
        <h2>Giving YOU more control of your feed</h2>

        {LSform}

        {/* <button onClick={(e)=>{formSwitch(e)}}>test</button> */}
        {/* <Link to={"/login"}><button>Log In</button></Link>
        <Link to={"/signup"}><button> Sign Up</button></Link>
        <p>Demo Login:</p>
        <p>Email: test@gmail.com</p>
        <p>Password: test</p> */}
      </div>
    );
  }
}

export default Home;
