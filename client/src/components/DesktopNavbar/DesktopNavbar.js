import React, {useEffect, useState} from "react";
import Autosuggest from 'react-autosuggest';
import "./desktop-navbar.css";
import Axios from "axios";

export default function DesktopNavbar() {

  const [users, setUsers] = useState([])

  useEffect(() =>{
    Axios.get('/api/allUsers')
    .then((res) => {console.log(res.data)})
    .catch((err) => console.log(err));

  }, [])

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
