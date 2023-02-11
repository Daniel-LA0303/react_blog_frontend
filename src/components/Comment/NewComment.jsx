import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { newCommentAction } from '../../StateRedux/actions/postAction';

const NewComment = ({user, idPost}) => {

    const[comment, setComment] = useState('');
    const theme = useSelector(state => state.posts.themeW);
    const dispatch = useDispatch();
    const newCommentRedux = (comment) => dispatch(newCommentAction(comment));

    const newComment = async(id) => {
        setComment('');
        const data={
            userID:user._id,
            comment:comment,
            dateComment: new Date(),
        }
        newCommentRedux({
            userID: user,
            comment:comment,
            dateComment: new Date(),
        });
        try {
            await axios.post(`http://localhost:4000/api/posts/save-comment/${id}`,data);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg`}>
        <div className="flex flex-wrap -mx-3 mb-2">
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
                        onClick={() => newComment(idPost)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                        placeholder='Type your Comment'
                    >Comment</button>
                </div>
            </div>
        </div>
    </div>
  )
}
export default NewComment