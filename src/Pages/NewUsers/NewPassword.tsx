import axios from 'axios';
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/**
 * route
 */
import { useParams, useNavigate, Link } from 'react-router-dom'

/**
 * hooks
 */
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { useSwal } from '../../hooks/useSwal';

const NewPassword = () => {

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { globalData } = useGlobalDataContext();
    const { showConfirmSwal } = useSwal();
    const dark = !globalData.themeGlobal;

    /**
     * route
     */
    const params = useParams();
    const route = useNavigate();

    /**
     * states
     */
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState(false);
    const [tokenValid, setTokenValid] = useState(false);
    const [checkingToken, setCheckingToken] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    /**
     * useEffect
     */
    useEffect(() => {
        if (userAuth.userId) {
            route('/');
        }
    }, [userAuth]);

    useEffect(() => {
        const tokenCheck = async () => {
            try {
                await axios.get(`${globalData.link}/users/new-password/${params.id}`);
                setTokenValid(true);
            } catch (error) {
                setTokenValid(false);
                setTimeout(() => {
                    route('/');
                }, 3000);
            } finally {
                setCheckingToken(false);
            }
        }
        tokenCheck();
    }, []);

    /**
     * functions
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password.trim()) {
            showConfirmSwal({
                message: 'Please enter a new password',
                status: 'error',
                confirmButton: true,
                cancelButton: false,
            });
            return;
        }

        console.log(password.length);
        
        if (password.length < 4) {
            showConfirmSwal({
                message: 'Password must be at least 4 characters',
                status: 'error',
                confirmButton: true,
                cancelButton: false,
            });
            return;
        }

        setSubmitting(true);
        try {
            await axios.post(`${globalData.link}/users/new-password/${params.id}`, { password });
            setNewPassword(true);
        } catch (error: any) {
            showConfirmSwal({
                message: error?.response?.data?.message || 'Something went wrong, try again',
                status: 'error',
                confirmButton: true,
                cancelButton: false,
            });
        } finally {
            setSubmitting(false);
        }
    }

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
                    className={`rounded-2xl border p-8 sm:p-10 transition-colors duration-200
                        ${dark
                            ? 'bg-[#27272A] border-gray-800'
                            : 'bg-white border-gray-100'
                        }`}
                >
                    {checkingToken ? (
                        <div className="flex flex-col items-center gap-3 py-6">
                            <div
                                className={`h-10 w-10 rounded-full border-4 border-t-transparent animate-spin
                                    ${dark ? 'border-gray-700' : 'border-gray-200'}`}
                            />
                            <p className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Validating your link…
                            </p>
                        </div>
                    ) : !tokenValid ? (
                        <div className="text-center py-4">
                            <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Invalid or expired link
                            </h1>
                            <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Redirecting you to the home page…
                            </p>
                        </div>
                    ) : newPassword ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                            className="text-center py-4"
                        >
                            <h1 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Password updated!
                            </h1>
                            <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                You can now log in with your new password.
                            </p>
                            <Link
                                to="/login"
                                className="mt-6 w-full inline-block text-center rounded-xl bg-[#2563EB] px-5 py-3
                                    text-sm font-medium text-white transition-all duration-200
                                    hover:bg-[#1d4ed8] hover:scale-[1.02]
                                    focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
                                    focus:ring-offset-transparent"
                            >
                                Log In
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <h1 className={`text-xl sm:text-2xl font-bold text-center tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                                Set a new password
                            </h1>
                            <p className={`mt-2 text-sm text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                Choose a strong password you haven't used before.
                            </p>

                            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className={`block mb-1.5 text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                                    >
                                        New password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full rounded-xl px-3.5 py-2.5 text-sm transition-colors duration-150
                                            focus:outline-none focus:ring-2 focus:ring-[#2563EB]
                                            ${dark
                                                ? 'bg-[#1c1c1e] border border-gray-700 text-white placeholder-gray-600'
                                                : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                                            }`}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-medium text-white
                                        transition-all duration-200 hover:bg-[#1d4ed8] hover:scale-[1.02]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                        focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2
                                        focus:ring-offset-transparent"
                                >
                                    {submitting ? 'Saving…' : 'Save new password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default NewPassword