import React, { useEffect, useRef, useState } from 'react'
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

import EditComment from './EditComment';
import ReplyComment from './ReplyComment';
import ShowReplies from './ShowReplies';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';
import LoadMoreRepliesButton from './LoadMoreRepliesButton';

const notify = () => toast(
    'Comment saved.',
    {
        duration: 1500,
        icon: '👌'
    }
);

const ShowCommenst = ({
    comment,
    idPost,
    setCommentsState,
    setEngagementPost
}) => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { showConfirmSwal } = useSwal();

    /**
     * states
     */
    const [editActive, setEditActive] = useState(false); // show a form to update 
    const [newComment, setNewComment] = useState('');    // new comment update
    const [highlight, setHighlight] = useState(true);    // state to show animation in new comment

    const [replyActive, setReplyActive] = useState(false);

    const [repliesState, setRepliesState] = useState([]);
    const [repliesMeta, setRepliesMeta] = useState({
        total: 0,
        totalPages: 1,
        hasMore: false
    });
    const [currentRepliesPage, setCurrentRepliesPage] = useState(0); // Empezar en 0
    const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false); // Para controlar la carga inicial


    /**
     * states Redux
     */
    const theme = useSelector(state => state.posts.themeW);

    const link = useSelector(state => state.posts.linkBaseBackend);

    /**
     * useEffect
     */

    // effect to get comment to edit
    useEffect(() => {
        setNewComment(comment.comment);
    }, [])

    // animation to show new comment
    useEffect(() => {
        setHighlight(true);
        const timer = setTimeout(() => setHighlight(false), 400);
        return () => clearTimeout(timer);
    }, [comment.comment]);






    useEffect(() => {
        if (!initialLoadDone && comment._id) {
            loadInitialReplies();
        }
    }, [comment._id, initialLoadDone]);


const loadInitialReplies = async () => {
        try {
            setLoadingMoreReplies(true);
            
            // Primero obtener el conteo total
            const countResponse = await axios.get(
                `${link}/replies/count-replies-by-comment/${comment._id}`
            );
            
            const totalReplies = countResponse.data.data.total;
            
            // Si hay replies, cargar las primeras 3
            if (totalReplies > 0) {
                const repliesResponse = await axios.get(
                    `${link}/replies/get-replies-paginated-by-comment/${comment._id}?page=1&limit=3`
                );
                setRepliesState(repliesResponse.data.data.data);
                setCurrentRepliesPage(1);
            }
            
            setRepliesMeta({
                total: totalReplies,
                totalPages: Math.ceil(totalReplies / 3),
                hasMore: totalReplies > 3
            });
            
            setInitialLoadDone(true);
        } catch (error) {
            console.error('Error loading initial replies:', error);
        } finally {
            setLoadingMoreReplies(false);
        }
    };

    const loadMoreReplies = async () => {
        if (loadingMoreReplies || currentRepliesPage >= repliesMeta.totalPages) return;

        setLoadingMoreReplies(true);
        const nextPage = currentRepliesPage + 1;

        try {
            const response = await axios.get(
                `${link}/replies/get-replies-paginated-by-comment/${comment._id}?page=${nextPage}&limit=3`
            );

            const newReplies = response.data.data.data;
            
            // Usar Set para evitar duplicados
            setRepliesState(prev => {
                const existingIds = new Set(prev.map(r => r._id));
                const filteredNewReplies = newReplies.filter(reply => !existingIds.has(reply._id));
                return [...prev, ...filteredNewReplies];
            });
            
            setRepliesMeta(prev => ({
                ...prev,
                total: response.data.data.meta.total,
                totalPages: response.data.data.meta.totalPages,
                hasMore: nextPage < response.data.data.meta.totalPages
            }));

            setCurrentRepliesPage(nextPage);

        } catch (error) {
            console.error('Error loading more replies:', error);
        } finally {
            setLoadingMoreReplies(false);
        }
    };

    const handleNewReply = (newReply) => {
        // Evitar duplicados
        setRepliesState(prev => {
            const existingIds = new Set(prev.map(r => r._id));
            if (!existingIds.has(newReply._id)) {
                return [newReply, ...prev];
            }
            return prev;
        });
        
        // Actualizar el contador
        setRepliesMeta(prev => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / 3),
            hasMore: (prev.total + 1) > 3
        }));
    };



    const handleUpdateReply = (updatedReply) => {
    setRepliesState(prev => 
        prev.map(r => r._id === updatedReply._id ? updatedReply : r)
    );
};

const handleDeleteReply = (deletedReplyId) => {
    setRepliesState(prev => prev.filter(r => r._id !== deletedReplyId));
    setRepliesMeta(prev => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / 3),
        hasMore: (prev.total - 1) > 3
    }));
};




    /**
     * functions
     */

    // to edit a comment
    const handleEditComment = async (id) => {

        setEditActive(!editActive);
        try {

            // send info to backend
            await clientAuthAxios.put(`/comments/edit-comment/${comment._id}?user=${userAuth.userId}`, {
                comment: newComment,
                postId: idPost
            });


            // update ui
            setCommentsState(prevComments =>
                prevComments.map(c =>
                    c._id === comment._id
                        ? { ...c, comment: newComment }
                        : c
                )
            );
            notify();
        } catch (error) {
            console.log(error);
            // show error
            showConfirmSwal({
                message: error.response.data.message,
                status: "error",
                confirmButton: true
            });
        }
    }

    // to delete a comment
    const handleDeleteComment = async (idComment) => {
        Swal.fire({
            title: 'Are you sure you want to remove this comment?',
            text: "Deleted comment cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Cancel',
            customClass: {
                popup: 'swal-popup-warning',
                title: 'swal-title-warning',
                confirmButton: 'swal-btn-warning',
                cancelButton: 'swal-btn-error'
            },
            buttonsStyling: false,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await clientAuthAxios.delete(
                        `/comments/delete-comment/${idComment}?user=${userAuth.userId}&post=${idPost}`
                    );

                    // update state
                    setCommentsState(prev =>
                        prev.filter(c => c._id !== idComment)
                    );

                    setEngagementPost(prev => ({
                        ...prev,
                        numberComments: prev.numberComments - 1
                    }));


                } catch (error) {
                    console.error(error);
                    // show error
                    showConfirmSwal({
                        message: error.response.data.message,
                        status: "error",
                        confirmButton: true
                    });
                }
            }
        });
    };

    // -- Actions comments end
    const handleReplyComment = async (commentId) => {
        setReplyActive(!replyActive)
        // setCommentId(commentId);
    }

    // -- actions replies end

    return (

        <div>
            <article
                className={`
                    p-4 mb-6 text-base rounded-lg my-2 transition-colors duration-700
                    ${highlight
                        ? 'bg-yellow-200 dark:bg-yellow-300'
                        : theme
                            ? 'bgt-light text-black'
                            : 'bgt-dark text-white'}
                    `}
            >
                <footer className=" mb-2">
                    <div className="flex flex-col w-full border-b border-gray-200 dark:border-gray-700 pb-3 mb-3">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center">
                                <Link
                                    to={`/profile/${comment.userID._id}`}
                                    className="h-10 w-10 rounded-full bg-cover bg-center bg-no-repeat mr-3"
                                    style={{
                                        backgroundImage: `url("${comment.userID.profilePicture.secure_url
                                            ? comment.userID.profilePicture.secure_url
                                            : "/avatar.png"
                                            }")`,
                                    }}
                                ></Link>

                                <div className="flex flex-col">
                                    <Link
                                        to={`/profile/${comment.userID._id}`}
                                        className="text-sm font-medium whitespace-nowrap truncate"
                                    >
                                        {comment.userID.name}
                                    </Link>
                                    <p className="text-xs">
                                        {new Date(comment.dateComment).toDateString()}
                                    </p>
                                </div>
                            </div>

                            {userAuth.userId === comment.userID._id && (
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon
                                        className={`
                                            ${theme ? "btn-theme-light-delete" : "btn-theme-dark-delete"}
                                                text-xs p-2 cursor-pointer`}
                                        icon={faTrash}
                                        onClick={() => handleDeleteComment(comment._id, comment.dateComment)}
                                    />
                                    {!editActive && (
                                        <FontAwesomeIcon
                                            icon={faPen}
                                            className={`
                                                ${theme ? "btn-theme-light-edit" : "btn-theme-dark-edit"}
                                                    text-xs p-2 cursor-pointer`}
                                            onClick={() => setEditActive(!editActive)}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mt-2 pl-13">
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
                                <p className="">{comment.comment}</p>
                            )}
                        </div>
                    </div>
                </footer>
                <div className="flex items-center mt-4 space-x-4">
                    {
                        Object.keys(userAuth).length != 0 &&
                        <button
                            type="button"
                            onClick={() => handleReplyComment(comment._id)}
                            className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400">
                            <svg aria-hidden="true" className="mr-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                            Reply
                        </button>
                    }

{repliesMeta.total > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {repliesMeta.total} {repliesMeta.total === 1 ? 'reply' : 'replies'}
                        </span>
                    )}
                </div>
            </article>
           {replyActive && (
                <ReplyComment
                    setReplyActive={setReplyActive}
                    replyActive={replyActive}
                    userID={userAuth.userId}
                    comment={comment}
                    idPost={idPost}
                    onNewReply={handleNewReply}
                />
            )}
            
            {/* Lista de replies */}
            {repliesState.length > 0 && (
                <div className="ml-6 lg:ml-12 mt-2">
                    {repliesState.map(reply => (
                        <ShowReplies
key={reply._id}
        reply={reply}
        userP={userAuth}
        onUpdateReply={handleUpdateReply}
        onDeleteReply={handleDeleteReply}
                        />
                    ))}
                    
                    {/* Botón para cargar más replies si aún hay */}
                    {repliesMeta.hasMore && (
                        <LoadMoreRepliesButton
                            loading={loadingMoreReplies}
                            onClick={loadMoreReplies}
                            theme={theme}
                            hasMore={repliesMeta.hasMore}
                        />
                    )}
                </div>
            )}

        </div>

    )
}

export default ShowCommenst