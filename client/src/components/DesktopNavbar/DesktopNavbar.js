import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import setAuthToken from "../../utils/setAuthtoken";
import "./desktop-navbar.css";
import axios from "axios";

export default function DesktopNavbar(user) {
  const [currentUser, setCurrentUser] = useState({});
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [notificationToggle, setNotificationToggle] = useState(false);
  const [chatToggle, setChatToggle] = useState(false);
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [chatRoomsUsers, setChatRoomsUsers] = useState([]);

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

       // get all users
    axios
    .get("/api/allUsers")
    .then((res) => {
      // setLoading(true);
      setUsers(res.data);
      let usernames = [];
      for (let i = 0; i < res.data.length; i++) {
        usernames.push({
          username: res.data[i].username,
          id: res.data[i]._id,
        });
      }
      setUsernames(usernames);
      setLoading(false);
    })
    .catch((err) => {window.location = window.location; console.log(err)});
      })
      .catch((err) => {window.location = window.location; console.log(err)});
    

    // get all chatrooms

    axios
      .get("/chat")
      .then((res) => {
        setAllChatRooms(res.data);
        let userIds = [];
        for (let i = 0; i < res.data.length; i++) {
          for (let j = 0; j < res.data[i].users.length; j++) {
            console.log([res.data[i].users[j]]);
            userIds.push(res.data[i].users[j]);
          }
        }
        setChatRoomsUsers(userIds);
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
// CHAT
const NewChatButton = document.getElementById("new-chat-button");

const createNewChat = (e, id) => {
  console.log(id);

  const chat = {users:[currentUser._id, id]}
  axios.post('/chat', chat)
  .then(window.location.reload(false))
  .catch((err) => console.error(err));
};

const openNewChat = e =>{
 
  document.getElementById("new-chat-container").style.display = "block";

}

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
  const toggleChat = (e) => {
    console.log("toggle");
    if (chatToggle === false) {
      console.log("false");
      document.getElementsByClassName("chats")[0].style.display = "block";
      setChatToggle(true);
    } else {
      document.getElementsByClassName("chats")[0].style.display = "none";
      setChatToggle(false);
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
  let profilePicture = <i className="material-icons">account_circle</i>;
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
                  // onClick={(e) => refresh(e)}
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
          <div className="chat-box">
            <i className="material-icons" onClick={(e) => toggleChat(e)}>
              sms
            </i>
            <div className="chats">
            <h5 className="chat-heading">Open Chat Rooms</h5>
              {allChatRooms.map((chatRoom) => {
                let allOtherUsers = users.filter(
                  (user) => user._id !== currentUser._id
                );
                let otherUser = chatRoom.users.filter(
                  (user) => user !== currentUser._id
                );
                let otherUserName = allOtherUsers.filter(
                  (user) => user._id === otherUser[0]
                );
                console.log(otherUserName);
                return (
                  <Link
                    to={{
                      pathname: "/chat/" + chatRoom._id,
                      state: { otherUserName },
                    }}
                    onClick={(e) =>
                      (window.location.href = "/chat/" + chatRoom._id)
                    }
                  >
                    <div className="chat-card">
                      <h5>{otherUserName[0].username}</h5>
                    </div>
                  </Link>
                );
              })}
             
            <div id="new-chat-container">
              <h5 className="chat-heading">Start A New Chat Room</h5>
            { usernames.map((username) =>{
               console.log(username)
               if(!chatRoomsUsers.includes(username.id) && username._id !== currentUser._id){
                 return(
                  <div className="chat-card" onClick={(e) =>{createNewChat(e, username.id)}}>
                    <h5>{username.username}</h5>
                  </div>
                 )
               }
             })}
              
            </div>
            </div>
          </div>
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
