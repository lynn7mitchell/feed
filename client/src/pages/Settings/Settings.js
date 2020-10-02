import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
import { useParams } from "react-router";
import "./settings.css";
import axios from "axios";
import Switch from "react-switch";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState({});
  const [politicsFilter, setPoliticsFilter] = useState(false)
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
        setPoliticsFilter(res.data.politicsFilter)
      })
      .catch((err) => console.log(err));
  }, []);

  const handleChange= checked =>{
   setPoliticsFilter(checked);

   let updatedUser = {
    politicsFilter: checked
  }
  axios
  .put('/api/user', updatedUser)
  .then((res) =>{
   console.log(updatedUser)
  })
  .catch((err) =>
      this.setState({
        errors: err.response.data,
      })
    );
  }
  return (
    <div className="settings">
      <DesktopNavbar user={currentUser} />
      <h1>Settings</h1>
      <div className='buttons'>
      <span>Politics Filter</span><Switch onChange={(e)=>handleChange(e)} checked={politicsFilter} onColor="#7657d1" uncheckedIcon={false} checkedIcon={false} />

      </div>
      <MobileNavbar user={currentUser} />
      
    </div>
  );
}
