import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import "./profile.css";
import axios from "axios";

import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import PostCard from "../../components/PostCard/PostCard";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";

export default function Profile() {
  const { id } = useParams();

  // currentUser is the user who is logged on
  // profileUser is the user that the profile being visited belongs to
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserFollowing, setCurrentUserFollowing] = useState([]);
  const [profileUser, setProfileUser] = useState({});
  const [profileUserFollowers, setProfileUserFollowers] = useState([])
  const [errors, setErrors] = useState({});
  // const [isProfileOwner, setIsProfileOwner] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [currentTabContent, setCurrentTabContent] = useState();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [followButton, setFollowButton] = useState();

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
       
        setCurrentUserFollowing(res.data.following);

        const thisUser = res.data;

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
            console.log(res.data.followers)
        setFollowerCount(res.data.followers.length);
        setFollowingCount(res.data.following.length);
        setProfileUserFollowers(res.data.followers)
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
                    <PostCard
                      userPosts={res.data}
                      currentLoggedInUser={thisUser}
                    />
                  </div>
                );
              });
          })
          .catch((err) => console.log(err.response));
        // setLoading is set to True by default
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  const onFollow = (e) => {
    e.preventDefault();

    console.log(profileUser._id);

    // if you are already following the person or if it is your own profile it will not add to following
    if (
      !currentUser.following.includes(profileUser._id) &&
      profileUser._id !== currentUser._id
    ) {
      setCurrentUserFollowing(
        currentUserFollowing.push(profileUser._id.toString())
      );
      setProfileUserFollowers(
        profileUserFollowers.push(currentUser._id.toString())
      )
      

      console.log(profileUserFollowers);

      let updatedUser = {
        following: currentUserFollowing,
      };

      let updatedProfileUser = {
        id: profileUser._id,
        followers: profileUserFollowers
      }
      axios
        .put("/api/user", updatedUser)
        .then((res) => {
          console.log(updatedUser);
        })
        .catch((err) => setErrors(err.res.data));


      axios
      .put('/api/follow', updatedProfileUser)
      .then((res) =>{
        console.log(updatedProfileUser)
      })
      .catch((err) => setErrors(err.res.data));

        let notification = {
          postAuthor: profileUser._id,
          notificationType:'follow',
          mssg: 'followed you!',
          whoRang:currentUser.username,
          link:"/profile/" + currentUser.username
        }
  
        axios.put('/notifications', notification)
        .then(console.log('worked'))
        .catch((err) => console.log(err));

        window.location.reload(false);

    } else {
      console.log("Don't follow yourself");
    }
  };

  const onUnfollow = e =>{
    e.preventDefault();

    const following = currentUser.following

    console.log(following)

    for(let i = following.length; i--;){
      if (following[i] === profileUser._id){
        following.splice(i, 1);

        setCurrentUserFollowing(following)
      }
    }
    
    const profileUserFollowers = profileUser.followers
    console.log(profileUserFollowers)

    for(let i = profileUserFollowers.length; i--;){
      if (profileUserFollowers[i] === currentUser._id){
        profileUserFollowers.splice(i, 1);
      }
    }

    
    console.log(following)
    let updatedUser ={
      following : following
    }

    let updatedProfileUser = {
      followers: profileUserFollowers
    }

    axios
    .put("/api/user", updatedUser)
    .then((res) => {
      console.log(updatedUser);
    })
    .catch((err) => setErrors(err.res.data));

    axios
    .put("/api/user", updatedProfileUser)
    .then((res) => {
      console.log(updatedProfileUser);
    })
    .catch((err) => setErrors(err.res.data));

    window.location.reload(false);


  }

  //Switch case to handle the content grabbed for the profile tabs (media, favorites, and tagged)
  const handleTabContent = (e) => {
    switch (e.target.id) {
      case "posts":
        setCurrentTabContent(
          <div>
            <PostCard userPosts={posts} currentLoggedInUser={currentUser} />
          </div>
        );
        console.log(currentTabContent);

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
            <div className="name">
              <h4>{profileUser.username}</h4>
              {currentUser._id === profileUser._id ? (
                console.log("true")
              ) : (
                currentUser.following.includes(profileUser._id) ? (
                  <button className="unfollow-button" onClick={(e) => onUnfollow(e)}>
                  Unfollow
                </button>
                ) : (
                <button className="follow-button" onClick={(e) => onFollow(e)}>
                  Follow
                </button>
                )
              )}
            </div>
            <div className="follow">
              <span>Followers: {followerCount}</span>
              <span>Following: {followingCount}</span>
              {/* <button className="follow-button" onClick={(e)=>onFollow(e)}>Follow</button> */}
            </div>
            <div className="bio">{profileUser.bio}</div>
          </div>
          {/* <div className="header">
            <div className="user-image">
              <i className="material-icons">account_circle</i>
            </div>
            <div className="user-info">
              <div className="name">
                <h4>{profileUser.username}</h4>
              </div>
              <div className="follow">
                
              </div>
              <div className="bio">{profileUser.bio}</div>
            </div>
          </div> */}
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

          <div className="tab-content">{currentTabContent}</div>
        </div>
        <MobileNavbar user={currentUser} />
      </div>
    );
}
