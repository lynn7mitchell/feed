import React, { useState, useEffect } from "react";
import setAuthToken from "../../utils/setAuthtoken";
// import { useParams } from "react-router";
import "./settings.css";
import axios from "axios";
import Switch from "react-switch";
import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import { v4 as uuidv4 } from "uuid";

export default function Settings() {
  const [currentUser, setCurrentUser] = useState({});
  const [politicsFilter, setPoliticsFilter] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageOkay, setImageOkay] = useState(false)
  const [errors, setErrors] = useState({})
  // const [errors, setError] = useState({});
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

  let ImageSubmitButton;

  if(!imageOkay){
  ImageSubmitButton = <input type="submit" disabled/>
  }else{
    ImageSubmitButton = <input type="submit"/>
  }

  const handleImageUpload = (e) => {
    e.preventDefault();
    setSelectedFile(e.target.files[0]);
    const extension = "." + e.target.files[0].name.split(".").pop();
    setImageOkay(true)
  };

  const onImageSubmit = (e) => {
    e.preventDefault();
    const extension = "." + selectedFile.name.split(".").pop();
    const newName = uuidv4() + extension;
    const data = new FormData();
    data.append("file", selectedFile, newName);
    axios
      .post("/upload", data)
      .then((res) => {
        console.log("worked");
      })
      .catch((err) => console.log(data, err.response));
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
      .catch((err) => console.error(err.res.data));
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

      <form
      className="image-upload"
        method="post"
        encType="multipart/form-data"
        onSubmit={(e) => onImageSubmit(e)}

      >
      <h4>Update Your Profile Picture</h4>
      <p>{errors.image}</p>
        <p>
          <input
            type="file"
            accept="image/*"
            name="file"
            onChange={(e) => handleImageUpload(e)}
            accept=",.png,.jpg.jpeg" 
          />
        </p>

        <p>
          {ImageSubmitButton}
        </p>
      </form>

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
