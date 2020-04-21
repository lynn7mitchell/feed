import React, { Component } from "react";
import { Link } from "react-router-dom"

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>MERN TEMPLATE</h1>
        <Link to={"/login"}><button>Log In</button></Link>
        <Link to={"/signup"}><button> Sign Up</button></Link>
        <p>Demo Login:</p>
        <p>Email: test@gmail.com</p>
        <p>Password: test</p>
      </div>
    );
  }
}

export default Home;
