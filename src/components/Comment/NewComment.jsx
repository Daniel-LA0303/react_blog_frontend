import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { newCommentAction } from '../../StateRedux/actions/postAction';
import Swal from 'sweetalert2';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { Link } from 'react-router-dom';


const NewComment = ({ user, idPost, comments, userPost }) => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();


    const [comment, setComment] = useState('');


    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const dispatch = useDispatch();
    const newCommentRedux = (comment) => dispatch(newCommentAction(comment));


    //new comment
    const newComment = async (id) => {

        if (comment.trim() === '') {
            Swal.fire({
                title: 'Error',
                text: 'The comment is empty',
                icon: 'error',
            });
        }
        setComment('');
        const data = {
            userID: user._id,
            comment: comment,
            // dateComment: new Date(),
        }
        newCommentRedux({
            userID: user,
            comment: comment,
            dateComment: new Date(),
            replies: []
        });
        try {
            await axios.post(`${link}/comments/new-comment/${id}`, data);
            console.log('emit');
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error deleting the post',
                text: "Status " + error.response.status + " " + error.response.data.msg,
            });
        }
    }

    return (
        <section className={`${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-900 text-white'} rounded-lg py-2`}>
            <div className="mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm lg:text-base font-bold ">Discussion ({comments.length})</h2>
                </div>

                <div className='flex'>
                    <Link 
                        to={`/profile/${userAuth.userId}`}
                        class="h-12 w-12 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat mr-2"
                        style={{
                            backgroundImage: `url("${userAuth.profileImage}")`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    ></Link>
                    <form className="mb-6 w-full">
                        <div className={` ${theme ? "bg-white" : "bg-gray-700"}
                            py-2 px-4 mb-4 rounded-lg rounded-t-lg`}>
                            <textarea
                                id="comment"
                                rows="6"
                                  className={`
                                    ${theme ? "" : "bg-gray-700 text-white placeholder-gray-400 "}
                                    px-0 w-full text-sm  border-0 focus:ring-0 
                                    focus:outline-none  
                                     resize-y max-h-40 min-h-24
                                     rounded-lg
                                    `}
                                name="body"
                                placeholder='Type Your Comment'
                                required
                                onChange={(e) => setComment(e.target.value)}
                                value={comment}
                            ></textarea>
                        </div>
                        <button
                            onClick={() => newComment(idPost)}
                            className="btn-theme-light-op1 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                            placeholder='Type your Comment'
                        >Comment</button>
                    </form>
                </div>

            </div>
        </section>
    )
}
export default NewComment