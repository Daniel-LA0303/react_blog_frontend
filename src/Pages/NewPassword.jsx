import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

const NewPassword = () => {

    const params = useParams();

    const[password, setPassword] = useState('');
    const[newPassword, setNewPassword] = useState(false);
    const[tokenValid, setTokenValid] = useState(false);
    console.log(params);

    useEffect(() => {
        const tokenCheck = async () => {
            try {
                await axios.get(`http://localhost:4000/api/users/new-password/${params.id}`);
                setTokenValid(true);
            } catch (error) {
                console.log(error);
            }
        }
        tokenCheck();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if([password].includes('')){
            alert('error');
            return;
        }

        try {

            const {data} = await axios.post(`http://localhost:4000/api/users/new-password/${params.id}`,{password});
            // setAlerta({
            //     msg: data.msg,
            //     error: false
            // });
            console.log(data);
            setNewPassword(true);
        } catch (error) {
            console.log(error);
        }
    }

  return (
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
                                        // required="" 
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <button type="submit" className="w-full text-white bg-sky-600 py-2 rounded">Send</button>
                            </form>
                        </>
                    ): (
                        <p className='text-center text-white text-3xl'>Token no valido</p>
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
  )
}

export default NewPassword