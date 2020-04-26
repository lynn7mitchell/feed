import React from "react";
import "./desktop-navbar.css";

export default function DesktopNavbar() {
  return (
    <nav>
      <h4>FEED</h4>
      <div><input type="text" placeholder="Search"/></div>
      <div className="nav-icons">
        <i class="material-icons">person</i>
        <i class="material-icons">notifications</i>
        <i class="material-icons">sms</i>
        <i class="material-icons">settings</i>
      </div>
    </nav>
  );
}
