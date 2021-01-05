import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import setAuthToken from "../../utils/setAuthtoken";
import "./post.css";
import axios from "axios";

import DesktopNavbar from "../../components/DesktopNavbar/DesktopNavbar";
import MobileNavbar from "../../components/MobileNavbar/MobileNavbar";
import PostCard from "../../components/PostCard/PostCard";
export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [postNav, setPostNav] = useState();
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
        setPostNav(<DesktopNavbar user={res.data} />);
      })
      .catch((err) => {
        console.log(err);
        setPostNav(
          <nav>
            <Link to={"/dashboard"}>
              <h4>FEED</h4>
            </Link>
          </nav>
        );
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
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  if (currentUser === {}) {
    const nav = (
      <div className="loading">
        <h2> Loading...</h2>
        <div className="search-suggestions"></div>
      </div>
    );
  } else {
    const nav = <DesktopNavbar user={currentUser} />;
  }

  console.log(post.comments);
  if (loading) {
    return (
       <div className="loading">
        <div className="loading-content">
          <h2>LOADING ...</h2>
          <hr />
        </div>
      
        <div className="search-suggestions"></div>
      </div>
    );
  } else {
    return (
      <div className="post-page">
        {postNav}
        <div className="posts-container">
          <PostCard
          className='individual-post'
            userPosts={[post]}
            currentLoggedInUser={currentUser}
          ></PostCard>

          <div className="comments">
            <h4>Comments</h4>
            <hr/>
            {post.comments.map((comment) => {
              return (
                <div className="comment-card">
                  <div className="basic-info">
                    <i className="material-icons">account_circle</i>
                    <Link to={"/profile/" + comment.commentAuthor.username}>
                      <h5>{comment.commentAuthor.username}</h5>
                    </Link>
                  </div>
                  <div className="content">
                    <p>{comment.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {currentUser !== {} ? <MobileNavbar user={currentUser} /> : ""}
      </div>
    );
  }
}
