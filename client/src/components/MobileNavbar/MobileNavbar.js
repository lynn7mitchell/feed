import React, { useEffect, useState } from "react";
import { Redirect, Link } from "react-router-dom";
import "./mobile-navbar.css";
import axios from "axios";
export default function MobileNavbar(user) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    axios
      .get("/api/allUsers")
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="mobile-navbar">
      <i className="material-icons">search</i>
      <Link to={`/profile/${user.user.username}`}>
        <i className="material-icons">account_circle</i>
      </Link>
      <i className="material-icons">sms</i>
      <i className="material-icons">notifications</i>
    </div>
  );
}
