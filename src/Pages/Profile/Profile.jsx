import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faFile } from '@fortawesome/free-solid-svg-icons';

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

// useEffect(() => {
//   const getUserRedux = token => dispatch(getUserAction(token));
//   const token = localStorage.getItem('token');
//   if(token){
//     getUserRedux(JSON.parse(token));
//   }
// }, []);

  // console.log(user);
  const handleClickFollow = async() => {
    setIsFollow(!isFollow);
    try {
      const res = await axios.post(`${link}/users/user-follow/${params.id}`, userP);
    } catch (error) {
        console.log(error)
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
                <div className="w-full px-4 flex justify-center">
                  <img alt="..." 
                    src={           
                      user?.profilePicture.secure_url != '' ? user.profilePicture.secure_url : 
                      '/avatar.png'  } 
                    className=" shadow-xl image_profile  h-auto align-middle border-none  -m-16  lg:-ml-16 max-w-250-px" />  
                </div>
                <div className='w-full flex justify-end'>
                  {(userC._id === userP._id || Object.keys(userP) == '') ? null: (                    
                  <button 
                    type="button" 
                    onClick={() => handleClickFollow()}
                    className={`focus:outline-none text-white ${isFollow ? 'bg-orange-500 hover:bg-orange-800' : 'bg-purple-800 hover:bg-purple-900'} focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-1.5 mb-2 `}
                    >{isFollow ? 'Following' : 'Follow'}
                  </button>  
                  )}
                </div>            
                <div className="w-full px-4 text-center mt-10">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className=" p-3 text-center">
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600">
                        {user.numberPost}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        <FontAwesomeIcon icon={faFile} className=' text-lg text-green-600 mx-1'/>
                        Posts
                      </span>
                    </div>
                    
                    <div className=" p-3 text-center">
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600">
                        {user.likePost.posts.length}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        <FontAwesomeIcon icon={faHeart} className=' text-lg text-red-500 mx-1'/>
                        Likes
                      </span>
                    </div>
                    <div className=" p-3 text-center">
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600">
                        {user.followersUsers.conutFollowers}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        <FontAwesomeIcon icon={faUser}  className=' text-lg text-blue-700 mx-1'/>
                        Followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" ">
                <h3 className={`${theme ? 'bgt-light ' : 'bgt-dark text-white'} text-xl font-semibold leading-normal mb-2`}>
                  {user.name}
                </h3>
                {user.info == null ? null: (
                  <>
                    <div className="mb-2 text-left block sm:text-center sm:flex sm:justify-center">
                        <h2 className=' text-xs sm:text-base font-bold mr-1'>Skills: {''}</h2>   
                        <p>{user.info.skills}</p>
                    </div>  
                    <div className='mx-auto block sm:flex'>
                      <div className="mb-2 text-left sm:text-center  w-full sm:w-2/4">
                        <h2 className=' text-xs sm:text-base font-bold'>Work: </h2>   
                        {user.info.work}
                      </div>
                      <div className="mb-2 text-left sm:text-center w-full sm:w-2/4">
                        <h2 className=' text-xs sm:text-base font-bold'>Education: </h2>   
                        {user.info.education}
                      </div>
                    </div>
                  </>
                )}
 

              </div>
              {user.info == null ? null: (
                <>
                  <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-9/12 px-4">
                        <p className=' text-left text-2xl mb-2'>Description:</p>
                        <p className=" text-left mb-4 text-lg leading-relaxed text-blueGray-700">
                          {user.info.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}


            </div>
          </div>
        </div>
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
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