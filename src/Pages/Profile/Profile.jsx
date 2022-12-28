import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faFile } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, getUserAction } from '../../StateRedux/actions/postAction';

import Sidebar from '../../components/Sidebar/Sidebar';

import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';


const Profile = () => {

  const params = useParams();
  const route = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(state => state.posts.userView);
  const userP = useSelector(state => state.posts.user);
  const PF = useSelector(state => state.posts.PFLink);
  // console.log(userP);

  const [userC, setUserC] = useState({});
  const [isFollow, setIsFollow] = useState(false);

  useEffect(() => {
    const getOneUserState = () => dispatch(getOneUserAction(params.id));
    getOneUserState();  
}, []);

useEffect(() => {
  const getOneUserAPI = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/users/get-profile/${params.id}`);
      console.log(res.data);
      setUserC(res.data);
      const userProfileFound = res.data.followersUsers.followers.includes(userP._id);
      console.log(userProfileFound);
      if(userProfileFound){
        setIsFollow(true);
      }
    } catch (error) {
        console.log(error);
    }
  }
  getOneUserAPI();
}, []);

useEffect(() => {
  const getUserRedux = token => dispatch(getUserAction(token));
  const token = localStorage.getItem('token');
  if(token){
    getUserRedux(JSON.parse(token));
  }
}, []);

  // console.log(user);
  const handleClickFollow = async() => {
    setIsFollow(!isFollow);
    try {
      const res = await axios.post(`http://localhost:4000/api/users/user-follow/${params.id}`, userP);
      // console.log(res.data);
      // setUserC(res.data);
    } catch (error) {
        // console.log(error);
    }
  }

  if(Object.keys(user) == ''  || Object.keys(userC) == '') return <Spinner />
  return (
    <div className=' bg-slate-600 '>
      <Sidebar />
      <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto">
          <div className=" flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-2 sm:px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <img alt="..." src={PF+user.profilePicture} className="shadow-xl image_profile  h-auto align-middle border-none  -m-16  lg:-ml-16 max-w-250-px" />  
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
                        {user.numberPost}
                      </span>
                      <span className="text-sm text-blueGray-400">
                        <FontAwesomeIcon icon={faUser}  className=' text-lg text-blue-700 mx-1'/>
                        Followers
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center ">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {user.name}
                </h3>
                
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  {user.info.desc}
                </div>
                <div className="mb-2 text-blueGray-600 w-3/5 mx-auto flex justify-center">
                    <h2 className=' font-bold'>Skills: {''}</h2>   
                    {user.info.skills}
                  </div>  
                <div className='sm:w-3/5 mx-auto flex'>
                  <div className="mb-2 text-blueGray-600 w-full sm:w-2/4">
                    <h2 className=' font-bold'>Work: </h2>   
                    {user.info.work}
                  </div>
                  <div className="mb-2 text-blueGray-600 w-full sm:w-2/4">
                    <h2 className=' font-bold'>Education: </h2>   
                    {user.info.education}
                  </div>

                </div>             
              </div>
              <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-9/12 px-4">
                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                      An artist of considerable range, Jenna the name taken
                      by Melbourne-raised, Brooklyn-based Nick Murphy
                      writes, performs and records all of his own music,
                      giving it a warm, intimate feel with a solid groove
                      structure. An artist of considerable range.
                    </p>
                    <a className="font-normal text-pink-500">
                      Show more
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <footer className="relative  pt-8 pb-6 mt-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center md:justify-between justify-center">
              <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                <div className="text-sm text-blueGray-500 font-semibold py-1">
                  Made with <a href="https://www.creative-tim.com/product/notus-js" className="text-blueGray-500 hover:text-gray-800" target="_blank">Notus JS</a> by <a href="https://www.creative-tim.com" className="text-blueGray-500 hover:text-blueGray-800" target="_blank"> Creative Tim</a>.
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