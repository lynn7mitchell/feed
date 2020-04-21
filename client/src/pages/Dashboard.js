import React, { Component } from "react";
import { Link } from "react-router-dom";
import setAuthToken from "../utils/setAuthtoken";
import axios from "axios";

export class Dashboard extends Component {
  state = {
    user: {}
  };
  componentWillMount() {
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

    axios
      .get("api/user")
      .then(response => {
        this.setState({
          user: response.data
        });
      })
      .catch(err => console.log(err.response));
  }
  handleLogout = () => {
    localStorage.removeItem("example-app");
    this.setState({
      redirect: true
    });
  };
  render() {
    return (
      <div>
        {/* <i className="material-icons account-icon">account_circle</i> */}
        <Link to="/">
          <button className="logout-button" onClick={this.handleLogout}>
            Log Out
          </button>
        </Link>
        <h1>Dashboard</h1>
      </div>
    );
  }
}

export default Dashboard;
