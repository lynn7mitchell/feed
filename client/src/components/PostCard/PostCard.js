import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./post-card.css";
import axios from "axios";

export default function PostCard(props) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [targetPostid, setTargetPostId] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentActive, setCommentActive] = useState(false)
  const [comment, setComment] = useState("");
  const [currentPostText, setCurrentPostText] =useState('')
  // https://stackoverflow.com/questions/53215285/how-can-i-force-component-to-re-render-with-hooks-in-react
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => {
        setCurrentUser(res.data);
      })
      .catch((err) => console.log(err));
    const user = props.currentLoggedInUser;
    const allPosts = props.userPosts.reverse();
    console.log(allPosts)
    console.log(user);

    if (Object.keys(user).length !== 0) {

      const followingPosts = allPosts.filter(
        (post) =>
          user.following.includes(post.author) || post.author === user._id
      );
      setPosts(followingPosts);
      setCurrentUser(user);
    } else {
      setPosts(allPosts);
    }
    setLoading(false)
  }, []);

  // Add a modal that asks if the user is sure they want
  // to delete the post and if the answer is yes then it will
  // refresh the page

  const showDeleteModal = (e) => {
    e.preventDefault();
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


  const showEditModal = (e) => {
    e.preventDefault();
    setTargetPostId(e.target.id);
    console.log(e.target.parentNode.parentNode.children[2].firstChild.innerHTML)
    setCurrentPostText(e.target.parentNode.parentNode.children[2].firstChild.innerHTML)
    const modal = document.getElementById("edit-modal");

    // display modal
    modal.style.display = "block";
  };

  const handlePostTestChange = e =>{
    setCurrentPostText(e.target.value)
  }

  const handlePostEdit = e =>{
    e.preventDefault()

    let updatedPost = {
      postId: targetPostid,
      text: currentPostText,
    };
    axios
      .put("/editPost", updatedPost)
      .then((res) => {
        console.log(updatedPost);
      })
      .catch((err) => console.error(err.res.data));
  }
  const copy = (e) => {
    e.preventDefault();

    console.dir(e.target);
    console.log(e.target.attributes.link.value);
    // https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard
    let link = document.createElement("textarea");
    document.body.appendChild(link);
    link.value = e.target.attributes.link.value;
    link.select();
    document.execCommand("copy");
    document.body.removeChild(link);

    alert("The link to this post was copied to your clipboard");
  };

  const onLike = (e) => {
    e.preventDefault();

    let isLiked = e.target.getAttribute("liked");

    let postsArray = posts;

    // find instead of filter so it updates the state
    let currentPost = postsArray.find((obj) => {
      return obj._id === e.target.id;
    });

    if (isLiked === "true") {
      currentPost.likes -= 1;
      for (let i = currentPost.whoLikes.length - 1; i >= 0; i--) {
        if (currentPost.whoLikes[i] === currentUser._id) {
          currentPost.whoLikes.splice(i, 1);
        }
        console.log(currentPost.whoLikes);
      }
    } else if (isLiked === "false") {
      currentPost.likes += 1;
      currentPost.whoLikes.push(currentUser._id);

      let notification = {
        postAuthor: currentPost.author,
        notificationType: "like",
        mssg: "liked your post!",
        whoRang: currentUser.username,
        link: "/post/" + currentPost._id,
      };

      axios
        .put("/notifications", notification)
        .then(console.log("worked"))
        .catch((err) => console.log(err));
    }
    

    let updatedPost = {
      postId: currentPost._id,
      postLikes: currentPost.likes,
      whoLikes: currentPost.whoLikes,
      user: currentUser._id,
    };
    axios
      .put("/postLikes", updatedPost)
      .then(console.log("liked"))
      .catch((err) => console.log(err));
    forceUpdate();
  };

  // comment actions

  const commentButtonClick = e =>{
    e.preventDefault()
    commentActive ? setCommentActive(false) : setCommentActive(true)
  }

  const onCommentChange = (e) => {
    e.preventDefault();
    setComment(e.target.value);
  };

  const onCommentSubmit = (e) => {
    e.preventDefault();

    let postsArray = posts;

    let currentPost = postsArray.find((obj) => {
      return obj._id === e.target.id;
    });




    let updatedPost = {
      postId: currentPost._id,
      comment: comment,
      user: currentUser._id,
    };

    axios
      .put("/postComments", updatedPost)
      .then(console.log("comment submitted"))
      .catch((err) => console.log(err));
  


  let notification = {
    postAuthor: currentPost.author,
    notificationType: "comment",
    mssg: "commented on your post!",
    whoRang: currentUser.username,
    link: "/post/" + currentPost._id,
  };

  axios
    .put("/notifications", notification)
    .then(console.log("comment notification"))
    .catch((err) => console.log(err));
}

  return (
    <div>
      {posts.map((post) => {
        {
          /* If post is by the CURRENT USER */
        }
        if (post.username === currentUser.username) {
          return (
            <Link to={{ pathname: "/post/" + post._id }}>
              <div className="post-card" key={post._id}>
                <div className="editing-icons">
                <i
                  className="material-icons edit-button"
                  id={post._id}
                  text={post.text}
                  onClick={(e) => {
                    showEditModal(e);
                  }}
                >
                  edit
                </i>
                  <i
                  className="material-icons delete-button"
                  id={post._id}
                  onClick={(e) => {
                    showDeleteModal(e);
                  }}
                >
                  delete
                </i>

                
                </div>
                
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
                  <div
                    className="likes"
                    id={post._id}
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="material-icons">favorite</i> {post.likes}
                  </div>
                  <i className="material-icons">cached</i>
                  <i
                    className="material-icons"
                    link={"feed-social-media.herokuapp.com/post/" + post._id}
                    onClick={(e) => {
                      copy(e);
                    }}
                  >
                    share
                  </i>
                </div>
              </div>
            </Link>
          );
        } else {
          return (
            <div className="post-card">
              <Link to={{ pathname: "/post/" + post._id }}>
                {/* If post is by the DIFFERENT USER */}
                <div key={post._id}>
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
                    <i
                      className="material-icons"
                      onClick={
                        e => commentButtonClick(e)
                      }
                    >
                      message
                    </i>
                    <div
                      className="likes"
                      style={
                        post.whoLikes.includes(currentUser._id)
                          ? { color: "#7B56CD" }
                          : { color: "#FEFEFE" }
                      }
                    >
                      <i
                        className="material-icons"
                        id={post._id}
                        liked={
                          post.whoLikes.includes(currentUser._id)
                            ? "true"
                            : "false"
                        }
                        onClick={
                          currentUser === {}
                            ? (e) => {
                                onLike(e);
                              }
                            : (e) => {
                                e.preventDefault();
                              }
                        }
                      >
                        favorite
                      </i>
                      {post.likes}
                    </div>
                    <i
                      className="material-icons"
                      onClick={
                        currentUser === {}
                          ? (e) => {
                              e.preventDefault();
                            }
                          : (e) => {
                              e.preventDefault();
                            }
                      }
                    >
                      cached
                    </i>
                    <i
                      className="material-icons"
                      link={"feed-social-media.herokuapp.com/post/" + post._id}
                      onClick={(e) => {
                        copy(e);
                      }}
                    >
                      share
                    </i>
                  </div>
                </div>
              </Link>
              <div className="comment-container" style={{display: commentActive ? 'flex' : 'none'}}>
                <input
                  placeholder="Comment"
                  type="comment"
                  className="comment-form-field"
                  name="comment"
                  onChange={(e) => onCommentChange(e)}
                  value={comment}
                />
                <i
                  className="material-icons"
                  id={post._id}
                  onClick={(e) => onCommentSubmit(e)}
                >
                  send
                </i>
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
      <div id="edit-modal" className="hidden">
      <p>Edit Post</p>
      <form className="post-form" onSubmit={(e)=>{handlePostEdit(e)}}>
                <textarea name="post" id="post-form-text" value={currentPostText} onChange={(e)=>{handlePostTestChange(e)}}></textarea>
                <button type="submit">Post</button>
                </form>
        </div>
      {/* <div id="copy-modal" className="hidden">
         <p>The link to this post has been copied to your clipboard!</p>
         <h5>
              Okay
            </h5>
        </div> */}
    </div>
  );
  // }
}
