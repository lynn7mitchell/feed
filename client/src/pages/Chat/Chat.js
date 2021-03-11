import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";

import io from "socket.io-client";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";

import "./chat.css";
export default function Chat(props) {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [otherUser, setOtherUser] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("example-app");
    let currentUsername;
    setOtherUser(props.location.state.otherUserName[0]);
    if (token) {
      setAuthToken(token);
    }
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
        currentUsername = res.data.username;
        setLoading(false);
      })
      .catch((err) => console.error(err));

    // SOCKET
    let room = id;

    
    const socketURL =
      process.env.NODE_ENV === "production"
        ? window.location.hostname
        : "localhost:3001";

    const socket = io(socketURL);

    socket.on("connect", function () {
      console.log("socket.id");
    });
    socket.emit("join server", currentUser.username);
    socket.emit("join room", room);
    socket.on("message", (data) => {
      console.log("Incoming message:", data);
    });
    socket.on("chat", function (payload) {
      console.log("here");
      console.log(payload);
      var item = document.createElement("li");
      console.log(currentUser);
      payload.sender === currentUsername
        ? item.classList.add("me")
        : item.classList.add("you");
      console.log(item);
      item.textContent = payload.sender + " " + payload.content;
      let messageContainer = document.getElementById("messages");
      messageContainer.appendChild(item);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    });

    return () => {
      socket.close();
    };
  }, []);

  var socket = io();

  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target.input.value) {
      socket.emit("message", {
        content: e.target.input.value,
        sender: currentUser.username,
        room: id,
      });
      console.log(currentUser.username);
      e.target.input.value = "";
    }
  };

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
      <div id="chat">
        <DesktopNavbar user={currentUser} />

        <ul id="messages">
          <li class="other-user-name">Chatting with: {otherUser.username}</li>
        </ul>
        <form id="form" onSubmit={(e) => onSubmit(e)}>
          <input id="input" autoComplete="off" />
          <button type="submit">
            <i className="material-icons">send</i>
          </button>
        </form>
        <MobileNavbar user={currentUser} />
      </div>
    );
}
