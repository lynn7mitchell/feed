import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar"
import AddPostForm from "../../components/AddPostForm/AddPostForm";
import setAuthToken from "../../utils/setAuthtoken";
import axios from "axios";

export class Dashboard extends Component {
  state = {
    user: {},
  };
  componentWillMount() {
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

    axios
      .get("api/user")
      .then((response) => {
        this.setState({
          user: response.data,
        });
      })
      .catch((err) => console.log(err.response));
  }


  handleLogout = () => {
    localStorage.removeItem("example-app");
    this.setState({
      redirect: true,
    });
  };





   startNewPost = (e) => {
    e.preventDefault()
    console.log("clicked")
  }


  render() {
    return (
      <div className="dashboard">
        <DesktopNavbar user={this.state.user}/>
        <AddPostForm user={this.state.user}/>
        {/* <i className="material-icons account-icon">account_circle</i> */}
        <Link to="/">
          <button className="logout-button" onClick={this.handleLogout}>
            Log Out
          </button>
        </Link>
        {/* <button className="floating-add-post-button" onClick={(e)=>{this.startNewPost(e)}}>
          <i className="material-icons">add</i>
        </button> */}
        <MobileNavbar/>
      </div>
    );
  }
}

export default Dashboard;
