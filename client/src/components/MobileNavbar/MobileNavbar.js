import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./mobile-navbar.css";
import setAuthToken from "../../utils/setAuthtoken";
import axios from "axios";
export default function MobileNavbar(user) {
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState([])
  const [currentUser, setCurrentUser] = useState({});
  const [currentUserNotifcations, setCurrentUserNotifications] = useState([]);
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [notificationsAreOpen, setNotificationsAreOpen] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [newChat, setNewChatIsOpen] = useState(false);
  const [allChatRooms, setAllChatRooms] = useState([]);
  const [chatRoomsUsers, setChatRoomsUsers] = useState([])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // authorization
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }
    // get current user
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
        setCurrentUserNotifications(res.data.notifications);
        setLoading(false);
      })

      .catch((err) => console.log(err));

    // get all users
    axios
      .get("/api/allUsers")
      .then((res) => {
        setUsers(res.data);
        let usernames = []
        for(let i = 0; i < res.data.length; i++){
          usernames.push({username: res.data[i].username, id: res.data[i]._id})
          
        }
        setUsernames(usernames)
      })
      .catch((err) => console.log(err));

    // get all chatrooms

    axios
      .get("/chat")
      .then((res) => {
        setAllChatRooms(res.data);
        let userIds = []
        for(let i = 0; i < res.data.length; i++){
          for(let j = 0; j < res.data[i].users.length; j++){
            console.log([res.data[i].users[j]])
            userIds.push(res.data[i].users[j])
          }
          
          
        }
        setChatRoomsUsers(userIds)
      })
      .catch((err) => console.log(err));
  }, [window.location]);

  // REFRESH
  const refresh = (e) => {
    window.location.reload(false);
  };

  // SEARCH
  const onChange = (e) => {
    // because this variable is set to have nothing in it on every onChange
    // you do not have to loop through the searchSuggestions to get rid of suggestions
    // that do not include e.target.value
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

  // NOTIFICATIONS
  const deleteNotification = (e) => {
    e.preventDefault();

    let currentNotifications = currentUserNotifcations;
    let newNotifications = currentNotifications.filter(function (notification) {
      return notification._id !== e.target.id;
    });

    axios
      .put("/deleteNotification", newNotifications)
      .then(window.location.reload(false))
      .catch((err) => console.error(err));
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

  // TOGGLES

  const openMobileSearch = (e) => {
    exitMobileNotifications();
    exitMobileChat();
    setSearchIsOpen(true);
    document.getElementById("mobile-search").style.display = "block";
  };

  const exitSearch = (e) => {
    setSearchIsOpen(false);
    document.getElementById("mobile-search").style.display = "none";
  };

  const openMobileNotifications = (e) => {
    setNotificationsAreOpen(true);
    exitSearch();
    exitMobileChat();
    document.getElementById("notifications-container").style.display = "block";
  };
  const exitMobileNotifications = (e) => {
    setNotificationsAreOpen(false);
    document.getElementById("notifications-container").style.display = "none";
  };

  const openMobileChat = (e) => {
    exitMobileNotifications();
    setChatIsOpen(true);
    exitSearch();
    document.getElementById("chat-container").style.display = "block";
  };
  const exitMobileChat = (e) => {
    setChatIsOpen(false);
    document.getElementById("chat-container").style.display = "none";
  };

  const openNewMobileChat = e =>{
    exitMobileNotifications();
    exitSearch();
    // exitMobileChat();

    setNewChatIsOpen(true)
    document.getElementById("new-chat-container").style.display = "block";

  }

  const exitNewMMobileChat = (e) => {
    setNewChatIsOpen(false);
    document.getElementById("new-chat-container").style.display = "none";
  };
  const exitAll = (e) => {
    document.getElementById("chat-container").style.display = "none";
    document.getElementById("notifications-container").style.display = "none";
    document.getElementById("mobile-search").style.display = "none";
    setSearchIsOpen(false);
    setNotificationsAreOpen(false);
    setChatIsOpen(false);
    setNewChatIsOpen(false);

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

  let notificationButton = (
    <i
      className="material-icons"
      onClick={(e) => {
        openMobileNotifications(e);
      }}
    >
      notifications
    </i>
  );

  let profileButton = (
    <Link
      to={{ pathname: "/profile/" + user.user.username }}
      onClick={(e) => (window.location.href = "/profile/" + user.user.username)}
    >
      <i className="material-icons">account_circle</i>
    </Link>
  );

  let chatButton = (
    <i className="material-icons" onClick={(e) => openMobileChat(e)}>
      sms
    </i>
  );

  if (searchIsOpen || notificationsAreOpen || chatIsOpen) {
    document.getElementsByClassName("mobile-navbar")[0].style.background =
      "#121212";
    if (window.location.href.includes("dashboard")) {
      homeButton = (
        <i className="material-icons" onClick={(e) => exitAll(e)}>
          home
        </i>
      );
    }

    if (window.location.href.includes("profile")) {
      profileButton = (
        <i className="material-icons" onClick={(e) => exitAll(e)}>
          account_circle
        </i>
      );
    }
  }

  if (searchIsOpen) {
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

    notificationButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileNotifications(e);
        }}
      >
        notifications
      </i>
    );

    chatButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileChat(e);
        }}
      >
        sms
      </i>
    );
  }
  if (chatIsOpen) {
    searchButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileSearch(e);
        }}
      >
        search
      </i>
    );

    notificationButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileNotifications(e);
        }}
      >
        notifications
      </i>
    );

    chatButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          exitMobileChat(e);
        }}
      >
        sms
      </i>
    );
  }
  if (notificationsAreOpen) {
    searchButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileSearch(e);
        }}
      >
        search
      </i>
    );

    notificationButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          exitMobileNotifications(e);
        }}
      >
        notifications
      </i>
    );

    chatButton = (
      <i
        className="material-icons"
        onClick={(e) => {
          openMobileChat(e);
        }}
      >
        sms
      </i>
    );
  }

  



  if (loading) {
    return (
      <div className="loading">
        <div className="loading-content">
          <h2>LOADING ...</h2>
          <hr />
        </div>
      </div>
    );
  } else
    return (
      <div className="mobile-navbar">
        <div id="mobile-search">
          {/* Search Container */}

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
                     onClick={(e) => window.location.href.includes("profile") ? window.location.assign("/profile/" + searchSuggestion.username) : null}
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
        {chatButton}
        {/* Chat Container */}
        <div id="chat-container">
          <h4>Chat</h4>
          <div className="chat">
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
                  to={{ pathname: "/chat/" + chatRoom._id, state:{otherUserName} }}
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

            <button
              id="new-chat-button"
              onClick={(e) => {
                openNewMobileChat(e);
              }}
            >
              New Chat
            </button>
            <div id="new-chat-container">
              <h4>New Chat</h4>
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
        {notificationButton}
        {/* Notification Container */}
        <div id="notifications-container">
          <h4>Notifications</h4>
          <div className="notifications">
            {currentUser.notifications.map((notification) => {
              return (
                <Link to={notification.link} key={notification._id}>
                  <div className="notification">
                    <span>
                      {notification.whoRang + " " + notification.mssg}
                    </span>
                    <i
                      className="material-icons delete-button"
                      id={notification._id}
                      onClick={(e) => deleteNotification(e)}
                    >
                      clear
                    </i>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
}
