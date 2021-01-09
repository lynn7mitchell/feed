import React, { Component } from "react";
import "./dashboard.css";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import AddPostForm from "../../components/AddPostForm/AddPostForm";
import PostCard from "../../components/PostCard/PostCard";
import setAuthToken from "../../utils/setAuthtoken";
import axios from "axios";

export class Dashboard extends Component {
  state = {
    user: {},
    posts: "",
  };
  componentWillMount() {
    const token = localStorage.getItem("example-app");
    // const thisUser = {};
    if (token) {
      setAuthToken(token);
    }

    axios
      .get("api/user")
      .then((res) => {
        this.setState({
          user: res.data,
        });
        const thisUser = res.data;
        // console.log("user", thisUser);

        // axios call is inside this .then so that the user info can get to the PostCard component
        // so that the delete button will show up on the cards
        axios
          .get("/allPosts")
          .then((res) => {
            // console.log(thisUser);
            this.setState({
              posts: (
                <div>
                  <PostCard
                    userPosts={res.data}
                    currentLoggedInUser={thisUser}
                  />
                </div>
              ),
            });
          })
          .catch((err) => console.log(err.res));
      })

      .catch((err) => console.log(err.res));

    // console.log("user", thisUser);
  }

  handleLogout = () => {
    localStorage.removeItem("example-app");
    this.setState({
      redirect: true,
    });
  };

  startNewPost = (e) => {
    e.preventDefault();
    // console.log("clicked");
  };

  render() {
    return (
      <div className="dashboard">
        <DesktopNavbar user={this.state.user} />
        <AddPostForm user={this.state.user} />
        <div className="dashboard-posts-container">{this.state.posts}</div>
        {/* <i className="material-icons account-icon">account_circle</i> */}
        {/* <Link to="/">
          <button className="logout-button" onClick={this.handleLogout}>
            Log Out
          </button>
        </Link> */}
        {/* <button className="floating-add-post-button" onClick={(e)=>{this.startNewPost(e)}}>
          <i className="material-icons">add</i>
        </button> */}
        <MobileNavbar user={this.state.user} />
      </div>
    );
  }
}

export default Dashboard;
