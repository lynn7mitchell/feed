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
  const [politicsFilter, setPoliticsFilter] = useState(false);
  const [bio, setBio] = useState("");
  const [errors, setErrors] = useState({});
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
        setPoliticsFilter(res.data.politicsFilter);
        setBio(res.data.bio);
      })
      .catch((err) => console.log(err));
  }, []);

  const onBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleChange = (checked) => {
    setPoliticsFilter(checked);

    let updatedUser = {
      politicsFilter: checked,
    };
    axios
      .put("/api/user", updatedUser)
      .then((res) => {
        console.log(updatedUser);
      })
      .catch((err) =>
        this.setState({
          errors: err.response.data,
        })
      );
  };

  const onSubmit = (e) => {
    e.preventDefault();

    let updatedUser = {
      bio: bio,
    };
    axios
      .put("/api/user", updatedUser)
      .then((res) => {
        console.log(updatedUser);
      })
      .catch((err) => setErrors(err.res.data));
  };
  return (
    <div className="settings">
      <DesktopNavbar user={currentUser} />
      <h2>Settings</h2>
      <div className="buttons">
      <h4>Politics Filter</h4>

        <Switch
          onChange={(e) => handleChange(e)}
          checked={politicsFilter}
          onColor="#7657d1"
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>

      <div className="settings-bio">
        <h4>Change Bio</h4>
        <form onSubmit={(e) => onSubmit(e)}>
          {/* {errors.bio && <div className='error'>{errors.bio}</div>} */}
          <div>
            <textarea
              placeholder={bio}
              id="bio"
              type="text"
              className="form-field bio-form"
              name="bio"
              onChange={(e) => onBioChange(e)}
            />
            <h6
              className={
                "character-counter " + (bio.length > 150 ? "bio-error" : "")
              }
            >
              {bio.length} / 150
            </h6>
          </div>
          <div className="submit-button">
          <button type="submit" name="action">
            Submit
          </button>
          </div>
        </form>
      </div>
      <MobileNavbar user={currentUser} />
    </div>
  );
}
