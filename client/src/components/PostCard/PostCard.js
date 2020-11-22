import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./post-card.css";
import axios from "axios";

export default function PostCard(props) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [targetPostid, setTargetPostId] = useState("");
  const [loading, setLoading] = useState(true);

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
    if(user === {}){
      console.log(user)
    const followingPosts = allPosts.filter(
      (post) => user.following.includes(post.author) || post.author === user._id
    );
    setPosts(followingPosts);
    setCurrentUser(user);
    }else{
      setPosts(allPosts)
    }
    // setLoading(false)
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
        notificationType:'like',
        mssg: 'liked your post!',
        whoRang:currentUser.username,
        link:"/post/" + currentPost._id
      }

      axios.put('/notifications', notification)
      .then(console.log('worked'))
      .catch((err) => console.log(err));

    }
    // let findPosts = obj => obj._id === e.target.id
    // let updatedArray = [...posts]
    // updatedArray[findPosts] = currentPost
    // // postsArray.findIndex(currentPost._id)
    // console.log( postsArray.findIndex(findPosts))

    // console.log(posts)

    let updatedPost = {
      postId: currentPost._id,
      postLikes: currentPost.likes,
      whoLikes: currentPost.whoLikes,
      user: currentUser._id,
    };
    axios
      .put("/post", updatedPost)
      .then(console.log("liked"))
      .catch((err) => console.log(err));
    forceUpdate();
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
            <Link to={{ pathname: "/post/" + post._id }}>
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
            <Link to={{ pathname: "/post/" + post._id }}>
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
                  <i className="material-icons"  onClick={currentUser === {} ? (e) => {
                    e.preventDefault()
                      }: (e)=>{e.preventDefault()}}>message</i>
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
                      onClick={currentUser === {} ? (e) => {
                        onLike(e);
                      }: (e)=>{e.preventDefault()}}
                    >
                      favorite
                    </i>
                    {post.likes}
                  </div>
                  <i className="material-icons" onClick={currentUser === {} ? (e) => {
                    e.preventDefault()
                      }: (e)=>{e.preventDefault()}}>cached</i>
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
