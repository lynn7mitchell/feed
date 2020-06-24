import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import "./desktop-navbar.css";
import Axios from "axios";

export default function DesktopNavbar(user) {
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const onChange = (e) => {
    // because this variable is set to have nothing in it on every onChange
    // you do not have to loop through the searchSuggestions to get rid of suggestions
    // that do not include e.target.value
    console.log(e.target.value)
    let newSuggestions = []
    for (let i = 0; i < allUsers.length; i++) {
      if (allUsers[i].username.includes(e.target.value)) {
        newSuggestions.push(allUsers[i]);        
      }
    }
    setSearchSuggestions(newSuggestions)
  };

  const onClick = (e) => {
    if (allUsers.length === 0) {
      Axios.get("/api/allUsers")
        .then((res) => {
          // console.log(res.data);
          setAllUsers(res.data);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <nav>
      <Link to={"/dashboard"}>
        <h4>FEED</h4>
      </Link>
      <div>
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onChange(e)}
          onClick={(e) => onClick(e)}
        />
      </div>
      <div className="nav-icons">
        <Link to={`/profile/${user.user.username}`}>
          <i className="material-icons">account_circle</i>
        </Link>
        <i className="material-icons">notifications</i>
        <i className="material-icons">sms</i>
        <i className="material-icons">settings</i>
      </div>
    </nav>
  );
}
