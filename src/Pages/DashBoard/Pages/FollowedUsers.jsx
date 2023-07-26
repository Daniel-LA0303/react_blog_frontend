import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Sidebar from '../../../components/Sidebar/Sidebar';

import { useParams } from 'react-router-dom';
import UserCard from '../../../components/UserCard/UserCard';
import LoadingUser from '../../../components/Spinner/LoadingUser';
import { useSelector } from 'react-redux';

const FollowedUsers = () => {

    const params = useParams();
    const[users, setUsers] = useState([]);
    const[charge, setCharge] =useState(false);
    const theme = useSelector(state => state.posts.themeW);
    const link = useSelector(state => state.posts.linkBaseBackend);

    useEffect(() => {
        const getOneUserAPI = async () => {
            try {
              const res = await axios.get(`${link}/users/get-profile-follows/${params.id}`);
              setUsers(res.data.followedUsers.followed);
              setCharge(true);
            } catch (error) {
                console.log(error.message);
            }
        }
          getOneUserAPI();       
    }, [])

  return (
    <div className={`${theme ? 'text-black' : 'text-white'}`}>
        <Sidebar />
        <h2 className=' text-center my-5 text-2xl'>Followed</h2>
        <div className='flex flex-row mt-0 md:mt-10 mx-auto w-full md:w-10/12 lg:w-8/12'>
        {!charge ? (
            <>
              <LoadingUser />
            </>
          ): <div className='grid gap-2 md:grid-cols-2 w-full mx-5 md:mx-0'>
              {users.length === 0 ? (
                <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-10 text-3xl`}>There is nothing around here yet</p>
              ): (
                <>
                  {users.map(user => (
                      <UserCard 
                          key={user._id}
                          user={user}
                      />
                  ))}
                </>
              )}

          </div>}
        </div>

    </div>
  )
}

export default FollowedUsers