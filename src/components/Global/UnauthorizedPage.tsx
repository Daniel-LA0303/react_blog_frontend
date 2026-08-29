import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

export default function UnauthorizedPage() {

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal
    const navigate = useNavigate();

    return (
        <section className={`min-h-screen flex items-stretch transition-colors duration-300 ${dark ? 'bg-[#0a0a0a]' : 'bg-[#f5f4f0]'}`}>

            {/* Left panel — brand */}
            <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="hidden lg:flex flex-col justify-between w-5/12 xl:w-2/5 bg-[#0a0a0a] px-14 py-14"
            >
                {/* Logo */}
                <div>
                    <span className="text-white text-2xl font-bold tracking-tight" style={{ fontFamily: 'Georgia, serif' }}>
                        DLTechBlog
                    </span>
                    <p className="mt-2 text-xs text-gray-600 tracking-wide">Where developers share ideas that matter.</p>
                </div>

                {/* Message block instead of quote */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <p className="text-white text-xl leading-relaxed mb-3" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                        "Not every door is meant to open for everyone."
                    </p>
                    <p className="text-gray-600 text-xs tracking-widest uppercase">— Access Control</p>
                </motion.div>
            </motion.div>

            {/* Right panel — content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex-1 flex items-center justify-center px-8 py-16 ${dark ? 'bg-[#27272A]' : 'bg-[#f5f4f0]'}`}
            >
                <div className="w-full max-w-sm">

                    {/* Mobile brand */}
                    <div className="lg:hidden mb-10">
                        <span className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                            DLTechBlog
                        </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.45, delay: 0.15 }}
                        className="mb-8"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.2 }}
                        className="mb-12"
                    >
                        <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: 'Georgia, serif' }}>
                            Access denied.
                        </h1>
                        <p className={`mt-2 text-sm ${dark ? 'text-gray-500' : 'text-gray-500'}`}>
                            You don't have permission to view this page.
                        </p>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="space-y-3"
                    >
                        <motion.button
                            type="button"
                            onClick={() => navigate(-1)}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white rounded-xl transition-colors"
                            style={{ backgroundColor: '#2563EB' }}
                            onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
                            onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = '#2563EB')}
                        >
                            Go back <span className="opacity-60">→</span>
                        </motion.button>

                        <Link
                            to="/"
                            className={`w-full flex items-center justify-center py-3.5 text-sm font-semibold rounded-xl border transition-colors ${dark
                                    ? 'border-gray-700 text-gray-300 hover:border-gray-500'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                }`}
                        >
                            Back to home
                        </Link>
                    </motion.div>

                    {/* Footer */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.45 }}
                        className={`mt-10 text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}
                    >
                        Think this is a mistake?{' '}
                        <Link to="/contact" className="font-semibold text-[#2563EB] hover:text-blue-700 transition-colors">
                            Contact support
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </section>
    );
}