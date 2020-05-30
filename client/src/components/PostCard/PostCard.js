import React, { useState, useEffect } from "react";
import "./post-card.css";
import axios from "axios";

export default function PostCard(props) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    setPosts(props.userPosts);
    setCurrentUser(props.currentLoggedInUser);
     

}, []);


  const handleDeletePost = e =>{
    const id = e.target.id
    axios.delete(`/deletePost/${id}`)
      .then(
        console.log('post deleted')
        
      )
        .catch(err => console.log(err.data))

  }

  return (
    <div>
      {posts.map((post) => {
        if (post.username === currentUser.username) {
          return (
            <div className="post-card" key={post._id}>
              <i className="material-icons delete-button" id={post._id} onClick={(e)=>{handleDeletePost(e)}}>delete</i>
              <div className="basic-info">
                <i className="material-icons">account_circle</i>
                <h5>{post.username}</h5>
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
                <h5>{post.username}</h5>
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
    </div>
  );
}
