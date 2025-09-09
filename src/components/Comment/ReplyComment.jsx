import { useState } from 'react'

/**
 * context
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

/**
 * service
 */
import clientAuthAxios from '../../services/clientAuthAxios';
import { useSwal } from '../../hooks/useSwal';

const ReplyComment = ({
    setReplyActive,
    userID,
    comment,
    idPost,

    onNewReply
}) => {

    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal } = useSwal();

    const [replyComment, setReplyComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const replyCommentFunc = async () => {

        // 1. checks if eply is empty
        if (!replyComment.trim() || submitting){
            showConfirmSwal({
                message: "Reply is empty",
                status: "warning",
                confirmButton: true
            });

            return
        };

        setSubmitting(true);

        // 2. post reply
        try {
            const res = await clientAuthAxios.post(`/replies/new-reply/${comment._id}`, {
                reply: replyComment,
                userID,
                postID: idPost
            });

            // 3. callback to update ui
            if (onNewReply) {
                onNewReply(res.data.data);
            }

        } catch (error) {
            console.log(error);
            showConfirmSwal({
                message: error.response.data.message,
                status: "error",
                confirmButton: true
            });
        } finally {
            setSubmitting(false);
            setReplyActive(false);
            setReplyComment('');
        }
    }

    // cancel reply
    const cancelReply = () => {
        setReplyActive(false);
        setReplyComment('');
    }

    return (
        <div className={` ${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg`}>
            <div className="w-full rounded-lg px-4 pt-2" >
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                        <textarea
                            className="rounded text-black leading-normal resize-none w-full h-20 py-2 px-3 font-medium"
                            placeholder='Type Your Reply'
                            required
                            onChange={(e) => setReplyComment(e.target.value)}
                            value={replyComment}
                        ></textarea>
                    </div>
                    <div className="w-full md:w-full flex justify-end items-start px-3">
                        <div className="-mr-1">
                            <button
                                onClick={cancelReply}
                                className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-700 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={replyCommentFunc}
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