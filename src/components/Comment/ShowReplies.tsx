import { useState } from 'react';

/**
 * icons
 */
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';


/**
 * libraries
 */
import Swal from 'sweetalert2';

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios';


const ShowReplies = ({ reply, userP, onUpdateReply, onDeleteReply }: any) => {

    /**
     * hooks
     */
    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal, showAutoSwal } = useSwal();
    const { userAuth } = userUserAuthContext();

    // states
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(reply.reply);
    const [submitting, setSubmitting] = useState(false);

    // Función para eliminar reply
    const handleDeleteReply = async (replyId: any) => {
        // Use SweetAlert directly for confirmation
        Swal.fire({
            title: 'Delete reply?',
            text: "This action cannot be undone",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            customClass: {
                popup: 'swal-popup-warning',
                title: 'swal-title-warning',
                confirmButton: 'swal-btn-warning',
                cancelButton: 'swal-btn-cancel'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await clientAuthAxios.post(`/replies/delete-reply/${replyId}?user=${userAuth.userId}`, {
                        commentID: reply.commentID
                    });

                    if (onDeleteReply) {
                        onDeleteReply(replyId);
                    }

                    // Show success message
                    showAutoSwal({
                        message: res.data.message,
                        status: "success",
                        timer: 1500
                    });

                } catch (error: any) {
                    console.error('Error deleting reply:', error);
                    showConfirmSwal({
                        message: error.response?.data?.message || 'Error deleting the reply',
                        status: "error",
                        confirmButton: true
                    });

                }
            }
        });
    };

    // Función para editar reply
    const handleEditReply = async () => {

        //1. check if reply is empty
        if (!editText.trim() || submitting) {
            showConfirmSwal({
                message: "Reply is empty",
                status: "warning",
                confirmButton: true
            });
            return
        };

        setSubmitting(true);

        // 2. post new rpely
        try {
            const res = await clientAuthAxios.put(`/replies/edit-reply/${reply._id}?user=${userAuth.userId}`, {
                reply: editText,
                commentID: reply.commentID
            });

            if (onUpdateReply) {
                onUpdateReply(res.data.data); // The updated reply
            }

            setIsEditing(false);
            showConfirmSwal({
                message: 'Reply updated',
                status: "success",
                confirmButton: false,
            });

        } catch (error: any) {
            console.error('Error editing reply:', error);
            showConfirmSwal({
                message: error.response?.data?.message || 'Error editing',
                status: "error",
                confirmButton: true
            });
        } finally {
            setSubmitting(false);
        }
    };
    // Cancelar edición
    const cancelEdit = () => {
        setEditText(reply.reply);
        setIsEditing(false);
    };

    return (
        <article className={`${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark text-white'} p-6 mb-6 text-base rounded-lg`}>
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={reply.userID.profilePicture?.secure_url || '/avatar.png'}
                        alt={reply.userID.name}
                    />
                    <p className={`${globalData.themeGlobal ? 'text-black' : 'text-white'} text-sm font-medium`}>
                        {reply.userID.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 ml-3">
                        <time>{new Date(reply.dateReply).toDateString()}</time>
                    </p>
                </div>

                {userAuth.userId === reply.userID._id && !isEditing && (
                    <div className='flex justify-end space-x-2'>
                        <FontAwesomeIcon
                            className='text-base text-red-500 p-2 cursor-pointer hover:opacity-80'
                            icon={faTrash}
                            onClick={() => handleDeleteReply(reply._id)}
                        />
                        <FontAwesomeIcon
                            icon={faPen}
                            className='text-base text-sky-500 p-2 cursor-pointer hover:opacity-80'
                            onClick={() => setIsEditing(true)}
                        />
                    </div>
                )}
            </footer>

            {isEditing ? (
                <div className="mt-3">
                    <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className={`
                            ${globalData.themeGlobal ? "" : "bg-gray-700 text-white placeholder-gray-400 "}
                                p-2 w-full text-sm  border-0 focus:ring-0 
                                focus:outline-none  
                                resize-y max-h-40 min-h-24
                                rounded-lg 
                            `}
                        rows={3}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleEditReply}
                            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {submitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="">{reply.reply}</p>
            )}
        </article>
    );
};


export default ShowReplies