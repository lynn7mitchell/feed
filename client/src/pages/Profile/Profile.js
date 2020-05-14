import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import './profile.css'
import axios from "axios";
export default function Profile() {
  const { id } = useParams();


  const [profileUser, setProfileUser] = useState({})

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
    .then((res) => {setProfileUser(res.data)})
    .catch((err) => console.log(err));
   
  }, []);

  return (
  <div className="profile">
    sup {profileUser.username}


    
  </div>
    );
}
