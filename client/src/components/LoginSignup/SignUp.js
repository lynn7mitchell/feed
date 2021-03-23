import React, { Component } from "react";
import { Redirect } from "react-router-dom";
// import authenticate from "../../utils/Authenticate";
import setAuthToken from "../../utils/setAuthtoken";
import axios from "axios";
import "./login-signup.css";
import { v4 as uuidv4 } from "uuid";

export class SignUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      bio: "",
      user: {},
      isLoggedIn: false,
      redirect: false,
      profilePicture: false,
      selectedFile: null,
      imageOkay: false,
    };
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = (e) => {
    e.preventDefault();

    // check for strong password
    // /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    // found regex at https://www.w3resource.com/javascript/form/password-validation.php
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
    if (passwordRegex.test(this.state.password) !== true) {
      console.log("works");
      this.setState({
        errors: {
          password:
            "Password must be at least 8 characters and have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
      });
      return this.state.errors;
    }
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ errors: { password: "passwords do not match" } });
      return this.state.errors;
    }

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
    };

    axios
      .post("api/user", newUser)
      .then((res) => {
        this.setState({
          errors: {
            errors: "none",
          },
        });
        // alert("Thanks for signing up!")

        axios
          .post("/api/user/login", newUser)
          .then((response) => {
            if (response.data.token) {
              const { token } = response.data;

              localStorage.setItem("example-app", token);
              setAuthToken(token);
            }
            this.setState({
              user: response.data,
              isLoggedIn: true,
              errors: {},
            });
          })
          .catch((err) =>
            this.setState({
              errors: err.response.data,
            })
          );
      })
      .catch((err) =>
        this.setState({
          errors: err.response.data,
        })
      );
  };

  onBioSubmit = (e) => {
    e.preventDefault();

    if (this.state.bio.length > 150) {
      this.setState({
        errors: { bio: "Please keep bio under 150 characters" },
      });
      return this.state.errors;
    }
    let updatedUser = {
      bio: this.state.bio,
    };
    axios
      .put("/api/user", updatedUser)
      .then((response) => {
        this.setState({
          profilePicture: true,
        });
      })
      .catch((err) =>
        this.setState({
          errors: err.response.data,
        })
      );
  };
  handleSelectedFile = (e) => {
    e.preventDefault();
    this.setState({
      // description: e.target.value,
      selectedFile: e.target.files[0],
    });
    this.setState({
      imageOkay: true,
    });
  };

  onImageSubmit = (e) => {
    e.preventDefault();
    const selectedFile = this.state.selectedFile;
    const extension = "." + selectedFile.name.split(".").pop();
    const newName = uuidv4() + extension;
    // selectedFile.name = newName
    console.log(selectedFile);
    const data = new FormData();
    data.append("file", selectedFile, newName);
    console.log(data);
    const newUser = {
      profile: this.state.user._id,
    };
    axios
      .post("/upload", data)
      .then((res) => {
        this.setState({
          redirect: true,
        });
      })
      .catch((err) => console.log(data, err.response));
  };
  skipImageUpload = e =>{
    e.preventDefault()
    this.setState({
      redirect: true,
    });
  }
  render() {
    const styles = {
      logo: {
        display: "block",
        margin: "0 auto",
        width: "28vw",
      },

      main: {
        textAlign: "center",
      },
      signupLink: {
        color: "#26a69a",
      },
    };
    let ImageSubmitButton;
    if (!this.state.imageOkay) {
      ImageSubmitButton = <input type="submit" disabled />;
    } else {
      ImageSubmitButton = <input type="submit" />;
    }

    const { errors } = this.state;
    if (this.state.redirect) {
      return <Redirect to="/dashboard" />;
    }

    if (this.state.profilePicture) {
      return (
        <div style={styles.main}>
          <div className="container">
            <div>
              <h3>Add A Profile Picture</h3>
              <form
                className="image-upload"
                method="post"
                encType="multipart/form-data"
                onSubmit={this.onImageSubmit}
              >
                <p>
                  <input
                    type="file"
                    accept="image/*"
                    name="file"
                    accept=",.png,.jpg.jpeg"
                    onChange={this.handleSelectedFile}
                  />
                </p>

                <div className="image-button-container">{ImageSubmitButton}<button className='image-skip'
                  onClick={
                   this.skipImageUpload
                  }
                >
                  Skip
                </button></div>
                
              </form>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.isLoggedIn && !this.state.profilePicture) {
      return (
        <div style={styles.main}>
          <div className="container">
            <div>
              <h3>Enter A Bio</h3>
              <form onSubmit={this.onBioSubmit}>
                {errors.bio && <div className="error">{errors.bio}</div>}
                <div>
                  <textarea
                    placeholder="Bio"
                    id="bio"
                    type="text"
                    className="form-field bio-form"
                    name="bio"
                    onChange={this.onChange}
                  />
                  <h6
                    className={
                      "character-counter " +
                      (this.state.bio.length > 150 ? "bio-error" : "")
                    }
                  >
                    {this.state.bio.length} / 150
                  </h6>
                </div>
                <button type="submit" name="action">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div style={styles.main}>
        <div className="container">
          <div>
            <h3>SIGN UP</h3>
            <form onSubmit={this.onSubmit}>
              {errors.email && <div className="error">{errors.email}</div>}
              {errors.password && (
                <div className="error">{errors.password}</div>
              )}
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

              <div>
                <input
                  placeholder="Confirm Password"
                  id="confirm-password"
                  type="password"
                  className="form-field"
                  name="confirmPassword"
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
