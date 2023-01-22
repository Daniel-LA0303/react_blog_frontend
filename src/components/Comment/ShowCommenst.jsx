import { faHeart, faPen, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import EditComment from './EditComment';

const notify = () => toast(
    'Comment saved.',
    {
        duration: 1500,
        icon: '👌'
    }
);

const ShowCommenst = ({comment, idPost}) => {
    const PF = useSelector(state => state.posts.PFLink);
    const userP = useSelector(state => state.posts.user);
    const theme = useSelector(state => state.posts.themeW);

    const[editActive, setEditActive] = useState(false);
    const[newComment, setNewComment] = useState('');
    
    useEffect(() => {
        setNewComment(comment.comment);
    }, [])
    

    const handleDeleteComment = async (id) => {

        // console.log(id);
        
        Swal.fire({
            title: 'Are you sure you want to remove this Comment?',
            text: "Deleted comment cannot be recovered",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'No, Cancel'
          }).then(async(result) => {
            if (result.value) {
                //consulta a la api
                try {
            
                    const res =await axios.post(`http://localhost:4000/api/posts/delete-post-comment/${idPost}`, {id})
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
                route('/');
            }
          })
        
    }

    const handleEditComment = async (id) => {

        notify();
        setEditActive(!editActive);
        try {
            
            const res = await axios.post(`http://localhost:4000/api/posts/edit-post-comment/${idPost}`, {
                userID: comment.userID,
                comment:newComment,
                dateComment: comment.dateComment,
                _id: comment._id
            }).then(res =>{

            })
            
            // console.log(res);
        } catch (error) {
            console.log(error);
        }
        
        // Swal.fire(
        //     'Comment saved',
        //     'success'
        // )
        // window.location.reload(`/`);
    }


  return (
    <div className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} flex justify-center my-3 `}>
        <div className=" grid grid-cols-1 gap-4 p-4 border rounded-lg shadow-lg w-full">
            <div className='flex justify-between'>
                <Toaster 
                      position="bottom-right"
                      reverseOrder={false}
                />
                <div className=" flex gap-4">
                    <img src={PF+comment.userID.profilePicture} 
                        className=" rounded-lg -top-8 -mb-4 bg-white border h-20 w-20" 
                        alt="" 
                        loading="lazy" />
                    <div className="flex flex-col w-full">
                        <div className="flex flex-row justify-between">
                            <Link to={`/profile/${comment.userID._id}`} className="  text-xl whitespace-nowrap truncate overflow-hidden">{comment.userID.name}</Link>
                            
                        </div>
                        <p className="text-gray-400 text-sm">{new Date(comment.dateComment).toDateString()}</p>
                    </div>
                </div>
                {
                    userP._id === comment.userID._id ? (
                        <div className=' flex justify-end'>
                            <FontAwesomeIcon 
                                className=' text-base text-red-500 p-2 cursor-pointer'
                                icon={faTrash} 
                                onClick={() => handleDeleteComment(comment._id)}
                            />
                            {editActive ? null : (
                            // <Link>
                            <FontAwesomeIcon 
                                icon={faPen} 
                                className='text-base text-sky-500 p-2 cursor-pointer'
                                onClick={() => setEditActive(!editActive)}
                            />
                        // </Link>
                            )}

                        </div>
                    ) :  (null)
                }
            </div>
            {editActive ? (
                <EditComment 
                    setEditActive={setEditActive}
                    editActive={editActive}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleEditComment={handleEditComment}
                    idComment={comment._id}
                />
            ): (
                <p className="mt-4 text-gray-500">{comment.comment}</p>
            )}            
        </div>
    </div>
  )
}

export default ShowCommenst