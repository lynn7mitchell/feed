import React, { useState, useEffect } from 'react';
import './post-card.css'
import Axios from 'axios'

export default function PostCard(profileUser) {
    const [posts, setPosts] = useState([])

    useEffect(()=>{
        Axios.get('/postsById', {
            params: {
              author: profileUser.profileUser._id
            }
          })
        .then((res) => {
           setPosts(res.data)
           })
           .catch((err) => console.log(err.response));
    }, [])
  

    return (
        <div>
        {posts.map((post)=>
        <div className="post-card">
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
        )}
        </div>
    )
}
