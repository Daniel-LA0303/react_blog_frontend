import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Alert1 from '../../components/Alerts/Alert1';
import Spinner from '../../components/Spinner/Spinner';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';

const UserConfirmed = () => {

    const params = useParams();
    const route = useNavigate();

    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);
    const alert1 = useSelector(state => state.posts.alertMSG);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const dispatch = useDispatch();
    const alertMsg = (alert) => dispatch(alertOnAction(alert));
    const alertOff = () => dispatch(alertOffAction());

    useEffect(() => {
        if(user._id){
            route('/');
        }
    }, [user]);

    useEffect(() => {
        alertOff();
    }, [])

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const {data} = await axios.get(`${link}/users/confirm/${params.id}`);
                alertMsg({
                    msg: data.msg,
                    error: false
                }); 
            } catch (error) {
                console.log(error);
                alertMsg({
                    msg: error.response.data.msg,
                    error: true
                }); 
            }
            setTimeout(() => {
                alertOff();
            }, 4000);
        }
        confirmUser();
    }, [])

    const {msg} = alert1;
    
  return (
    <>
        {loading ? (
            <Spinner />
        ):(
            <div className='flex mx-auto justify-center items-center h-screen'>
                <div className=" p-6 w-full sm:w-2/5 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                    {msg && <Alert1 alertMsg={alertMsg} />}
                    {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Correctly confirmed user</p> */}
                    <Link to={'/login'} className="w-full sm:w-40 inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
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