import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { newCommentAction } from '../../StateRedux/actions/postAction';
import { io } from 'socket.io-client';

let socket;

const NewComment = ({ user, idPost, comments, userPost }) => {

    const [comment, setComment] = useState('');
    const theme = useSelector(state => state.posts.themeW);
    const dispatch = useDispatch();
    const newCommentRedux = (comment) => dispatch(newCommentAction(comment));
    const link = useSelector(state => state.posts.linkBaseBackend);

    // useEffect(() => {
    //     socket = io('http://localhost:4000')
    //   }, []);

    //new comment
    const newComment = async (id) => {
        setComment('');
        const data = {
            userID: user._id,
            comment: comment,
            dateComment: new Date(),
        }
        newCommentRedux({
            userID: user,
            comment: comment,
            dateComment: new Date(),
            replies: []
        });
        try {
            await axios.post(`${link}/posts/save-comment/${id}`, {data, userPost});
            console.log('emit');
            // socket.emit('newComment' ,data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className={`${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-900 text-white'} rounded-lg py-2`}>
            <div className="max-w-2xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg lg:text-2xl font-bold ">Discussion ({comments.length})</h2>
                </div>
                <form className="mb-6">
                    <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-700">
                        <label for="comment" className="sr-only">Your comment</label>
                        <textarea 
                            id="comment" 
                            rows="6"
                            className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-700"
                            name="body" 
                            placeholder='Type Your Comment' 
                            required
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            ></textarea>
                    </div>
                        <button 
                            onClick={() => newComment(idPost)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                             placeholder='Type your Comment'
                        >Comment</button>
                </form>
            </div>
        </section>
    )
}
export default NewComment