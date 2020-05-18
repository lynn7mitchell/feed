import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import './profile.css'
import axios from "axios";

import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";

export default function Profile() {
  const { id } = useParams();


  const [currentUser, setCurrentUser] = useState({})
  const [profileUser, setProfileUser] = useState({})
  const [isProfileOwner, setIsProfileOwner] = useState(false)
  const [followingCount, setFollowingCount] = useState()
  const [followerCount, setFollowerCount] = useState()
  const [currentTabContent, setCurrentTabContent] = useState()



  useEffect(() => {
    // console.log(id)
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

    axios.get("/api/user")
    .then((res) => {
     setCurrentUser(res.data)
    })
    .catch((err) => console.log(err.response));

    axios.get('/api/notCurrentUser', {
      params: {
        username: id
      }
    })
    .then((res) => {

      setProfileUser(res.data)
     
      setFollowerCount(res.data.followers.length)
      setFollowingCount(res.data.following.length)

      
    
    })
    .catch((err) => console.log(err));

   
  }, []);


  const handleTabContent =  e =>{

    switch(e.target.id){
      case 'posts':
        setCurrentTabContent('posts')
        break;
      case 'media':
        setCurrentTabContent('media')
        break;
      case 'favorites':
        setCurrentTabContent('favorites')
        break;
      case 'tagged':
        setCurrentTabContent('tagged')
        break;
      default:
        console.log("How?")
    }
  }

  return (
    <div className="profile-container">
    <DesktopNavbar user={currentUser}/>

  <div className="profile">

    {/* header */}
    <div className="header">
     

      <div className="user-image"><i className="material-icons">account_circle</i></div>
      <div className="user-info">
        <div className="name"><h4>{profileUser.username}</h4></div>
        <div className="follow">
        <span>Followers:  {followerCount}</span>
        <span>Following:  {followingCount}</span>
        </div>
        <div className="bio">{profileUser.bio}</div>
      </div>
     

    </div>
    <div className="content">
      <div className="content-headers">
        <h5 id="posts" onClick={(e) => {handleTabContent(e)}}>POSTS</h5>
        <h5 id="media" onClick={(e) => {handleTabContent(e)}}>MEDIA</h5>
        <h5 id="favorites" onClick={(e) => {handleTabContent(e)}}>FAVORITES</h5>
        <h5 id="tagged" onClick={(e) => {handleTabContent(e)}}>TAGGED</h5>
      </div>
      <hr/>
    </div>
       {/* image / followers/ following / bio */}
    {/* content (tabs)*/}
      {/* posts / media / favorited / tagged */}

    {currentTabContent}

    
  </div>
  </div>
    );
}
