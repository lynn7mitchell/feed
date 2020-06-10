import React, {useEffect, useState} from "react";
import { Redirect, Link } from "react-router-dom";
import "./desktop-navbar.css";
import Axios from "axios";

export default function DesktopNavbar(user) {

  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState({})

  useEffect(() =>{
    Axios.get('/api/allUsers')
    .then((res) => {console.log(res.data)})
    .catch((err) => console.log(err));
  }, [])



  return (
    <nav>
      <Link to={'/dashboard'}><h4>FEED</h4></Link>
      <div><input type="text" placeholder="Search"/></div>
      <div className="nav-icons">
        <Link to={`/profile/${user.user.username}`}><i className="material-icons">account_circle</i></Link>
        <i className="material-icons">notifications</i>
        <i className="material-icons">sms</i>
        <i className="material-icons">settings</i>
      </div>
    </nav>
  );
}
