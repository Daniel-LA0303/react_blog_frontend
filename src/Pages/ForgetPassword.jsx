import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import Spinner from '../components/Spinner/Spinner';

const ForgetPassword = () => {

    const route = useNavigate();

    const user = useSelector(state => state.posts.user);
    const loading = useSelector(state => state.posts.loading);

    useEffect(() => {
        if(user._id){
            route('/');
        }
    }, [user]);

    const[email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([email].includes('')){
            alert('error');
            return;
        }
        try {
            await axios.post('http://localhost:4000/api/users/new-password', {email});
        } catch (error) {
            console.log(error);
        }
        route('/');
    }

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