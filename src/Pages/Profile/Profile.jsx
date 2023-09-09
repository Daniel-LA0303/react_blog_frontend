import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faFile } from '@fortawesome/free-solid-svg-icons';

import CakeIcon from '@mui/icons-material/Cake';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonIcon from '@mui/icons-material/Person';

import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, getUserAction } from '../../StateRedux/actions/postAction';

import Sidebar from '../../components/Sidebar/Sidebar';

import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import LoadingPosts from '../../components/Spinner/LoadingPosts';
import Post from '../../components/Post/Post';


const Profile = () => {

  const params = useParams();
  const route = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(state => state.posts.userView);
  const userP = useSelector(state => state.posts.user);
  const PF = useSelector(state => state.posts.PFLink);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  const [userC, setUserC] = useState({});
  const [isFollow, setIsFollow] = useState(null);

  const[posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${link}/posts/get-user-posts/${params.id}`)
    .then((response) => response.json())
    .then((postU) => {
      setPosts(postU);
    })   
  }, []);

  useEffect(() => {
    const getOneUserState = () => dispatch(getOneUserAction(params.id));
    getOneUserState();  
}, []);

useEffect(() => {
  fetch(`${link}/users/get-profile/${params.id}`)
  .then((response) => response.json())
  .then((post) => {
    
    if(post.followersUsers.followers.includes(userP._id)){
      setIsFollow(true);
    }else{
      setIsFollow(false);
    }
    // setTimeout(() => {
      setUserC(post);
    // }, 2000);
    
  })   
}, []);

  const handleUnFollowUser = async() => {
    setIsFollow(false);
    try {
      await axios.post(`${link}/users/user-unfollow/${user._id}`, userP);
    } catch (error) {
      console.log(error);
    }
  }

  const handleFollowUser = async() => {
    setIsFollow(true);
    try {
      await axios.post(`${link}/users/user-follow/${user._id}`, userP);
    } catch (error) {
      console.log(error);
    }
  }

  if(Object.keys(userC) == '' || Object.keys(user) == '') return <Spinner />
  return (
    <div className=''>
      <Sidebar />
      <section className="pt-8 sm:pt-8 ">
        <div className="w-full md:w-10/12 lg:w-8/12 mx-auto">
          <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} flex flex-col min-w-0 break-word w-full mb-6 shadow-xl rounded-lg mt-16`}>
            <div className="px-2 sm:px-6 ">
              <div className="flex flex-wrap justify-center">
                <div className="w-full ml-10 md:ml-0 px-4 flex justify-start sm:justify-center">
                  <img alt="..." 
                    src={           
                      user?.profilePicture.secure_url != '' ? user.profilePicture.secure_url : 
                      '/avatar.png'  } 
                    className=" shadow-xl image_profile  h-auto align-middle border-none  -m-16  lg:-ml-16 max-w-150-px" />  
                </div>
                <div className='w-full flex justify-end'>
                  {(userC._id === userP._id || Object.keys(userP) == '') ? null: (                    
                    <>
                      {isFollow ? (
                        <button
                          type="button"
                          onClick={() => handleUnFollowUser()}
                          className={`mx-1 bg-orange-500 hover:bg-orange-800  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2`}
                        >
                          Following
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFollowUser()}
                          className={`mx-1 bg-purple-800 hover:bg-purple-900  focus:outline-none text-white  focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 `}
                        >
                          Follow
                        </button>
                      )}
                    </>
                  )}
                </div>            
              </div>
              <div className=" ">
                <h3 className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} text-left md:text-center text-xl mt-5 md:mt-10 font-bold leading-normal mb-2`}>
                  {user.name}
                </h3>
                {user.info == null ? null: (
                  <>

                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12">
                        <p className=" text-left md:text-center text-sm mb-4 leading-relaxed text-blueGray-700">
                          {user.info.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12">
                        <p className=" text-left md:text-center text-sm mb-4 leading-relaxed text-blueGray-700">
                          <CakeIcon /> {''}
                          Joined on {''}
                          {new Date(user.createdAt).toDateString()}
                        </p>
                      </div>
                    </div>
                    <div className=" my-2 border-t border-0.5 text-center"></div>
                    <div className='mx-auto block sm:flex'>
                      <div className="my-3 text-left sm:text-center  w-full sm:w-2/4">
                        <h2 className=' text-sm sm:text-xs font-bold'>Work: </h2>   
                        <p className=' text-lg'>{user.info.work}</p>       
                      </div>
                      <div className="my-3 text-left sm:text-center w-full sm:w-2/4">
                        <h2 className=' text-sm sm:text-xs font-bold'>Education: </h2>   
                        <p className='text-lg'>{user.info.education}</p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
        {/* Content here */}
        <div className='block sm:flex mx-auto w-full md:w-10/12 lg:w-8/12'> 
            <div className='w-full sm:w-3/12 mr-0 sm:mr-2'>
              {user.info == null ? null: (
                <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} flex flex-col min-w-0 break-word w-full my-1 shadow-xl rounded-lg mt-4`}>
                  <div className=" px-2 mb-2 mt-4 text-left block sm:text-center  sm:justify-center">
                    <h2 className=' text-sm sm:text-xs font-bold'>Skills:</h2>
                    <div className=" my-2 border-t border-0.5 text-center"></div>
                    <p>{user.info.skills}</p>
                  </div>
                </div>
              )}
              <div>
                <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} flex flex-col min-w-0 break-word w-full mb-6 shadow-xl rounded-lg text-center `}>
                  <div className=" py-4 lg:pt-4 ">
                    <div className="flex items-center p-3 text-center">
                      {/* <FontAwesomeIcon icon={faFile} className=' text-lg text-green-600 mr-3' /> */}
                      <InsertDriveFileIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user.numberPost} {''}
                      </span>
                      <span className="text-sm text-blueGray-400">           
                        Posts published
                      </span>
                    </div>

                    <div className="flex items-center p-3 text-center">
                      {/* <FontAwesomeIcon icon={faHeart} className=' text-lg text-red-500 mr-3' />  */}
                      <FavoriteIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user.likePost.posts.length}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Likes on posts
                      </span>
                    </div>
                    <div className="flex items-center p-3 text-center">
                      {/* <FontAwesomeIcon icon={faUser} className=' text-lg text-blue-700 mr-3' /> */}
                      <PersonIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user.followersUsers.conutFollowers}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full sm:w-9/12'>
              <div className='w-full flex flex-col items-center'>
                {Object.keys(user) === '' ? (
                  <>
                    <LoadingPosts />
                  </>
                ): 
                <>
                  {posts.length === 0 ? (
                    <p className=' text-center'>There is nothing around here yet</p>
                  ) : (<>
                    {[...posts].reverse().map(post => (
                      <Post
                          key={post._id}
                          post={post}
                      />
                    ))}
                  </>)}
      
                </>}

              </div>
            </div>
        </div>
        
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>

        </div>
        
        <footer className="relative  pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with MERN Stack by Daniel.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default Profile