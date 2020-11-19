import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import setAuthToken from "../../utils/setAuthtoken";
import "./post.css";
import axios from "axios";

import DesktopNavbar from '../../components/DesktopNavbar/DesktopNavbar'

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [postNav, setPostNav] = useState()
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("example-app");

    if (token) {
      setAuthToken(token);
    }
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
        setLoading(false);

      })
      .catch((err) => {console.log(err)
        // setLoading(false);
      });
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

 
  if (loading) {
    return (
      <div className="loading">
       <h2> Loading...</h2>
        <div className="search-suggestions"></div>
      </div>
    );
  } else{
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
}
