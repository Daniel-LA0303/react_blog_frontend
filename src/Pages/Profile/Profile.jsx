import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faFile } from '@fortawesome/free-solid-svg-icons';

import CakeIcon from '@mui/icons-material/Cake';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonIcon from '@mui/icons-material/Person';

import { useSelector } from 'react-redux';

import Sidebar from '../../components/Sidebar/Sidebar';

import { useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import LoadingPosts from '../../components/Spinner/LoadingPosts';
import Post from '../../components/Post/Post';
import usePages from '../../context/hooks/usePages';
import Error from '../../components/Error/Error';
import Swal from 'sweetalert2';


const Profile = () => {

    /**
   * context
   */
  const {errorPage, setErrorPage} = usePages();
  const {error, message} = errorPage;
  

  /**
   * router
   */
  const params = useParams();

  /**
   * States
   */
  const[isFollow, setIsFollow] = useState(null);
  const[posts, setPosts] = useState([]);
  const[user, setUser] = useState({}); //-> user view
  const[loading, setLoading] = useState(false);

  /**
   * States Redux
   */
  const userP = useSelector(state => state.posts.user);
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    setErrorPage({
      error: false,
      message: {}
  });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-profile-user/${params.id}`)
      .then((pageProfile) => {
        console.log(pageProfile);
        if(pageProfile.data.user.followersUsers.followers.includes(userP._id)){
          setIsFollow(true);
        }else{
          setIsFollow(false);
        }
        setPosts(pageProfile.data.posts);
        setUser(pageProfile.data.user);
        setLoading(false);
      }).catch((error) => {
        console.log(error);
        if(error.code === 'ERR_NETWORK'){
          setErrorPage({
              error: true,
              message: {
                status: null,
                message: 'Network Error',
                desc: null
              }
          });
          setLoading(false);
        }else{
          setErrorPage({
              error: true,
              message: {
                status: error.response.status,
                message: error.response.data.message,
                desc: error.response.data.message
              }
          });
          
          setLoading(false);
        }
      });  
  }, [params.id]);

  /**
   * Functions
   */
  const handleUnFollowUser = async() => {
    
    try {
      await axios.post(`${link}/users/user-unfollow/${user._id}`, userP);
      setIsFollow(false);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error deleting the post',
        text: "Status " + error.response.status + " " + error.response.data.msg,
      });
    }
  } 

  const handleFollowUser = async() => {
    
    try {
      await axios.post(`${link}/users/user-follow/${user._id}`, userP);
      setIsFollow(true);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: 'Error deleting the post',
        text: "Status " + error.response.status + " " + error.response.data.msg,
      });
    }
  }

  // if(Object.keys(user) == '') return <Spinner />
  return (
    <div className=''>
      <Sidebar />
      {
        error ? <Error message={message}/>:
        loading && !error ? <Spinner/> :
        <section className="pt-8 sm:pt-8 ">
        <div className="w-full md:w-10/12 lg:w-8/12 mx-auto">
          <div className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} flex flex-col min-w-0 break-word w-full mb-6 shadow-xl rounded-lg mt-16`}>
            <div className="px-2 sm:px-6 ">
              <div className="flex flex-wrap justify-center">
                <div className="w-full ml-10 md:ml-0 px-4 flex justify-start sm:justify-center">
                  <img alt="..." 
                    src={user?.profilePicture?.secure_url ? user.profilePicture.secure_url : '/avatar.png'} 
                    className=" shadow-xl image_profile  h-auto align-middle border-none  -m-16  lg:-ml-16 max-w-150-px" />  
                </div>
                <div className='w-full flex justify-end'>
                  {
                    !userP._id ? null :
                      userP._id === user._id ? null : (                    
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
                      )
                    }
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
                      <InsertDriveFileIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user?.posts?.length} {''}
                      </span>
                      <span className="text-sm text-blueGray-400">           
                        Posts published
                      </span>
                    </div>

                    <div className="flex items-center p-3 text-center">
                      <FavoriteIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user?.likePost?.posts?.length}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        Likes on posts
                      </span>
                    </div>
                    <div className="flex items-center p-3 text-center">
                      <PersonIcon />
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600 mx-1">
                        {user?.followersUsers?.followers?.length}
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
      }

    </div>
  )
}

export default Profile