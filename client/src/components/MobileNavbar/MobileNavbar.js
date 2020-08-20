import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import "./mobile-navbar.css";
import axios from "axios";
export default function MobileNavbar(user) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  useEffect(() => {
    axios
      .get("/api/allUsers")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const onChange = (e) => {
    // because this variable is set to have nothing in it on every onChange
    // you do not have to loop through the searchSuggestions to get rid of suggestions
    // that do not include e.target.value
    console.log(e.target.value);
    let newSuggestions = [];
    for (let i = 0; i < users.length; i++) {
      if (
        users[i].username.includes(e.target.value) ||
        users[i].username.includes(e.target.value.toLowerCase()) ||
        users[i].username.includes(e.target.value.toUpperCase())
      ) {
        newSuggestions.push(users[i]);
      }
    }
    document.getElementById("search-suggestions").style.display = "block";
    setSearchSuggestions(newSuggestions);

    if (newSuggestions.length === users.length) {
      document.getElementById("search-suggestions").style.display = "none";
    }
  };

  const refresh = (e) => {
    // console.log(e.target)
    window.location.href = e.target.href
  };

  let homeButton = (
    <Link to={"/dashboard"}>
      <i className="material-icons">home</i>
    </Link>
  );

  let searchButton = (
    <i
      className="material-icons"
      onClick={(e) => {
        openMobileSearch(e);
      }}
    >
      search
    </i>
  );

  let profileButton = (
    <Link to={`/profile/${user.user.username}`}>
      <i className="material-icons">account_circle</i>
    </Link>
  );
  if (searchIsOpen) {
    if (window.location.href.includes("dashboard")) {
      homeButton = (
        <i className="material-icons" onClick={(e) => exitSearch(e)}>
          home
        </i>
      );
    }

    if (window.location.href.includes("profile")) {
      profileButton = (
        <i className="material-icons" onClick={(e) => exitSearch(e)}>
          account_circle
        </i>
      );
    }
    searchButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          exitSearch(e);
        }}
      >
        search
      </i>
    );
  }

  const openMobileSearch = (e) => {
    document.getElementById("mobile-search").style.display = "block";
    setSearchIsOpen(true);
  };

  const exitSearch = (e) => {
    document.getElementById("mobile-search").style.display = "none";
    setSearchIsOpen(false);
  };
  return (
    <div className="mobile-navbar">
      <div id="mobile-search">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => onChange(e)}
          />
          <div id="search-suggestions">
            {searchSuggestions.map((searchSuggestion) => {
              return (
                <Link
                  
                  to={{
                    pathname: "/profile/" + searchSuggestion.username,
                    key: searchSuggestion._id,
                  }}
                  style={{ display: "block" }}
                  key={searchSuggestion._id}
                  onClick={(e) => refresh(e)}

                >
                  {searchSuggestion.username}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {homeButton}
      {searchButton}
      {profileButton}
      <i className="material-icons">sms</i>
      <i className="material-icons">notifications</i>
    </div>
  );
}
