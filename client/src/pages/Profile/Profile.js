import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import "./profile.css";
import axios from "axios";

import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import PostCard from "../../components/PostCard/PostCard";

export default function Profile() {
  const { id } = useParams();

  // currentUser is the user who is logged on
  // profileUser is the user that the profile being visited belongs to
  const [currentUser, setCurrentUser] = useState({});
  const [profileUser, setProfileUser] = useState({});
  const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [followingCount, setFollowingCount] = useState();
  const [followerCount, setFollowerCount] = useState();
  const [currentTabContent, setCurrentTabContent] = useState();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // gets the bearer token to validate the user that is logged in
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

    // /api/user grabs the current logged on user's info
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => console.log(err.response));

    // /api/notCurrentUser is used when you need user information of someone who is not logged in
    // in the case this is being used because the profile page being displayed may not belong to the user that is currently logged in
    axios
      .get("/api/notCurrentUser", {
        params: {
          username: id,
        },
      })
      .then((res) => {
        setProfileUser(res.data);
        setFollowerCount(res.data.followers.length);
        setFollowingCount(res.data.following.length);

        // get /postsById grabs only the posts that belong to the user that was grabbed by /api/notCurrentUser
        axios
          .get("/postsById", {
            params: {
              author: res.data._id,
            },
          })
          .then((res) => {
            console.log("posts", res.data);
            setPosts(res.data);
            setCurrentTabContent(
              <div>
                <PostCard userPosts={res.data} currentLoggedInUser={currentUser} />
              </div>
            );
          })
          .catch((err) => console.log(err.response));
        // setLoading is set to True by default
        setLoading(false);
      })
      .catch((err) => console.log(err));

     
  }, []);


  //Switch case to handle the content grabbed for the profile tabs (media, favorites, and tagged)
  const handleTabContent = (e) => {
    switch (e.target.id) {
      case "posts":
        setCurrentTabContent(
          <div>
            <PostCard userPosts={posts} currentLoggedInUser={currentUser} />
          </div>
        );
        console.log(currentTabContent)

        break;
      case "media":
        setCurrentTabContent("media");
        break;
      case "favorites":
        setCurrentTabContent("favorites");
        break;
      case "tagged":
        setCurrentTabContent("tagged");
        break;
      default:
        console.log("How?");
    }
  };


  // loading screen (temporary design)
  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile loading">Loading...</div>
      </div>
    );
  } else
    return (
      
      <div className="profile-container">
        <DesktopNavbar user={currentUser} />
        <div className="profile">
          <div className="header">
            <div className="user-image">
              <i className="material-icons">account_circle</i>
            </div>
            <div className="user-info">
              <div className="name">
                <h4>{profileUser.username}</h4>
              </div>
              <div className="follow">
                <span>Followers: {followerCount}</span>
                <span>Following: {followingCount}</span>
              </div>
              <div className="bio">{profileUser.bio}</div>
            </div>
          </div>
          <div className="content">
            <div className="content-headers">
              <h5
                id="posts"
                onClick={(e) => {
                  handleTabContent(e);
                }}
              >
                POSTS
              </h5>
              <h5
                id="media"
                onClick={(e) => {
                  handleTabContent(e);
                }}
              >
                MEDIA
              </h5>
              <h5
                id="favorites"
                onClick={(e) => {
                  handleTabContent(e);
                }}
              >
                FAVORITES
              </h5>
              <h5
                id="tagged"
                onClick={(e) => {
                  handleTabContent(e);
                }}
              >
                TAGGED
              </h5>
            </div>
            <hr />
          </div>
          {/* image / followers/ following / bio */}
          {/* content (tabs)*/}
          {/* posts / media / favorited / tagged */}

          {currentTabContent}
        </div>
      </div>
    );
}
