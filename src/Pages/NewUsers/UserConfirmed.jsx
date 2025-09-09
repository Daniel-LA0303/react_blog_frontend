import axios from 'axios';
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

/**
 * icons
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';

const UserConfirmed = () => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal, showAutoSwal } = useSwal();

    /**
     * route
     */
    const params = useParams();
    const route = useNavigate();

    /**
     * useEffect
     */
    useEffect(() => {
        if (userAuth.userId) {
            route('/');
        }
    }, [userAuth]);

    useEffect(() => {
        const confirmUser = async () => {
            try {
                const { data } = await axios.get(`${globalData.link}/users/confirm/${params.id}`);

                console.log(data);
                showAutoSwal({
                    message: data.message,
                    status: "success",
                    timer: 2000
                });

            } catch (error) {
                showConfirmSwal({
                    message: error.response.data.message,
                    status: "error",
                    confirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        route('/');
                    }
                });

            }
        }
        confirmUser();
    }, [])

    return (
        <>
            <div className={`relative ${globalData.themeGlobal
                ? "bgt-white text-black"
                : "bgt-black text-white"
                } flex size-full min-h-screen flex-col items-center justify-center p-4`}>
                <div className="w-full max-w-md space-y-8">

                    <div className={`${globalData.themeGlobal
                        ? " bgt-light text-black"
                        : "bgt-dark hover:bg-zinc-700 text-white"
                        } shadow-lg rounded-xl p-8 sm:p-10 text-center`}>

                        <FontAwesomeIcon
                            icon={faUserCheck}
                            className="mx-auto h-16 w-16 text-blue-600 dark:text-blue-400"
                        />

                        <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            User confirmed!
                        </h1>

                        <div className="mt-8">
                            <Link
                                to="/login"
                                className="w-full inline-block text-center transform rounded-md bg-blue-600 px-5 py-3 text-base font-medium text-white transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserConfirmed