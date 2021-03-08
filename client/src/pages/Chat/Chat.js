import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";

import io from "socket.io-client";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";

import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";

import "./chat.css";
export default function Chat() {
  const { id } = useParams();
  const [currentUser, setCurrentUser] = useState({});
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
      .catch((err) => console.error(err));


      // SOCKET
      let room = {
        id,
        user: currentUser.username
      };
      const socket = io("localhost:3001");
      socket.on("connect", function () {
        // Connected, let's sign-up for to receive messages for this room
        socket.emit("room", room);
      });
      socket.on("message", (data) => {
        console.log("Incoming message:", data);
      });
  
      return ()=>{
        socket.close();
      }
    
  
  }, []);

  var socket = io();

  const onSubmit = (e) => {
    e.preventDefault();
    if (e.target.input.value) {
      socket.emit("chat message", {
        message: e.target.input.value,
        user: currentUser.username,
      });
      console.log(currentUser.username)
      e.target.input.value = "";
    }
  };

  socket.on("chat message", function (msg) {
    var item = document.createElement("li");
    item.textContent = msg.user + ' ' + msg.message;
    document.getElementById("messages").appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });

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

        <h1>Chat</h1>
        <ul id="messages"></ul>
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
