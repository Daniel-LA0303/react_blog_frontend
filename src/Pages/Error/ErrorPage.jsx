import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const ErrorPage = () => {

    const navigate = useNavigate();

    const location = useLocation();
    const { state } = location;

    const theme = useSelector(state => state.posts.themeW);

    useEffect(() => {
        console.log(state);
    }, [])

  return (
    <div class="w-full px-0 sm:px-16 md:px-0 h-screen flex items-center justify-center">
        <div class={`${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'}  border-gray-200 flex flex-col items-center justify-center px-4 md:px-8 lg:px-24 py-8 rounded-lg shadow-2xl`}>
            <p class="text-6xl md:text-7xl lg:text-9xl font-bold tracking-wider text-gray-300">{state.message.status}</p>
            <p class="text-2xl md:text-3xl lg:text-5xl font-bold tracking-wider text-gray-500 mt-4">{state.message.message}</p>
            <p class="text-gray-500 mt-8 py-2 border-y-2 text-center">{state.message.desc}</p>
            <button onClick={() => navigate('/')} class="mt-8 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded-full">Go Home</button>
        </div>
    </div>
  )
}

export default ErrorPage