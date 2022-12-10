import React, {useEffect} from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, getUserAction } from '../StateRedux/actions/postAction';

import Sidebar from '../components/Sidebar/Sidebar';

import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../components/Spinner/Spinner';


const Profile = () => {

  const params = useParams();
  const route = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(state => state.posts.userView);
  
  const PF = useSelector(state => state.posts.PFLink);

  useEffect(() => {
    const getOneUserState = () => dispatch(getOneUserAction(params.id));
    getOneUserState();  
}, []);

useEffect(() => {
  const getUserRedux = token => dispatch(getUserAction(token));
  const token = localStorage.getItem('token');
  if(token){
    getUserRedux(JSON.parse(token));
  }
}, []);



  if(Object.keys(user) == '') return <Spinner />
  return (
    <div className=' bg-slate-600 '>
      <Sidebar />
      <section className="pt-16 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto">
          <div className=" flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg mt-16">
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full px-4 flex justify-center">
                  <img alt="..." src={PF+user.profilePicture} className="shadow-xl image_profile w-80 h-auto align-middle border-none  -m-16  lg:-ml-16 max-w-250-px" />              
                </div>
                <div className="w-full px-4 text-center mt-20">
                  <div className="flex justify-center py-4 lg:pt-4 pt-8">
                    <div className="mr-4 p-3 text-center">
                      <span className="text-sm font-bold block uppercase tracking-wide text-blueGray-600">
                        {user.numberPost}
                      </span>
                      <span className="text-sm text-blueGray-400">Posts</span>
                    </div>
                    <div className="mr-4 p-3 text-center">
                      <span className=" text-sm font-bold block uppercase tracking-wide text-blueGray-600">
                        {new Date(user.createdAt).toDateString()}
                      </span>
                      <span className="text-sm text-blueGray-400">Joined on</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <h3 className="text-xl font-semibold leading-normal text-blueGray-700 mb-2">
                  {user.name}
                </h3>
                <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                  {user.info.desc}
                </div>
                <div className="mb-2 text-blueGray-600 mt-10">
                  {user.info.work}
                </div>
                <div className="mb-2 text-blueGray-600">   
                  {user.info.education}
                </div>
                <div className="mb-2 text-blueGray-600">
                  {user.info.skills}
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