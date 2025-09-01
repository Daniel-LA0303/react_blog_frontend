import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { editCommentAction } from '../../StateRedux/actions/postAction';
import Swal from 'sweetalert2';

const ReplyComment = ({
    setReplyActive,
    replyActive,
    userID,
    comment,
    idPost,

    onNewReply
}) => {

    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    const [replyComment, setReplyComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const replyCommentFunc = async () => {
        if (!replyComment.trim() || submitting) return;

        setSubmitting(true);

        try {
            const res = await axios.post(`${link}/replies/new-reply/${comment._id}`, {
                reply: replyComment,
                userID,
                postID: idPost
            });

            console.log(res);


            // Llamar a la función callback para agregar la nueva reply
            if (onNewReply) {
                onNewReply(res.data.data); // Ahora recibe solo la reply, no todo el comment
            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error adding reply',
                text: "Status " + error.response.status + " " + error.response.data.msg,
            });
        } finally {
            setSubmitting(false);
            setReplyActive(false);
            setReplyComment('');
        }
    }

    const cancelReply = () => {
        setReplyActive(false);
        setReplyComment('');
    }

    return (
        <div className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg`}>
            <div className="w-full rounded-lg px-4 pt-2" >
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                        <textarea
                            className="rounded text-black leading-normal resize-none w-full h-20 py-2 px-3 font-medium"
                            placeholder='Type Your Reply'
                            required
                            onChange={(e) => setReplyComment(e.target.value)}
                            value={replyComment}
                            disabled={submitting}
                        ></textarea>
                    </div>
                    <div className="w-full md:w-full flex justify-end items-start px-3">
                        <div className="-mr-1">
                            <button
                                onClick={cancelReply}
                                disabled={submitting}
                                className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={replyCommentFunc}
                                disabled={submitting || !replyComment.trim()}
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:opacity-50"
                            >
                                {submitting ? 'Posting...' : 'Post Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReplyComment