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
  const [targetCommentId, setTargetCommentId] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [currentCommentText, setCurrentCommentText] = useState("");
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

  // DELETE COMMENT

  const onDeleteComment = (e) => {
    e.preventDefault();
    console.log(e);
    setTargetCommentId(e.target.id);
    const modal = document.getElementById("delete-comment-modal");
    modal.style.display = "block";
  };

  const hideDeleteCommentModal = (e) => {
    setTargetCommentId("");
    // console.log(currentPostId)
    const modal = document.getElementById("delete-comment-modal");
    // display modal
    modal.style.display = "none";
  };

  const handleDeleteComment = (e) => {
    // axios
    //   .delete(`/deletePost/${targetCommentId}`)
    //   .then(console.log("comment deleted"))
    //   .catch((err) => console.log(err.data));
    // // refresh page
    // window.location.reload(false);
    let updatedComments = post.comments.filter(
      (comment) => comment._id !== targetCommentId
    );
    console.log(updatedComments);

    let updatedPost = {
      postId: post._id,
      comments: updatedComments,
    };
    axios
      .put("/editOrDeleteComment", updatedPost)
      .then(window.location.reload(false))
      .catch((err) => console.log(err.data));
  };

  // EDIT COMMENT

  const showEditCommentModal = (e) => {
    e.preventDefault();
    setTargetCommentId(e.target.id);
    console.log(
      e.target.parentNode.parentNode.children[2].firstChild.innerHTML
    );
    setCurrentCommentText(
      e.target.parentNode.parentNode.children[2].firstChild.innerHTML
    );
    const modal = document.getElementById("edit-comment-modal");

    // display modal
    modal.style.display = "block";
  };

  const handleCommentTextChange = (e) => {
    setCurrentCommentText(e.target.value);
  };

  const handleCommentEdit = (e) => {
    e.preventDefault();

    let commentEdit = post.comments.filter(
      (comment) => comment._id === targetCommentId
    );

    commentEdit[0].text = currentCommentText;

    let newCommentArray = post.comments.filter(
      (comment) => comment._id !== targetCommentId
    );
    console.log(newCommentArray);

    newCommentArray.push(commentEdit[0]);

    console.log(newCommentArray);

    let updatedPost = {
      postId: post._id,
      comments: newCommentArray,
    };
    axios
      .put("/editOrDeleteComment", updatedPost)
      .then((res) => {
        window.location.reload(false);
      })
      .catch((err) => console.error(err.res.data));
  };

  //

  // if (currentUser === {}) {
  //   const nav = (
  //     <div className="loading">
  //       <h2> Loading...</h2>
  //       <div className="search-suggestions"></div>
  //     </div>
  //   );
  // } else {
  //   const nav = <DesktopNavbar user={currentUser} />;
  // }

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
            className="individual-post"
            userPosts={[post]}
            currentLoggedInUser={currentUser}
          ></PostCard>

          <div className="comments">
            <h4>Comments</h4>
            <hr />
            {post.comments.map((comment) => {
              return (
                <div className="comment-card">
                  {comment.commentAuthor.id === currentUser._id ? (
                    <div className="editing-icons">
                      <i
                        className="material-icons edit-button"
                        id={comment._id}
                        text={comment.text}
                        onClick={(e) => {
                          showEditCommentModal(e);
                        }}
                      >
                        edit
                      </i>
                      <i
                        onClick={(e) => {
                          onDeleteComment(e);
                        }}
                        className="material-icons delete-button"
                        id={comment._id}
                      >
                        delete
                      </i>
                    </div>
                  ) : (
                    <span></span>
                  )}
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

        {/* DELETE COMMENT MODAL */}
        <div id="delete-comment-modal" className="a">
          <p>Are you sure you want to delete this comment?</p>
          <div id="delete-choices">
            <h5
              onClick={(e) => {
                handleDeleteComment(e);
              }}
            >
              Yes
            </h5>
            <h5
              onClick={(e) => {
                hideDeleteCommentModal(e);
              }}
            >
              Cancel
            </h5>
          </div>
        </div>

        {/* EDIT COMMENT MODAL */}

        <div id="edit-comment-modal" className="hidden">
          <p>Edit Comment</p>
          <form
            className="post-form"
            onSubmit={(e) => {
              handleCommentEdit(e);
            }}
          >
            <textarea
              name="post"
              id="post-form-text"
              value={currentCommentText}
              onChange={(e) => {
                handleCommentTextChange(e);
              }}
            ></textarea>
            <button type="submit">Comment</button>
          </form>
        </div>
      </div>
    );
  }
}
