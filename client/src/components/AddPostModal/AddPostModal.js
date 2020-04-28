import React from 'react'
import './addPostModal.css'

export default function AddPostModal() {
    return (
        <div className="add-post-modal">
            <div className="modal">
                <form>
                    <textarea name="post" id="post-text" cols="60" rows="10" placeholder="What's up?"></textarea>
                </form>
            </div>
        </div>
    )
}

