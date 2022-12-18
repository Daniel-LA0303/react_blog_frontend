import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingUser from '../../../components/Spinner/LoadingUser';
import UserCard from '../../../components/UserCard/UserCard';


const FollowersUsers = () => {
    const params = useParams();
    const[users, setUsers] = useState([]);

    useEffect(() => {
        const getOneUserAPI = async () => {
            try {
              const res = await axios.get(`http://localhost:4000/api/users/get-profile-follows/${params.id}`);
              console.log(res.data);
              setUsers(res.data.followersUsers.followers);

            } catch (error) {
                console.log(error);
            }
          }
          setTimeout(() => {
            getOneUserAPI();
          }, 1000);
          
    }, [])
  return (
    <div>
        <Sidebar />
        <h2 className=' text-center my-5 text-2xl'>Followers</h2>
        <div className='flex flex-wrap justify-center sm:justify-start items-center mx-auto w-full'>
          {users.length === 0 ? (
            <>
              <LoadingUser />
            </>
          ): <>
            {users.map(user => (
                <UserCard 
                    key={user._id}
                    user={user}
                />
            ))}
          </>}

        </div>
    </div>
  )
}

export default FollowersUsers