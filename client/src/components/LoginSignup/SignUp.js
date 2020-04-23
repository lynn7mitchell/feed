import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export class SignUp extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
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
      .catch(err => console.log(err));

      alert("Thank you for signing up!")
  };

  render() {
    const styles = {
      logo: {
        display: "block",
        margin: "0 auto",
        paddingBottom: "15px",
        width: "28vw"
      },
      main: {
        textAlign: "center",
        marginTop: "25vh"
      }
    };
    return (
      <div style={styles.main}>
        <Link to={{ pathname: "/" }}>
          <i className="material-icons back-button">arrow_back</i>
        </Link>
        <div>
          <h3>Sign Up</h3>
            <form  onSubmit={this.onSubmit}>
                <div>
                <label htmlFor="last_name">First Name</label>
                  <input
                    placeholder="First Name"
                    id="first_name"
                    type="text"
                    className="validate"
                    name="firstName"
                    onChange={this.onChange}
                  />
                 
                </div>
                <div>
                  <input
                    placeholder="Last Name"
                    id="first_name"
                    type="text"
                    className="validate"
                    name="lastName"
                    onChange={this.onChange}
                  />
                  <label htmlFor="first_name">Last Name</label>
                </div>

                <div>
                  <input
                    placeholder="Email"
                    id="email"
                    type="email"
                    className="validate"
                    name="email"
                    onChange={this.onChange}
                  />
                  <label htmlFor="email">Email</label>
                </div>

                <div>
                  <input
                    placeholder="Password"
                    id="password"
                    type="password"
                    className="validate"
                    name="password"
                    onChange={this.onChange}
                  />
                  <label htmlFor="password">Password</label>
                </div>
                  <button
                    type="submit"
                    name="action"
                  >
                    Submit
                    <i className="material-icons right">send</i>
                  </button>
                  <p>
                  Already have an account?{" "}
                  <span onClick={this.props.formSwitch} href="/SignUp" style={styles.signupLink}>
                    Click here to log in!
                  </span>
                </p>
            </form>
        </div>
      </div>
    );
  }
}

export default SignUp;
