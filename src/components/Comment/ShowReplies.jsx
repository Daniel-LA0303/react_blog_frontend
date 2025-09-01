import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ShowReplies = ({reply, userP, onUpdateReply, onDeleteReply}) => {

    const theme = useSelector(state => state.posts.themeW);
    const { userAuth } = userUserAuthContext();
    const { showConfirmSwal } = useSwal();
    const link = useSelector(state => state.posts.linkBaseBackend);

    // Estados para edición
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(reply.reply);
    const [submitting, setSubmitting] = useState(false);

    // Función para eliminar reply
const handleDeleteReply = async (replyId) => {
    // Usar SweetAlert directamente para la confirmación
    Swal.fire({
        title: '¿Eliminar respuesta?',
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
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
                const res = await axios.post(`${link}/replies/delete-reply/${replyId}?user=${userAuth.userId}`, {
                    commentID: reply.commentID
                });

                console.log('Delete response:', res);

                if (onDeleteReply) {
                    onDeleteReply(replyId);
                }

                // Mostrar mensaje de éxito
                Swal.fire({
                    title: '¡Eliminada!',
                    text: 'La respuesta ha sido eliminada',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });

            } catch (error) {
                console.error('Error deleting reply:', error);
                
                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.message || 'Error al eliminar la respuesta',
                    icon: 'error',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    });
};

    // Función para editar reply
    const handleEditReply = async () => {
        if (!editText.trim() || submitting) return;

        setSubmitting(true);
        try {
            const res = await axios.put(`${link}/replies/edit-reply/${reply._id}?user=${userAuth.userId}`, {
                reply: editText,
                commentID: reply.commentID
            });

            if (onUpdateReply) {
                onUpdateReply(res.data.data); // La reply actualizada
            }

            setIsEditing(false);
            showConfirmSwal({
                message: 'Respuesta actualizada',
                status: "success",
                confirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.error('Error editing reply:', error);
            showConfirmSwal({
                message: error.response?.data?.message || 'Error al editar',
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
        <article className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} p-6 mb-6 text-base rounded-lg`}>
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={reply.userID.profilePicture?.secure_url || '/avatar.png'}
                        alt={reply.userID.name}
                    />
                    <p className={`${theme ? 'text-black' : 'text-white'} text-sm font-medium`}>
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
                        className="w-full p-2 border rounded text-black"
                        rows="3"
                        disabled={submitting}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={cancelEdit}
                            disabled={submitting}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleEditReply}
                            disabled={submitting || !editText.trim()}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">{reply.reply}</p>
            )}
        </article>
    );
};


export default ShowReplies