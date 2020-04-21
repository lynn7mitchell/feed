import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import axios from "axios";
import authenticate from "../utils/Authenticate";
import setAuthToken from "../utils/setAuthtoken";

export class Login extends Component {
  constructor() {
    super();
    this.state = {
      redirect: false,
      email: "",
      password: "",
      errors: {}
    };
  }
  componentDidMount() {
    const token = localStorage.getItem("example-app");

    if (authenticate(token)) {
      this.setState({
        redirect: true
      });
    }
  }

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const newUser = {
      email: this.state.email,
      password: this.state.password
    };


    axios
      .post("/api/user/login", newUser)
      .then(response => {
        if (response.data.token) {
          const { token } = response.data;

          localStorage.setItem("example-app", token);
          setAuthToken(token);
        }
        this.setState({
          redirect: true,
          errors: {}
        });
      })
      .catch(err =>
        this.setState({
          errors: err.response.data
        })
      );
  };
  render() {
    const styles = {
      logo: {
        display: "block",
        margin: "0 auto",
        width: "28vw"
      },
      error: {
        color: "#cc0000",
        fontSize: "0.8rem",
        margin: 0
      },
      main: {
        textAlign: "center",
        marginTop: "25vh"
      },
      signupLink: {
        color: "#26a69a"
      }
    };

    const { errors } = this.state;

    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }
    return (
      <div style={styles.main}>
        <Link to={{ pathname: "/" }}>
          <i className="material-icons back-button">arrow_back</i>
        </Link>
        <div className="container">
          <h1>Log In</h1>
          <div className="row">
            <form onSubmit={this.onSubmit}>
              
                  <input
                    id="email"
                    type="email"
                    className="validate"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChange}
                  />
                  <label htmlFor="email">Email</label>
                
                {errors.user && <div style={styles.error}>{errors.user}</div>}
          

              
                  <input
                    id="password"
                    type="password"
                    className="validate"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChange}
                  />
                  <label htmlFor="password">Password</label>
                {errors.password && (
                  <div style={styles.error}>{errors.password}</div>
                )}
                <button
                  type="submit"
                  name="action"
                >
                  Submit
                  <i className="material-icons right">send</i>
                </button>
                <p>
                  Don't have an account?{" "}
                  <a href="/SignUp" style={styles.signupLink}>
                    Click here to sign up!
                  </a>
                </p>
              <div className="row">
                <p>Demo Login:</p>
                <p>Email: test@gmail.com</p>
                <p>Password: test</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
