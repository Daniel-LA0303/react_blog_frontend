import axios from 'axios';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner/Spinner';

const UserConfirmed = () => {

    const params = useParams();
    const route = useNavigate();

    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);

    useEffect(() => {
        if(user._id){
            route('/');
        }
    }, [user]);

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const {data} = await axios.get(`http://localhost:4000/api/users/confirm/${params.id}`);
            } catch (error) {
                console.log(error);
            }
        }
        confirmUser();
    }, [])
    
  return (
    <>
        {loading ? (
            <Spinner />
        ):(
            <div className='flex justify-center items-center h-screen'>
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <p>
                        {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2021</h5> */}
                    </p>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Correctly confirmed user</p>
                    <Link to={'/login'} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Login
                        <svg aria-hidden="true" className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" ></path></svg>
                    </Link>
                </div>
            </div>
        )}
    </>


  )
}

export default UserConfirmed