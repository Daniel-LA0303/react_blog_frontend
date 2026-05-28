import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFeather, faRocket, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Sidebar from '../../components/Sidebar/Sidebar'

const PLANS = {
    monthly: {
        basic: { price: '$3',  period: '/month', sub: 'Billed monthly' },
        pro:   { price: '$7',  period: '/month', sub: 'Billed monthly' },
    },
    yearly: {
        basic: { price: '$29', period: '/year', sub: 'Billed annually — 2 months free' },
        pro:   { price: '$67', period: '/year', sub: 'Billed annually — 2 months free' },
    },
}

const BASIC_FEATURES = [
    { label: 'Up to 3 projects',     included: true  },
    { label: '5 GB storage',         included: true  },
    { label: 'Community support',    included: true  },
    { label: 'Basic analytics',      included: true  },
    { label: 'Priority support',     included: false },
    { label: 'Advanced analytics',   included: false },
    { label: 'API access',           included: false },
]

const PRO_FEATURES = [
    { label: 'Unlimited projects',        included: true },
    { label: '50 GB storage',             included: true },
    { label: 'Priority support',          included: true },
    { label: 'Advanced analytics',        included: true },
    { label: 'API access',                included: true },
    { label: 'Custom integrations',       included: true },
    { label: 'Team collaboration tools',  included: true },
]

type Billing = 'monthly' | 'yearly'

const FeatureRow = ({ label, included, dark }: { label: string; included: boolean; dark: boolean }) => (
    <div className="flex items-start gap-2.5">
        <FontAwesomeIcon
            icon={included ? faCheck : faXmark}
            className={`mt-0.5 text-sm flex-shrink-0 ${
                included
                    ? 'text-emerald-500'
                    : dark ? 'text-gray-600' : 'text-gray-300'
            }`}
        />
        <span className={`text-[13px] ${
            included
                ? dark ? 'text-gray-300' : 'text-gray-600'
                : dark ? 'text-gray-600' : 'text-gray-300'
        }`}>
            {label}
        </span>
    </div>
)

const Pricing = () => {
    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal
    const [billing, setBilling] = useState<Billing>('monthly')

    const toggle = () => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')
    const isYearly = billing === 'yearly'

    const basic = PLANS[billing].basic
    const pro   = PLANS[billing].pro

    return (
        <div className={`min-h-screen transition-colors duration-300 ${dark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>
                  <Sidebar />
            <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6">

                {/* heading */}
                <div className="text-center mb-10">
                    <h1 className={`text-3xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Simple pricing
                    </h1>
                    <p className={`mt-2 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Start free. Scale when you're ready.
                    </p>
                </div>

                {/* billing toggle */}
                <div className="flex items-center justify-center gap-3 mb-10">
                    <span
                        onClick={() => setBilling('monthly')}
                        className={`text-sm font-medium cursor-pointer transition-colors ${
                            !isYearly
                                ? dark ? 'text-white' : 'text-gray-900'
                                : dark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                    >
                        Monthly
                    </span>

                    <button
                        onClick={toggle}
                        aria-label="Toggle billing cycle"
                        className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 focus:outline-none ${
                            isYearly ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                    >
                        <span className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all duration-200 ${
                            isYearly ? 'left-[21px]' : 'left-[3px]'
                        }`} />
                    </button>

                    <span
                        onClick={() => setBilling('yearly')}
                        className={`text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors ${
                            isYearly
                                ? dark ? 'text-white' : 'text-gray-900'
                                : dark ? 'text-gray-500' : 'text-gray-400'
                        }`}
                    >
                        Yearly
                        <span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-500 px-2 py-0.5 rounded-md">
                            Save 20%
                        </span>
                    </span>
                </div>

                {/* cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* basic */}
                    <div className={`rounded-2xl border p-6 transition-colors ${
                        dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'
                    }`}>
                        <div className="flex items-center gap-3 mb-5">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                dark ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                                <FontAwesomeIcon icon={faFeather} className={`text-base ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <div>
                                <p className={`text-[15px] font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Basic</p>
                                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>For individuals</p>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-baseline gap-1">
                                <span className={`text-[32px] font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {basic.price}
                                </span>
                                <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{basic.period}</span>
                            </div>
                            <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{basic.sub}</p>
                        </div>

                        <button className={`w-full py-2 rounded-xl text-sm font-medium mb-5 transition-colors ${
                            dark
                                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                            Get started
                        </button>

                        <div className={`border-t pt-4 space-y-2.5 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                            {BASIC_FEATURES.map(f => (
                                <FeatureRow key={f.label} {...f} dark={dark} />
                            ))}
                        </div>
                    </div>

                    {/* pro */}
                    <div className={`rounded-2xl border-2 border-blue-500 p-6 relative transition-colors ${
                        dark ? 'bg-[#27272A]' : 'bg-white'
                    }`}>
                        <div className="absolute -top-px left-1/2 -translate-x-1/2">
                            <span className="text-[11px] font-semibold bg-blue-500/15 text-blue-500 px-3.5 py-1 rounded-b-lg whitespace-nowrap">
                                Most popular
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-5 mt-2">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/15 flex items-center justify-center">
                                <FontAwesomeIcon icon={faRocket} className="text-base text-blue-500" />
                            </div>
                            <div>
                                <p className={`text-[15px] font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Pro</p>
                                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>For teams & power users</p>
                            </div>
                        </div>

                        <div className="mb-5">
                            <div className="flex items-baseline gap-1">
                                <span className={`text-[32px] font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {pro.price}
                                </span>
                                <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{pro.period}</span>
                            </div>
                            <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>{pro.sub}</p>
                        </div>

                        <button className="w-full py-2 rounded-xl text-sm font-medium mb-5 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                            Get started
                        </button>

                        <div className={`border-t pt-4 space-y-2.5 ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
                            {PRO_FEATURES.map(f => (
                                <FeatureRow key={f.label} {...f} dark={dark} />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Pricing