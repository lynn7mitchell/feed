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
    const user = props.currentLoggedInUser
    const allPosts = props.userPosts.reverse()
    const followingPosts = allPosts.filter(post => user.following.includes(post.author) || post.author === user._id)
    setPosts(followingPosts);
    setCurrentUser(user);
    // setLoading(false)
  }, []);

  // Add a modal that asks if the user is sure they want
  // to delete the post and if the answer is yes then it will
  // refresh the page

  const showDeleteModal = (e) => {
    e.preventDefault()
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

  const copy = (e) =>{
    e.preventDefault()

    console.dir(e.target)
    console.log(e.target.attributes.link.value)
    // https://stackoverflow.com/questions/33855641/copy-output-of-a-javascript-variable-to-the-clipboard
    let link = document.createElement("textarea");
    document.body.appendChild(link);
    link.value = e.target.attributes.link.value
    link.select()
    document.execCommand("copy");
    document.body.removeChild(link);

    alert('The link to this post was copied to your clipboard')
  }

  const onLike = e =>{
    e.preventDefault()

    let postsArray = posts
    
    // find instead of filter so it updates the state
    let currentPost = postsArray.find(obj =>{
      return obj._id === e.target.id
    })
   
    // let findPosts = obj => obj._id === e.target.id
    // let updatedArray = [...posts]
    // updatedArray[findPosts] = currentPost
    // // postsArray.findIndex(currentPost._id)
    // console.log( postsArray.findIndex(findPosts))
    
    currentPost.likes += 1
    
    console.log(posts)


    let updatedUser = {
      postId: currentPost._id,
      postLikes: currentPost.likes
    }
    axios.put('/post', updatedUser)
    .then(console.log('liked'))
    .catch((err) => console.log(err));
    forceUpdate()

  }

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
              <Link to={
                {pathname: '/post/' + post._id }
              }>
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
                  <div className="likes" id={post._id}><i className="material-icons">favorite</i> {post.likes}</div>
                  <i className="material-icons">cached</i>
                  <i className="material-icons" link={'feed-social-media.herokuapp.com/post/' + post._id} onClick={(e)=>{copy(e)}}>share</i>
                </div>
              </div>
              </Link>
            );
          } else {
            return (
              <Link to={
                {pathname: '/post/' + post._id }
              }>
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
                  <div className="likes"  ><i className="material-icons" id={post._id}  onClick={(e)=>{onLike(e)}}>favorite</i> {post.likes}</div>
                  <i className="material-icons">cached</i>
                  <i className="material-icons" link={'feed-social-media.herokuapp.com/post/' + post._id} onClick={(e)=>{copy(e)}}>share</i>
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
