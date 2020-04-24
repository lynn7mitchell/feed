import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./login-signup.css";

export class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("api/user", newUser)
      .then(console.log("Thanks for signing up"))
      .catch((err) => console.log(err));

    alert("Thank you for signing up!");
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
    return (
      <div style={styles.main}>
        <div className="container">
          <div>
            <h3>SIGN UP</h3>
            <form onSubmit={this.onSubmit}>
              <div>
                <input
                  placeholder="First Name"
                  id="first_name"
                  type="text"
                  className="form-field"
                  name="firstName"
                  onChange={this.onChange}
                />
              </div>
              <div>
                <input
                  placeholder="Last Name"
                  id="first_name"
                  type="text"
                  className="form-field"
                  name="lastName"
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
