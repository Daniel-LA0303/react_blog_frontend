import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Sidebar from '../../components/Sidebar/Sidebar'
import clientAuthAxios from '../../services/clientAuthAxios'
import { PlanI } from '../../interfaces/payment.interfaces'
import Spinner from '../../components/Spinner/Spinner'
import PlanCard from '../../components/Payment/PlanCard'





const Plans = () => {

    const [yearly, setYearly] = useState(false)

    const [plans, setPlans] = useState<PlanI[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { globalData } = useGlobalDataContext()

    const dark = !globalData.themeGlobal

    useEffect(() => {
        const getPlans = async () => {
            try {
                setLoading(true);
                const res = await clientAuthAxios.get('/payment/get-plans')
                setPlans(res.data.data)
            } catch (error) {
                console.error(error)
            }finally{
                setLoading(false);
            }
        }
        getPlans()
    }, []);

    if(loading) return <Spinner />

    return (
        <div>
            <Sidebar />
            <div className="max-w-5xl mx-auto px-4 py-12">

                {/* Heading */}
                <div className="text-center mb-8">
                    <h1 className={`text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Simple, transparent pricing
                    </h1>
                    <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Choose the plan that fits your creative workflow
                    </p>
                </div>

                {/* Billing toggle */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <span className={`text-sm font-medium ${!yearly ? (dark ? 'text-white' : 'text-gray-900') : (dark ? 'text-gray-500' : 'text-gray-400')}`}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setYearly(v => !v)}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                            ${yearly ? 'bg-[#2563EB]' : dark ? 'bg-gray-700' : 'bg-gray-300'}`}
                        aria-label="Toggle billing period"
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200
                            ${yearly ? 'translate-x-5' : 'translate-x-0'}`}
                        />
                    </button>
                    <span className={`text-sm font-medium ${yearly ? (dark ? 'text-white' : 'text-gray-900') : (dark ? 'text-gray-500' : 'text-gray-400')}`}>
                        Yearly
                    </span>
                    {yearly && (
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-xs font-medium bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full"
                        >
                            Save 20%
                        </motion.span>
                    )}
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <PlanCard key={plan._id} plan={plan} yearly={yearly} dark={dark} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Plans