import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar/Sidebar'
import LoadingUser from '../../../components/Spinner/LoadingUser';
import UserCard from '../../../components/UserCard/UserCard';


const FollowersUsers = () => {
  /**
   * route
   */
  const params = useParams();
  const navigate = useNavigate();
  /**
   * states
   */
  const[users, setUsers] = useState([]);
  const[loading, setLoading] = useState(false);

  /**
   * states Redux
   */
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);
  const userP = useSelector(state => state.posts.user);

  /**
   * useEffect
   */
  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-dashboard-follow-user/${params.id}?user=${userP._id}`)
      .then((response) => {
        setUsers(response.data.followers); 
        console.log(response.data);
        setTimeout(() => {
          setLoading(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        if(error.code === 'ERR_NETWORK'){
          const data ={
            error: true,
              message: {
                status: null,
                message: 'Network Error',
                desc: null
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }else{
          const data = {
            error: true,
              message: {
                status: error.response.status,
                message: error.message,
                desc: error.response.data.msg
              }
          }
          setLoading(false);
          navigate('/error', {state: data});
        }
      })
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
              {users.length === 0 ? (
                <p className={`${theme ? 'text-black' : 'text-white'} text-center m-auto my-1 text-3xl`}>There is nothing around here yet</p>
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