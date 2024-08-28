import axios from 'axios';
import React, { useEffect, useState } from 'react'

import { useParams, useNavigate, Link } from 'react-router-dom'

import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../components/Spinner/Spinner';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';
import Alert1 from '../../components/Alerts/Alert1';

const NewPassword = () => {

    /**
     * route
     */
    const params = useParams();
    const route = useNavigate();

    /**
     * states
     */
    const[password, setPassword] = useState('');
    const[newPassword, setNewPassword] = useState(false);
    const[tokenValid, setTokenValid] = useState(false);

    /**
     * states redux
     */
    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);
    const alert1 = useSelector(state => state.posts.alertMSG);
    const link = useSelector(state => state.posts.linkBaseBackend);
    const dispatch = useDispatch();
    const alertMsg = (alert) => dispatch(alertOnAction(alert));
    const alertOff = () => dispatch(alertOffAction());

    /**
     * useEffect
     */
    useEffect(() => {
        if(user._id){
            route('/');
        }
    }, [user]);

    useEffect(() => {
        alertOff();
    }, []);

    useEffect(() => {
        const tokenCheck = async () => {
            try {
                const res = await axios.get(`${link}/users/new-password/${params.id}`);
                setTokenValid(true);

            } catch (error) {
                console.log(error);
                setTimeout(() => {
                    route('/');
                }, 3000);
            }
        }
        tokenCheck();
    }, []);

    /**
     * functions
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if([password].includes('')){
            alert('error');
            return;
        }
        try {
            const res = await axios.post(`${link}/users/new-password/${params.id}`,{password});
            alertMsg({
                msg: res.data.msg,
                error: false
            })
            console.log(res);
            setNewPassword(true);
        } catch (error) {
            alertMsg({
                msg: error.response.data.msg,
                error: true
            })
        }
    }
    const {msg} = alert1;
    return (
    <>
        {loading ? (
            <Spinner />
        ):(
            <section className="">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            {tokenValid ? (
                                <> 
                                    {}
                                    <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl dark:text-white">
                                        New password
                                    </h1>
                                    {msg && <Alert1 alertMsg={alert1} />}
                                    <form 
                                        className="space-y-4 md:space-y-6"
                                        onSubmit={handleSubmit}    
                                    >
                                        <div>
                                            <label htmlFor="password" className="block mb-2 text-sm text-white">New password</label>
                                            <input 
                                                type="password" 
                                                name="password" 
                                                id="password" 
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                placeholder="••••••••" 
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>

                                        <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Send</button>
                                    </form>
                                </>
                            ): (
                                <p className='text-center text-white text-3xl'>Invalid token</p>
                            )}
                            {newPassword && (
                                <div className=''>
                                    <Link to={'/login'} className="w-full my-3 text-white bg-sky-600 py-3 px-4 rounded">Login</Link>
                                </div>  
                            )}
                        </div>
                    </div>
                </div>
            </section>
        )}
    </>
    
  )
}

export default NewPassword