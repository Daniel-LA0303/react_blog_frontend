import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Login = () => {

    const[data, setData]=useState({
        email: '',
        password: ''
    });

    const{email, password} = data;

    const getData = (e) => {
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([email, password].includes('')){
            alert('error');
            return;
        }
        try {
            const res = await axios.post('http://localhost:4000/api/users/login', data);
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <section className="">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl text-center font-bold text-gray-900 md:text-2xl dark:text-white">
                        Sign in to your account
                    </h1>
                    <form 
                        onSubmit={handleSubmit}
                        className="space-y-4 md:space-y-6"
                    >
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm text-white">Your email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="name@company.com" 
                                required="" 
                                onChange={getData}
                                value={email}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm text-white">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required="" 
                                onChange={getData}
                                value={password}
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <Link to={'/forget-password'} className="text-white">Forgot password?</Link>
                        </div>
                        <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Sign in</button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet? <Link to={'/register'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Login