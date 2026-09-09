import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';
import { UserCheckIcon } from '../../utils/iconsUtils';

const UserConfirmed = () => {
    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal, showAutoSwal } = useSwal();
    const dark = !globalData.themeGlobal;

    /**
     * route
     */
    const params = useParams();
    const route = useNavigate();

    const [loading, setLoading] = useState(true);

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
                showAutoSwal({
                    message: data.message,
                    status: "success",
                    timer: 2000
                });
            } catch (error: any) {
                showConfirmSwal({
                    message: error.response.data.message,
                    status: "error",
                    confirmButton: true,
                    cancelButton: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                        route('/');
                    }
                });
            } finally {
                setLoading(false);
            }
        }
        confirmUser();
    }, [])

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300
                ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}
        >
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-md"
            >
                <div
                    className={`rounded-2xl border p-8 sm:p-10 text-center transition-colors duration-200
                        ${dark
                            ? 'bg-[#27272A] border-gray-800'
                            : 'bg-white border-gray-100'
                        }`}
                >
                    {loading ? (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <div
                                className={`h-10 w-10 rounded-full border-4 border-t-transparent animate-spin
                                    ${dark ? 'border-gray-700' : 'border-gray-200'}`}
                            />
                            <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Confirming your account…
                            </p>
                        </div>
                    ) : (
                        <>
                            <motion.div
                                initial={{ scale: 0.6, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 18, delay: 0.1 }}
                                className="flex justify-center"
                            >
                                <UserCheckIcon isDark={globalData.themeGlobal} />
                            </motion.div>

                            <h1
                                className={`mt-6 text-2xl sm:text-3xl font-bold tracking-tight
                                    ${dark ? 'text-white' : 'text-gray-900'}`}
                            >
                                User confirmed!
                            </h1>
                            <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Your account is ready. You can now log in.
                            </p>

                            <div className="mt-8">
                                <Link
                                    to="/login"
                                    className="w-full inline-block text-center rounded-xl bg-[#2563EB] px-5 py-3
                                        text-sm font-medium text-white transition-all duration-200
                                        hover:bg-[#1d4ed8] hover:scale-[1.02]
                                        focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
                                        focus:ring-offset-transparent"
                                >
                                    Log In
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default UserConfirmed