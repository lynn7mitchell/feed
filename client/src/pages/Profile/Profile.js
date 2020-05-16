import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import './profile.css'
import axios from "axios";

// import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";

export default function Profile() {
  const { id } = useParams();


  const [profileUser, setProfileUser] = useState({})
  const [isProfileOwner, setIsProfileOwner] = useState(false)
  const [followingCount, setFollowingCount] = useState()
  const [followerCount, setFollowerCount] = useState()



  useEffect(() => {
    // console.log(id)
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

   

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

  return (
  <div className="profile">
    {/* header */}
    <div className="header">
      <div className="user-image"><i className="material-icons">account_circle</i></div>
      <div>
        <h4>{profileUser.username}</h4>
        <div>Followers: {followerCount}</div>
        <div>Following: {followingCount}</div>
        <div>{profileUser.bio}</div>
      </div>
    </div>
    <div className="content">
      <div className="content-headers">
        <h5>POSTS</h5>
        <h5>MEDIA</h5>
        <h5>FAVORITES</h5>
        <h5>TAGGED</h5>
      </div>
    </div>
       {/* image / followers/ following / bio */}
    {/* content (tabs)*/}
      {/* posts / media / favorited / tagged */}

    

    
  </div>
    );
}
