import React, { useState } from "react";
import "./addPostForm.css";
import Axios from "axios";

export default function AddPostForm(user) {
  const [formText, setFormText] = useState("");
  // const [err, setErr]=useState({})

  const handlePost = (e) => {
    e.preventDefault();

    const newPost = {
      author: user.user.username,
      text: formText,
    };

    console.log(newPost);

    Axios.post("/post", newPost)
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.error(err));

    // refresh page
    window.location.reload(false);
  };
  let profilePicture;
  if (user.user.image) {
    profilePicture = (
      <div
        className="post-form-profile-image"
        style={{
          background: `url(${user.user.image})`,
          borderWidth: "5px",
          borderRadius: "50%",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    );
  } else {
    profilePicture = (
      <i className="material-icons" style={{ fontSize: 30 }}>
        account_circle
      </i>
    );
  }
  return (
    <div className="form-container">
      <form
        className="post-form"
        onSubmit={(e) => {
          handlePost(e);
        }}
      >
        {profilePicture}
        <textarea
          name="post"
          id="new-post-form-text"
          placeholder="What's up?"
          onChange={(e) => {
            setFormText(e.target.value);
          }}
        ></textarea>
        <button type="submit">Post</button>
      </form>
    </div>
  );
}
