import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faLock,
    faCreditCard,
    faCircleCheck,
    faSpinner,
    faTriangleExclamation,
    faShield,
} from '@fortawesome/free-solid-svg-icons'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'

/* Stripe public key  */
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

/* Inner form — must live inside <Elements>  */
interface CardFormProps {
    dark: boolean
    onSuccess: (paymentMethod: any) => void
    onCancel: () => void
}

const CardForm = ({ dark, onSuccess, onCancel }: CardFormProps) => {
    const stripe   = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)
    const [error,   setError]   = useState<string | null>(null)
    const [ready,   setReady]   = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) return

        setError(null)
        setLoading(true)

        // submit the Elements form first (validates fields)
        const { error: submitError } = await elements.submit()
        if (submitError) {
            setError(submitError.message ?? 'Please check your card details.')
            setLoading(false)
            return
        }

        // create the PaymentMethod directly in Stripe — no backend needed yet
        const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
            elements,
        })

        if (stripeError) {
            setError(stripeError.message ?? 'Something went wrong.')
            setLoading(false)
            return
        }

        console.log('Stripe paymentMethod:', paymentMethod)
        console.log('paymentMethod.id ready to send:', paymentMethod.id)

        // // HERE YOU PUT BACKEND CONNECTION
        // // e.g. await clientAuthAxios.post('/payments/attach-payment-method', {
        // //     paymentMethodId: paymentMethod.id,
        // // })

        setLoading(false)
        onSuccess(paymentMethod)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Stripe's prebuilt UI renders here */}
            <div className={`transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}>
                <PaymentElement
                    onReady={() => setReady(true)}
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* skeleton while Stripe loads its iframe */}
            {!ready && (
                <div className="space-y-3">
                    {[80, 100, 60].map((w, i) => (
                        <div
                            key={i}
                            className={`h-10 rounded-lg animate-pulse ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}
                            style={{ width: `${w}%` }}
                        />
                    ))}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 text-sm flex-shrink-0" />
                    <p className="text-xs text-red-400">{error}</p>
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                        dark
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading || !stripe || !ready}
                    className="flex-1 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                    {loading
                        ? <><FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" /> Saving...</>
                        : <><FontAwesomeIcon icon={faLock} className="text-sm" /> Add card</>
                    }
                </button>
            </div>

            <div className="flex items-center justify-center gap-1.5">
                <FontAwesomeIcon icon={faShield} className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`text-[11px] ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                    Secured by Stripe · Your card data never touches our servers
                </p>
            </div>
        </form>
    )
}

/* Main component */
const AddPaymentMethod = () => {
    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal

    const [open,          setOpen]          = useState(false)
    const [success,       setSuccess]       = useState(false)
    const [paymentResult, setPaymentResult] = useState<any>(null)

    const handleSuccess = (paymentMethod: any) => {
        setSuccess(true)
        setPaymentResult(paymentMethod)
    }

    const handleCancel = () => {
        setOpen(false)
        setSuccess(false)
    }

    // Stripe appearance — synced to your theme
    const appearance = {
        theme: (dark ? 'night' : 'stripe') as 'night' | 'stripe',
        variables: {
            borderRadius: '12px',
            fontFamily: 'inherit',
            colorPrimary: '#2563eb',
        },
    }

    const card = `rounded-2xl border transition-colors ${
        dark ? 'bg-[#18182a] border-gray-800' : 'bg-white border-gray-100'
    }`

    return (
        <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
            <div className="max-w-lg mx-auto px-4 py-14 sm:px-6">

                <div className="mb-8">
                    <h1 className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Payment methods
                    </h1>
                    <p className={`mt-1 text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Manage the cards linked to your account.
                    </p>
                </div>

                {/* saved card placeholder */}
                <div className={`${card} p-5 mb-4`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-7 rounded-md flex items-center justify-center ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                <FontAwesomeIcon icon={faCreditCard} className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>•••• •••• •••• 4242</p>
                                <p className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Expires 12/27 · Default</p>
                            </div>
                        </div>
                        <p className={`text-xs font-semibold px-2 py-0.5 rounded-md ${dark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            Default
                        </p>
                    </div>
                </div>

                {/* trigger */}
                {!open && (
                    <button
                        onClick={() => setOpen(true)}
                        className={`w-full py-3.5 rounded-2xl border text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                            dark
                                ? 'border-dashed border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-400 hover:bg-blue-500/5'
                                : 'border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50'
                        }`}
                    >
                        <span className="text-lg leading-none">+</span>
                        Add payment method
                    </button>
                )}

                {/* form */}
                {open && (
                    <div className={`${card} p-6`}>
                        <div className="flex items-center gap-2 mb-5">
                            <FontAwesomeIcon icon={faCreditCard} className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                            <p className={`text-sm font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>New payment method</p>
                        </div>

                        {success && paymentResult ? (
                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2 py-4">
                                    <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500 text-3xl" />
                                    <p className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                        PaymentMethod created
                                    </p>
                                </div>

                                {/* response viewer */}
                                <div className={`rounded-xl border text-xs font-mono overflow-auto max-h-64 p-4 ${
                                    dark ? 'bg-[#0f0f1a] border-gray-800 text-emerald-400' : 'bg-gray-50 border-gray-200 text-emerald-700'
                                }`}>
                                    <pre>{JSON.stringify(paymentResult, null, 2)}</pre>
                                </div>

                                <div className={`rounded-xl border px-4 py-3 ${dark ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                                    <p className={`text-[11px] font-mono ${dark ? 'text-blue-300' : 'text-blue-700'}`}>
                                        paymentMethod.id
                                    </p>
                                    <p className={`text-xs font-semibold mt-0.5 break-all ${dark ? 'text-blue-200' : 'text-blue-800'}`}>
                                        {paymentResult.id}
                                    </p>
                                </div>

                                <button
                                    onClick={() => { setOpen(false); setSuccess(false); setPaymentResult(null) }}
                                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                                        dark ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            // mode="setup" tells Stripe this is for saving a card, not charging it
                            <Elements
                                stripe={stripePromise}
                                options={{
                                    mode: 'setup',
                                    currency: 'usd',
                                    appearance,
                                    paymentMethodCreation: 'manual',
                                }}
                            >
                                <CardForm
                                    dark={dark}
                                    onSuccess={handleSuccess}
                                    onCancel={handleCancel}
                                />
                            </Elements>
                        )}
                    </div>
                )}

                {!open && (
                    <p className={`text-center text-[11px] mt-4 ${dark ? 'text-gray-700' : 'text-gray-300'}`}>
                        We accept Visa, Mastercard, American Express and more
                    </p>
                )}
            </div>
        </div>
    )
}

export default AddPaymentMethod