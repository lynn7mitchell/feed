import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./post-card.css";
import axios from "axios";

export default function PostCard(props) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [targetPostid, setTargetPostId] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setPosts(props.userPosts.reverse());
    setCurrentUser(props.currentLoggedInUser);
    // setLoading(false)
  }, []);

  // Add a modal that asks if the user is sure they want
  // to delete the post and if the answer is yes then it will
  // refresh the page

  const showDeleteModal = (e) => {
    setTargetPostId(e.target.id);
    // console.log(currentPostId)
    const modal = document.getElementById("delete-modal");
    // display modal
    modal.style.display = "block";
  };

  const hideDeleteModal = (e) => {
    setTargetPostId("");
    // console.log(currentPostId)
    const modal = document.getElementById("delete-modal");
    // display modal
    modal.style.display = "none";
  };

  const handleDeletePost = (e) => {
    axios
      .delete(`/deletePost/${targetPostid}`)
      .then(console.log("post deleted"))
      .catch((err) => console.log(err.data));
    // refresh page
    window.location.reload(false);
  };

  // if (loading) {
  //   return (
  //     <div className="profile-container">
  //       <div className="profile loading">Loading...</div>
  //     </div>
  //   );
  // } else {
    return (
      <div>
        {posts.map((post) => {
          if (post.username === currentUser.username) {
            return (
              <div className="post-card" key={post._id}>
                <i
                  className="material-icons delete-button"
                  id={post._id}
                  onClick={(e) => {
                    showDeleteModal(e);
                  }}
                >
                  delete
                </i>
                <div className="basic-info">
                  <i className="material-icons">account_circle</i>
                  <Link to={"/profile/" + post.username}>
                    <h5>{post.username}</h5>
                  </Link>
                </div>
                <div className="content">
                  <p>{post.text}</p>
                </div>
                <div className="action-icons">
                  <i className="material-icons">message</i>
                  <i className="material-icons">favorite</i>
                  <i className="material-icons">cached</i>
                  <i className="material-icons">share</i>
                </div>
              </div>
            );
          } else {
            return (
              <div className="post-card" key={post._id}>
                <div className="basic-info">
                  <i className="material-icons">account_circle</i>
                  <Link to={"/profile/" + post.username}>
                    <h5>{post.username}</h5>
                  </Link>
                </div>
                <div className="content">
                  <p>{post.text}</p>
                </div>
                <div className="action-icons">
                  <i className="material-icons">message</i>
                  <i className="material-icons">favorite</i>
                  <i className="material-icons">cached</i>
                  <i className="material-icons">share</i>
                </div>
              </div>
            );
          }
        })}

        <div id="delete-modal" className="hidden">
          <p>Are you sure you want to delete this post?</p>
          <div id="delete-choices">
            <h5
              onClick={(e) => {
                handleDeletePost(e);
              }}
            >
              Yes
            </h5>{" "}
            <h5
              onClick={(e) => {
                hideDeleteModal(e);
              }}
            >
              Cancel
            </h5>
          </div>
        </div>
      </div>
    );
  // }
}
