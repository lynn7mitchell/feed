import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import setAuthToken from "../../utils/setAuthtoken";
import "./desktop-navbar.css";
import axios from "axios";

export default function DesktopNavbar(user) {
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
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
    window.location.reload(false);
  };
  const onClick = (e) => {
    if (allUsers.length === 0) {
      axios
        .get("/api/allUsers")
        .then((res) => {
          // console.log(res.data);
          setAllUsers(res.data);
        })
        .catch((err) => console.log(err));
    }
  };
  const handleLogout = (e) => {
    localStorage.removeItem("example-app");
    window.location.reload(false);
  };

  const toggleNotifications = (e) => {
    console.log("toggle");
    if (notificationToggle === false) {
      console.log("false");
      document.getElementsByClassName("notifications")[0].style.display =
        "block";
      setNotificationToggle(true);
    } else {
      document.getElementsByClassName("notifications")[0].style.display =
        "none";
      setNotificationToggle(false);
    }
  };

  if (searchSuggestions.length !== 0) {
    document.getElementsByClassName("search-suggestions")[0].style.display =
      "block";
  }

  if (searchSuggestions.length === allUsers.length) {
    setTimeout(function () {
      document.getElementsByClassName("search-suggestions")[0].style.display =
        "none";
    }, 500);
  }
  let profilePicture = (
    
      <i className="material-icons">account_circle</i>
  );
  if (currentUser.image) {
    profilePicture = (
      <div
        className="desktopNavbar-profile-image"
        style={{
          background: `url(${currentUser.image})`,
          borderWidth: "5px",
          borderRadius: "50%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    );
  }


  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <h2>LOADING ...</h2>
          <hr />
        </div>
        <div className="search-suggestions"></div>
      </div>
    );
  } else
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
              return (
                <Link
                  to={{
                    pathname: "/profile/" + searchSuggestion.username,
                    key: searchSuggestion._id,
                  }}
                  style={{ display: "block", marginBottom: 5 }}
                  key={searchSuggestion._id}
                  onClick={(e) => refresh(e)}
                >
                  {searchSuggestion.username}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="nav-icons">
          <Link
            to={{ pathname: "/profile/" + user.user.username }}
            onClick={(e) =>
              (window.location.href = "/profile/" + user.user.username)
            }
          >
            {profilePicture}
          </Link>
          <div className="notification-box">
            <i
              className="material-icons"
              onClick={(e) => toggleNotifications(e)}
            >
              notifications
            </i>
            <div className="notifications">
              {currentUser.notifications.map((notification) => {
                return (
                  <Link to={notification.link} key={notification._id}>
                    <div className="notification">
                      {notification.whoRang + " " + notification.mssg}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
          <i className="material-icons">sms</i>
          <Link to="/settings">
            <i className="material-icons">settings</i>
          </Link>
          <i className="material-icons" onClick={(e) => handleLogout(e)}>
            login
          </i>
        </div>
        <Link to="/settings" className="settings-button">
          <i className="material-icons ">settings</i>
        </Link>

        <i
          className="material-icons logout-button"
          onClick={(e) => handleLogout(e)}
        >
          login
        </i>
      </nav>
    );
}
