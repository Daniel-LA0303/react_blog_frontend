import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import EditReply from './EditReply';
import { useSelector } from 'react-redux';

const ShowReplies = ({reply, userP, handleDeleteReply}) => {

    const theme = useSelector(state => state.posts.themeW);

    const [editReplyActive, setEditReplyActive] = useState(false);
    const [editReply, setEditReply] = useState('');
    return (
        <article className={`${theme ? ' bgt-light text-black' : 'bgt-dark text-white'} p-6 mb-6 ml-6 lg:ml-12 text-base rounded-lg`}>
            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white"><img
                        className="mr-2 w-6 h-6 rounded-full"
                        src={reply.userID.profilePicture.secure_url ? reply.userID.profilePicture.secure_url : '/avatar.png'}
                        alt="Jese Leos" />{reply.userID.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400"><time pubdate datetime="2022-02-12"
                        title="February 12th, 2022">{new Date(reply.dateReply).toDateString()}</time></p>
                </div>

                {
                    userP._id === reply.userID._id ? (
                        <div className=' flex justify-end'>
                            <FontAwesomeIcon
                                className=' text-base text-red-500 p-2 cursor-pointer'
                                icon={faTrash}
                                onClick={() => handleDeleteReply(reply._id)}
                            />
                            {editReplyActive ? null : (
                                <FontAwesomeIcon
                                    icon={faPen}
                                    className='text-base text-sky-500 p-2 cursor-pointer'
                                    onClick={() => setEditReplyActive(!editReplyActive)}
                                />
                            )}

                        </div>
                    ) : (null)
                }
            </footer>
            <p className="text-gray-500 dark:text-gray-400">{reply.reply}</p>
            {editReplyActive && (
                <EditReply 
                    setEditReplyActive={setEditReplyActive}
                    editReplyActive={editReplyActive}
                    editReply={editReply}
                    setEditReply={setEditReply}
                />
            )}
        </article>
    )
}

export default ShowReplies