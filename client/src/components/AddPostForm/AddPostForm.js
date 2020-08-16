import React, { useState } from 'react';
import './addPostForm.css'
import Axios from 'axios';

export default function AddPostForm(user) {

    const [formText, setFormText] = useState('');
    const [err, setErr]=useState({})
    
    const handlePost = (e) =>{
        e.preventDefault()
        
        const newPost = {
            author: user.user.username,
            text: formText
        }

        console.log(newPost)

        Axios.post('/post', newPost)
        .then(response => {console.log(response)})
        .catch(err =>
            setErr(err)
          );

          // refresh page
        window.location.reload(false)
    }
    return (
            <div className="form-container">
                <form className="post-form" onSubmit={(e)=>{handlePost(e)}}>
                 <i className="material-icons" style={{fontSize: 30}}>account_circle</i>
                <textarea name="post" id="post-form-text" placeholder="What's up?" onChange={(e)=>{setFormText(e.target.value)}}></textarea>
                <button type="submit" >Post</button>
                </form>
                
            </div>
    )
}

