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
    console.log(e.target.value);
    let newSuggestions = [];
    for (let i = 0; i < allUsers.length; i++) {
      if (
        allUsers[i].username.includes(e.target.value) ||
        allUsers[i].username.includes(e.target.value.toLowerCase()) ||
        allUsers[i].username.includes(e.target.value.toUpperCase())
      ) {
        newSuggestions.push(allUsers[i]);
      }
    }
    document.getElementById("search-suggestions").style.display = "block";
    setSearchSuggestions(newSuggestions);

    if (newSuggestions.length === allUsers.length) {
      document.getElementById("search-suggestions").style.display = "none";
    }
  };
  const refresh = (e) => {
    // console.log(e.target)
    window.location.href = e.target.href
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
  }
const  handleLogout = (e) => {
  localStorage.removeItem("example-app");
  window.location.href = window.location.href

};

  if(searchSuggestions.length !== 0){
    document.getElementsByClassName('search-suggestions')[0].style.display = 'block'
  }
  
  if(searchSuggestions.length === allUsers.length){
    setTimeout(function(){ document.getElementsByClassName('search-suggestions')[0].style.display = 'none' }, 500);
  } 

  

  return (
    <nav>
      <Link to={"/dashboard"}>
        <h4>FEED</h4>
      </Link>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => onChange(e)}
          onClick={(e) => onClick(e)}
        />
        <div className="search-suggestions">
          {searchSuggestions.map((searchSuggestion) => {
            return  <Link
                  
                  to={{
                    pathname: "/profile/" + searchSuggestion.username,
                    key: searchSuggestion._id,
                  }}
                  style={{ display: "block",
                  marginBottom: 5}}
                  key={searchSuggestion._id}
                  onClick={(e) => refresh(e)}

                >
                  {searchSuggestion.username}
                </Link>;
          })}
        </div>
      </div>
      <div className="nav-icons">
        <Link to={{ pathname: "/profile/" + user.user.username}} onClick={(e)=>(window.location.href = "/profile/" + user.user.username)} >
          <i className="material-icons">account_circle</i>
        </Link>
        <i className="material-icons">notifications</i>
        <i className="material-icons">sms</i>
        <Link to='/settings' ><i className="material-icons">settings</i></Link>
        <i className="material-icons" onClick={(e)=>handleLogout(e)}>login</i>
      </div>
      <Link to='/settings'className="settings-button" ><i className="material-icons ">settings</i></Link>

      <i className="material-icons logout-button" onClick={(e)=>handleLogout(e)}>login</i>

    </nav>
  );
}
