import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    const dark = !globalData.themeGlobal;

    /**
     * route
     */
    const route = useNavigate();

    /**
     * states
     */
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

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
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            showConfirmSwal({
                message: "Field is required!",
                status: "warning",
                confirmButton: true,
                cancelButton: false,
            });
            return;
        }

        setSubmitting(true);
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
        } catch (error: any) {
            showConfirmSwal({
                message: error.response?.data?.msg || error.message,
                status: "error",
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
                    <h1 className={`text-xl sm:text-2xl font-bold text-center tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Forgot your password?
                    </h1>
                    <p className={`mt-2 text-sm text-center ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Enter your email and we'll send you a link to reset it.
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className={`block mb-1.5 text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
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
                            {submitting ? 'Sending…' : 'Send reset link'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default ForgetPassword