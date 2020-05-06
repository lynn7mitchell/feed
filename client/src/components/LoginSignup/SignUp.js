import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login-signup.css";

export class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("api/user", newUser)
      .then((res) =>{
        this.setState({
          errors: {
            errors: 'none'
          },
        })
        alert("Thanks for signing up!")
      })
      .catch((err) =>
        this.setState({
          errors: err.response.data,
        })
      );

     

  };

  render() {
    const styles = {
      logo: {
        display: "block",
        margin: "0 auto",
        width: "28vw",
      },
      error: {
        color: "#cc0000",
        fontSize: "0.8rem",
        margin: 0,
      },
      main: {
        textAlign: "center",
      },
      signupLink: {
        color: "#26a69a",
      },
    };
    const { errors } = this.state;
    return (
      <div style={styles.main}>
        <div className="container">
          <div>
            <h3>SIGN UP</h3>
            <form onSubmit={this.onSubmit}>
               {errors.email && <div style={styles.error}>{errors.email}</div>}
              <div>
                <input
                  placeholder="Username"
                  id="username"
                  type="text"
                  className="form-field"
                  name="username"
                  onChange={this.onChange}
                />
              </div>

              <div>
             
                <input
                  placeholder="Email"
                  id="email"
                  type="email"
                  className="form-field"
                  name="email"
                  onChange={this.onChange}
                />
              </div>
             
              <div>
                <input
                  placeholder="Password"
                  id="password"
                  type="password"
                  className="form-field"
                  name="password"
                  onChange={this.onChange}
                />
              </div>
              
              <button type="submit" name="action">
                SIGN UP
              </button>
              <p>
                Already have an account?{" "}
                <span
                  onClick={this.props.formSwitch}
                  href="/SignUp"
                  className="signup-link"
                >
                  Click here to log in!
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default SignUp;
