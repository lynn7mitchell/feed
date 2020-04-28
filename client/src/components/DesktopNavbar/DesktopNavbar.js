import React from "react";
import "./desktop-navbar.css";

export default function DesktopNavbar() {
  return (
    <nav>
      <h4>FEED</h4>
      <div><input type="text" placeholder="Search"/></div>
      <div className="nav-icons">
        <i className="material-icons">account_circle</i>
        <i className="material-icons">notifications</i>
        <i className="material-icons">sms</i>
        <i className="material-icons">settings</i>
      </div>
    </nav>
  );
}
