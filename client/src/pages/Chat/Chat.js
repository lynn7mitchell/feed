import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

export default function Chat() {
    const { id } = useParams();

    useEffect(() => {
        let room = id;
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

  

  const onSubmit = e =>{
    e.preventDefault();
    if (e.target.input.value) {
      socket.emit('chat message', e.target.input.value);
      e.target.input.value = '';
    }
  }

  socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    document.getElementById('messages').appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
  });
    return (
        <div>
            <h1>Chat</h1>
            <ul id="messages"></ul>
      <form id="form" onSubmit={(e)=>onSubmit(e)}>
        <input id="input"  />
        <button>Send</button>
      </form>
        </div>
    )
}
