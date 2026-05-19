import axios from 'axios';
import { useEffect, useState } from 'react';

/**
 * route
 */
import { useNavigate } from 'react-router-dom';

/**
 * hooks context
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';


const ForgetPassword = () => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal, showAutoSwal } = useSwal();

    /**
     * route
     */
    const route = useNavigate();

    /**
     * states
     */
    const [email, setEmail] = useState('');

    /**
     * useEffect
     */
    useEffect(() => {
        if (userAuth.userId) {
            route('/');
        }
    }, [userAuth]);


    /**
     * functions
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if ([email].includes('')) {
            showConfirmSwal({
                message: "Flied is requiered!",
                status: "warning",
                confirmButton: true,
            });
            return;
        }
        try {
            const res = await axios.post(`${globalData.link}/users/new-password`, { email });

            showAutoSwal({
                message: res.data.msg || "Check your email for more info",
                status: "success",
                timer: 1500
            });

            setTimeout(() => {
                route('/');
            }, 2000);
        } catch (error) {
            console.log(error);
            showConfirmSwal({
                message: error.response?.data?.msg || error.message,
                status: "error",
                confirmButton: true,
            });
        }

    }

    return (
        <>
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
        </>
    )
}

export default ForgetPassword