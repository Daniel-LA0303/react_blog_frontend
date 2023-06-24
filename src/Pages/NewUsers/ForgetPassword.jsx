import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import Spinner from '../../components/Spinner/Spinner';
import { alertOffAction, alertOnAction } from '../../StateRedux/actions/postAction';
import Alert1 from '../../components/Alerts/Alert1';

const ForgetPassword = () => {

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

    const[email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([email].includes('')){
            alertMsg({
                msg: "The field are required",
                error: true
            })
            return;
        }
        try {
            const res = await axios.post(`${link}/users/new-password`, {email});
            alertMsg({
                msg: res.data.msg,
                error: false
            })    
            setTimeout(() => {
                route('/');
            }, 3000);
        } catch (error) {
            console.log(error);
            alertMsg({
                msg: error.response.data.msg,
                error: true
            })
        }

    }
    const {msg} = alert1;
  return (
    <>{
        loading ? (
            <Spinner />
        ) : (
            <section className="">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl dark:text-white">
                                Forget password
                            </h1>
                            {msg && <Alert1 alertMsg={alert1} />}
                            <form 
                                className="space-y-4 md:space-y-6"
                                onSubmit={handleSubmit}    
                            >
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm text-white">Your Email</label>
                                    <input 
                                        type="text" 
                                        name="email" 
                                        id="email" 
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        placeholder="Email" 
                                        required="" 
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
        
                                <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Send a Email</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        )
    }</>
   
  )
}

export default ForgetPassword