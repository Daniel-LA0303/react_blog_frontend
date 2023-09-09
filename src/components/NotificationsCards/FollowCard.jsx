import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const FollowCard = ({notification}) => {
    const theme = useSelector(state => state.posts.themeW);
  return (
    <div className={`${theme ? 'bgt-light2 ' : 'bgt-dark2 text-white'} text-left md:text-center leading-normal mb-2 rounded-sm`}>
        <div className={`flex justify-between items-center border-r-4 border-r-yellow-400`}>
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
            <div className='mr-3'>
                <Link 
                    to={`/profile/${notification.user._id}`}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
                >Visit User</Link>
            </div>
        </div>
    </div>
  )
}

export default FollowCard