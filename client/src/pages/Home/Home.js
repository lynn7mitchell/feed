import React, { Component } from "react";
import { Link } from "react-router-dom";
import './style.css'

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>FEED</h1>
        <h2>Giving YOU more control of your feed</h2>
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
