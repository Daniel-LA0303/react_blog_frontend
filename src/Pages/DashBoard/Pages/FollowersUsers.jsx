import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingUser from '../../../components/Spinner/LoadingUser';
import UserCard from '../../../components/UserCard/UserCard';
import { getPageDasboardFollowtUserAction } from '../../../StateRedux/actions/postAction';
import Spinner from '../../../components/Spinner/Spinner';


const FollowersUsers = () => {
    const dispatch = useDispatch();
    const params = useParams();
    const theme = useSelector(state => state.posts.themeW);
    const users = useSelector(state => state.posts.pagesDashboardFollowedFollowersUser.followers);
    const loading = useSelector(state => state.posts.loading);

    useEffect(() => {
      dispatch(getPageDasboardFollowtUserAction(params.id));
    }, [params.id]);

  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
        <Sidebar />
        <h2 className=' text-center my-5 text-2xl'>Followers</h2>
        <div className='flex flex-row mt-0 md:mt-0 mx-auto w-full md:w-10/12 lg:w-8/12'>
           {loading ? (
            <>
              <LoadingUser />
            </>
          ): <>
              {users === undefined ? (
                <p className={` text-center m-auto my-1 text-3xl`}>There is nothing around here yet</p>
              ): (
                <div className='grid gap-2 md:grid-cols-2 w-full mx-5 md:mx-0'>
                  {users.map(user => (
                      <UserCard 
                          key={user._id}
                          user={user}
                      />
                  ))}
                </div>
              )}

          </>}

        </div>
    </div>
  )
}

export default FollowersUsers