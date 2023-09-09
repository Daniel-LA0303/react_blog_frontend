import React from 'react'
import { useSelector } from 'react-redux';
import Post from '../Post/Post';
import { Link } from 'react-router-dom';



const CommentCard = ({notification}) => {

    const theme = useSelector(state => state.posts.themeW);
  return (
    <div className={`${theme ? 'bgt-light2 ' : 'bgt-dark2 text-white'} text-left md:text-center leading-normal mb-2 rounded-sm`}>
        <div className={`flex justify-start items-start 
            ${notification.type === 'comment' ? 'border-r-4 border-r-orange-400'
            : notification.type === 'reply' ? 'border-r-4 border-r-green-400' 
            : notification.type === 'like' ? 'border-r-4 border-r-red-400' : ''
        }
        `}>
            <div className='m-3 flex'>
                <Link to={`/profile/${notification.user._id}`}>
                    <img alt="..." 
                        src={           
                            notification.user?.profilePicture.secure_url != '' ? notification.user.profilePicture.secure_url : 
                            '/avatar.png'  } 
                        className=" shadow-xl image_profile_notification  h-auto block" 
                    />
                </Link>
                <div>
                    <Link>
                        <p className='ml-2 text-xl font-bold'>
                            {notification.user.name} <span className=' font-normal text-sm'>{notification.notification}</span>
                        </p>
                    </Link>
                    <p className='ml-2 text-left text-xs'>{new Date(notification.date).toDateString()}</p>
                </div> 
            </div>
        </div>
        <div className='w-full p-2'>
            <div className='border-t w-full text-left'>
                <Post 
                    key={notification.idPost._id}
                    post={notification.idPost}
                />
            </div>
        </div>
    </div>
  )
}

export default CommentCard