import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faFile } from '@fortawesome/free-solid-svg-icons';

import CakeIcon from '@mui/icons-material/Cake';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonIcon from '@mui/icons-material/Person';

import { useDispatch, useSelector } from 'react-redux';
import { getOneUserAction, getPageProfileUserAction, getUserAction } from '../../StateRedux/actions/postAction';

import Sidebar from '../../components/Sidebar/Sidebar';

import { useNavigate, useParams } from 'react-router-dom';

import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import LoadingPosts from '../../components/Spinner/LoadingPosts';
import Post from '../../components/Post/Post';
import ProfileView from '../../components/ProfileView/ProfileView';


const Profile = () => {

  const params = useParams();
  const dispatch = useDispatch();
  
  const userP = useSelector(state => state.posts.user);
  const loading = useSelector(state => state.posts.loading);

  const posts = useSelector(state => state.posts.pageProfileUser.posts);
  const user = useSelector(state => state.posts.pageProfileUser.user);
  const [isFollow, setIsFollow] = useState(null);


  useEffect(() => {
    dispatch(getPageProfileUserAction(params.id));
  }, [params.id]);



  if(loading) return <Spinner/>
  return (
    <div className=''>
      <Sidebar />
      <section className="pt-8 sm:pt-8 ">

        {
          user === undefined ? 'Cargando' : 
          <ProfileView 
            user={user}
            userP={userP}
            posts={posts}
            setIsFollow={setIsFollow}
            isFollow={isFollow}

        />
        }

        
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