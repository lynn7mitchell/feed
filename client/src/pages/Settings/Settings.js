import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import "./settings.css";
import axios from "axios";

import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    // gets the bearer token to validate the user that is logged in
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }

    // /api/user grabs the current logged on user's info
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="settings">
      <DesktopNavbar user={currentUser} />
      <h1>Settings</h1>
      <h2>Hello</h2>
      <MobileNavbar user={currentUser} />
    </div>
  );
}
