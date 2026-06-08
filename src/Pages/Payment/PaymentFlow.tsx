import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import clientAuthAxios from '../../services/clientAuthAxios'
import { PaymentFlowI } from '../../interfaces/payment.interfaces'
import Spinner from '../../components/Spinner/Spinner'
import { useAuth } from '../../context/UserAuthContex'
import { useSwal } from '../../hooks/useSwal'

const brandIcons: Record<string, string> = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
}

const PaymentFlow = () => {

    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal
    const { userAuth } = useAuth();

    const { showConfirmSwal, showAutoSwal } = useSwal()

    const params = useParams()
    const route = useNavigate();

    const [searchParams] = useSearchParams()
    const [data, setData] = useState<PaymentFlowI>()
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const interval = searchParams.get('interval') as 'YEAR' | 'MONTH' ?? 'MONTH'
    const isYearly = interval === 'YEAR'

    useEffect(() => {

        if (!userAuth.plan?.isFree) {
            console.log("This user has a suscription");

        }

        const getPlan = async () => {
            try {
                const res = await clientAuthAxios.get(`/payment/get-plan-by-name/${params.id}`)
                setData(res.data.data);
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        getPlan();
    }, [params.id]);

    if (loading) return <Spinner />
    if (!data) return null

    const { plan, method } = data

    const monthlyPrice = plan.price
    const yearlyPrice = Math.round(plan.price * 0.8 * 12)
    const displayPrice = isYearly ? yearlyPrice : monthlyPrice

    const handlePay = async () => {
        const body = {
            planId: plan._id,
            paymentMethodId: method._id,
            price: displayPrice,
            currency: plan.currency, // always USD
            interval,
            userId: userAuth.userId
        }

        try {
            setPaying(true)
            const res = await clientAuthAxios.post('/payment/subscribe', body)
            console.log(res.data)
            console.log(body);

            setTimeout(() => {
                route(`/profile/${userAuth.userId}`);
            }, 1500);
            showAutoSwal({ message: res.data.data.message, status: 'success', timer: 1500 })

            // navigate to success page
        } catch (error: any) {
            console.error(error);
            showConfirmSwal({
                message: error.response?.data?.message || 'Error deleting the reply',
                status: 'error',
                confirmButton: true,
            })
        } finally {
            setPaying(false)
        }
    }

    const base = dark ? 'bg-[#18181B] text-white' : 'bg-gray-50 text-gray-900'
    const card = dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'

    return (
        <div className={`min-h-screen ${base} flex items-center justify-center px-4 py-12`}>
            <div className="w-full max-w-md flex flex-col gap-4">

                {/* Title */}
                <div className="mb-2">
                    <h1 className="text-xl font-bold">Confirm your plan</h1>
                    <p className={`text-sm mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Review your selection before proceeding
                    </p>
                </div>

                {/* Plan summary */}
                <div className={`rounded-2xl border p-5 flex flex-col gap-3 ${card}`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-base">{plan.name.charAt(0) + plan.name.slice(1).toLowerCase()} plan</p>
                            <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.description}</p>
                        </div>
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${isYearly ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                            {isYearly ? 'Yearly' : 'Monthly'}
                        </span>
                    </div>

                    <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

                    {/* Pricing breakdown */}
                    {isYearly ? (
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-sm">
                                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Monthly rate</span>
                                <span>${Math.round(plan.price * 0.8)} / mo</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Billed annually</span>
                                <span className="font-semibold">${yearlyPrice} / year</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>You save</span>
                                <span className="text-green-600 font-medium">${plan.price * 12 - yearlyPrice} vs monthly</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-between text-sm">
                            <span className={dark ? 'text-gray-400' : 'text-gray-500'}>Billed monthly</span>
                            <span className="font-semibold">${monthlyPrice} / mo</span>
                        </div>
                    )}

                    <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

                    {/* Total */}
                    <div className="flex justify-between items-baseline">
                        <span className="font-medium">Total due today</span>
                        <div className="text-right">
                            <span className="text-2xl font-bold">${displayPrice}</span>
                            <span className={`text-sm ml-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {plan.currency} / {isYearly ? 'year' : 'mo'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Payment method */}
                {
                    data.method === null
                        ?
                        <>
                            <p className='text-red-400 text-center font-semibold'>You don't have any payment method</p>
                            <Link
                                to={`/payment-methods/${userAuth.userId}`}
                                className="inline-block px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-100 text-sm font-medium transition-colors text-center"
                            >
                                Add one here
                            </Link>
                        </>
                        :
                        <div className={`rounded-2xl border p-5 flex items-center justify-between ${card}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    {brandIcons[method.brand] ?? '💳'}
                                </div>
                                <div>
                                    <p className="font-medium text-sm capitalize">{method.brand} •••• {method.last4}</p>
                                    <p className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Expires {method.expMonth}/{method.expYear}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Default</span>
                        </div>
                }

                {/* Price lock notice */}
                <p className={`text-xs px-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    🔒 This price is locked in at the time of payment. If pricing changes in the future, your current rate stays the same until you start a new subscription or make a change to your plan.
                </p>

                {/* CTA */}
                {
                    data.method !== null && (
                        <button
                            onClick={handlePay}
                            disabled={paying}
                            className="w-full py-3 rounded-xl bg-[#2563EB] text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {paying ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                `Pay $${displayPrice} ${plan.currency}`
                            )}
                        </button>)
                }


            </div>
        </div>
    )
}

export default PaymentFlow