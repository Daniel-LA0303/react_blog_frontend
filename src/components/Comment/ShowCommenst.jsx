import React, { useEffect, useRef, useState } from 'react'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import { deleteCommentAction, editCommentAction } from '../../StateRedux/actions/postAction';
import EditComment from './EditComment';
import ReplyComment from './ReplyComment';
import ShowReplies from './ShowReplies';

const notify = () => toast(
    'Comment saved.',
    {
        duration: 1500,
        icon: '👌'
    }
);

const ShowCommenst = ({ comment, idPost }) => {

    /**
     * states
     */
    const [editActive, setEditActive] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyActive, setReplyActive] = useState(false);
    const [commentId, setCommentId] = useState('');

    /**
     * states Redux
     */
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const dispatch = useDispatch();
    const editCommentRedux = (comment) => dispatch(editCommentAction(comment));
    const deleteCommentRedux = (date) => dispatch(deleteCommentAction(date));




    useEffect(() => {
        setNewComment(comment.comment);
    }, [])

    const handleEditComment = async (id) => {

        notify();
        setEditActive(!editActive);

        try {

            const res = await axios.put(`${link}/comments/edit-comment/${comment._id}?user=${userP._id}`, {                
                comment: newComment,
            });
            editCommentRedux({
                userID: comment.userID,
                comment: newComment,
                dateComment: comment.dateComment,
                _id: comment._id,
                replies: comment.replies
            })
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error editing the comment',
                text: "Status " + error.response.status + " " + error.response.data.msg,
              });
        }
    }

    // -- Actions comments start
    const handleDeleteComment = async (id, date) => {
        Swal.fire({
            title: 'Are you sure you want to remove this Comment?',
            text: "Deleted comment cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Cancel'
        }).then(async (result) => {
            if (result.value) {
                
                try {
                    const res = await axios.delete(`${link}/comments/delete-comment/${comment._id}?user=${userP._id}`)
                    deleteCommentRedux(date);
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error deleting the post',
                        text: "Status " + error.response.status + " " + error.response.data.msg,
                    });
                }
            }
        })
    }

    // -- Actions comments end

    //-- actions replies start
    const handleDeleteReply = async (idReply) => {

        Swal.fire({
            title: 'Are you sure you want to remove this Reply?',
            text: "Deleted Reply cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Cancel'
        }).then(async (result) => {
            if (result.value) {
                try {
                    const res = await axios.post(`${link}/replies/delete-reply/${idReply}?user=${userP._id}`, {
                        commentID: comment._id
                    });
                    editCommentRedux({
                        userID: comment.userID,
                        comment: comment.comment,
                        dateComment: comment.dateComment,
                        _id: comment._id,
                        replies: res.data.replies
                    })
                } catch (error) {
                    console.log(error);
                    Swal.fire({
                        title: 'Error deleting the post',
                        text: "Status " + error.response.status + " " + error.response.data.msg,
                    });
                }
            }
        })

        
    }

    const handleEditReply = async (newReply, reply) => {
        console.log(newReply, reply);

        try {
            const res = await axios.put(`${link}/replies/edit-reply/${reply._id}?user=${userP._id}`, {
                reply: newReply,
                commentID: comment._id
            })
            editCommentRedux({
                userID: comment.userID,
                comment: comment.comment,
                dateComment: comment.dateComment,
                _id: comment._id,
                replies: res.data.replies
            })
        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error deleting the post',
                text: "Status " + error.response.status + " " + error.response.data.msg,
            });
        }
    }

    const handleReplyComment = async (commentId) => {
        setReplyActive(!replyActive)
        setCommentId(commentId);
    }

    // -- actions replies end

    return (

        <div>
            <article className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} p-6 mb-6 text-base rounded-lg my-2`}>
                <footer className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <p className="inline-flex items-center mr-3 text-sm">
                            <img
                                className="mr-2 w-6 h-6 rounded-full"
                                src={comment.userID.profilePicture.secure_url ? comment.userID.profilePicture.secure_url : '/avatar.png'}
                                alt="Michael Gough"
                            />
                            <Link to={`/profile/${comment.userID._id}`} className="  text-sm whitespace-nowrap truncate overflow-hidden">{comment.userID.name}</Link>
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(comment.dateComment).toDateString()}</p>

                    </div>
                    {
                        userP._id === comment.userID._id ? (
                            <div className=' flex justify-end'>
                                <FontAwesomeIcon
                                    className=' text-base text-red-500 p-2 cursor-pointer'
                                    icon={faTrash}
                                    onClick={() => handleDeleteComment(comment._id, comment.dateComment)}
                                />
                                {editActive ? null : (
                                    <FontAwesomeIcon
                                        icon={faPen}
                                        className='text-base text-sky-500 p-2 cursor-pointer'
                                        onClick={() => setEditActive(!editActive)}
                                    />
                                )}

                            </div>
                        ) : (null)
                    }

                </footer>
                {editActive ? (
                    <EditComment
                        setEditActive={setEditActive}
                        editActive={editActive}
                        newComment={newComment}
                        setNewComment={setNewComment}
                        handleEditComment={handleEditComment}
                        idComment={comment._id}
                    />
                ) : (
                    <p className="text-gray-500 dark:text-gray-400">{comment.comment}</p>
                )}
                <div className="flex items-center mt-4 space-x-4">
                    {
                        Object.keys(userP).length != 0 &&
                        <button
                            type="button"
                            onClick={() => handleReplyComment(comment._id)}
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <svg aria-hidden="true" className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Reply
                        </button>
                    }
                </div>
            </article>
            {
                replyActive ? (
                    <ReplyComment
                        setReplyActive={setReplyActive}
                        replyActive={replyActive}
                        userID={userP._id}
                        comment={comment}
                        idPost={idPost}
                    />
                ) : (null)
            }
            {
                comment.replies.length > 0 ? (
                    <>
                        {
                            comment.replies.map(reply => (
                                <ShowReplies 
                                    reply={reply}  
                                    key={reply._id}
                                    userP={userP}
                                    handleDeleteReply={handleDeleteReply}
                                    handleEditReply={handleEditReply}
                                    // commentId={comment._id}
                                />
                            ))
                        }
                    </>
                ) : (null)
            }

        </div>

    )
}

export default ShowCommenst