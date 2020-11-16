import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import "./post.css";
import axios from "axios";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState({});

  useEffect(() => {
    axios
      .get("/specificPost", {
        params: {
          id: id,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    
    <div className="post-page">
    <nav>
      <Link to={"/dashboard"}>
        <h4>FEED</h4>
      </Link>
    </nav>
      <div className="post-container">
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
    </div>
  );
}
