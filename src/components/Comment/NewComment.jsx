import axios from 'axios';
import React, { useState } from 'react'

const NewComment = ({user, idPost}) => {

    const[comment, setComment] = useState('');


    const newComment = async(id) => {
        // e.preventDefault();
        // console.log(idPost);
        const data={
            userID:user._id,
            comment:comment,
            dateComment: new Date(),
        }
        try {
            await axios.post(`http://localhost:4000/api/posts/save-comment/${id}`,data);
            window.location.reload(`/`);
        } catch (error) {
            console.log(error);

        }
        
        // // console.log(comment);
    }

  return (
    <div className="flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg">
        <form   
            className="w-full  dark:bg-gray-800 text-white rounded-lg px-4 pt-2"
            // onSubmit={newComment}    
        >
            <div className="flex flex-wrap -mx-3 mb-6">
                <h2 className="px-4 pt-3 pb-2  text-lg">Add a new comment</h2>
                <div className="w-full md:w-full px-3 mb-2 mt-2">
                    <textarea 
                        className=" rounded text-black leading-normal resize-none w-full h-20 py-2 px-3 font-medium  " 
                        name="body" 
                        placeholder='Type Your Comment' 
                        required
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    ></textarea>
                </div>
                <div className="w-full md:w-full flex justify-end items-start px-3">
                    <div className="-mr-1">
                        <button 
                            type='submit' 
                            onClick={() => newComment(idPost)}
                            className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100" 
                            placeholder='Type your Comment'
                        >Send</button>
                    </div>
                </div>
            </div>
        </form>
    </div>
  )
}

export default NewComment