import { useState } from 'react'
import { motion } from 'framer-motion'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import Sidebar from '../../components/Sidebar/Sidebar'

const CheckIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
        <polyline points="20 6 9 12 4 10" />
    </svg>
)

const XIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0 text-gray-500">
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
)

const BoltIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
)

const AI_FEATURES = [
    { key: 'aiSummaries', label: 'AI summaries' },
    { key: 'chatWithArticles', label: 'Chat with articles' },
    { key: 'aiTranslation', label: 'AI translation' },
    { key: 'writingAssistant', label: 'Writing assistant' },
    { key: 'titleGeneration', label: 'Title generation' },
    { key: 'seoAssistant', label: 'SEO assistant' },
    { key: 'tagGeneration', label: 'Tag generation' },
]

const GROWTH_FEATURES = [
    { key: 'advancedAnalytics', label: 'Advanced analytics' },
    { key: 'aiCovers', label: 'AI covers' },
    { key: 'notesToArticle', label: 'Notes to article' },
    { key: 'newsletter', label: 'Newsletter' },
    { key: 'featuredProfile', label: 'Featured profile' },
    { key: 'audienceGrowthTools', label: 'Audience growth tools' },
]

const PLANS = [
    {
        key: 'free',
        name: 'Free',
        desc: 'Get started at no cost',
        monthlyPrice: 0,
        badge: 'Free',
        badgeClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        aiConsume: 0,
        aiChipClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        featured: false,
        ctaLabel: 'Get started',
        ctaPrimary: false,
        config: {
            aiSummaries: false, chatWithArticles: false, aiTranslation: false,
            writingAssistant: false, titleGeneration: false, seoAssistant: false,
            tagGeneration: false, advancedAnalytics: false, aiCovers: false,
            notesToArticle: false, newsletter: false, featuredProfile: false,
            audienceGrowthTools: false,
        },
    },
    {
        key: 'pro',
        name: 'Pro',
        desc: 'For serious creators',
        monthlyPrice: 15,
        badge: 'Most popular',
        badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        aiConsume: 100,
        aiChipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        featured: true,
        ctaLabel: 'Get Pro',
        ctaPrimary: true,
        config: {
            aiSummaries: true, chatWithArticles: true, aiTranslation: true,
            writingAssistant: true, titleGeneration: true, seoAssistant: true,
            tagGeneration: true, advancedAnalytics: false, aiCovers: false,
            notesToArticle: false, newsletter: false, featuredProfile: false,
            audienceGrowthTools: false,
        },
    },
    {
        key: 'premium',
        name: 'Premium',
        desc: 'Full access, maximum output',
        monthlyPrice: 25,
        badge: 'Premium',
        badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        aiConsume: 500,
        aiChipClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        featured: false,
        ctaLabel: 'Get Premium',
        ctaPrimary: false,
        config: {
            aiSummaries: true, chatWithArticles: true, aiTranslation: true,
            writingAssistant: true, titleGeneration: true, seoAssistant: true,
            tagGeneration: true, advancedAnalytics: true, aiCovers: true,
            notesToArticle: true, newsletter: true, featuredProfile: true,
            audienceGrowthTools: true,
        },
    },
]

const FeatureRow = ({ enabled, label, dark }: { enabled: boolean; label: string; dark: boolean }) => (
    <div className={`flex items-center gap-2 text-sm ${enabled ? (dark ? 'text-gray-200' : 'text-gray-700') : 'text-gray-400'}`}>
        {enabled ? <CheckIcon /> : <XIcon />}
        <span>{label}</span>
    </div>
)

const PlanCard = ({ plan, yearly, dark }: { plan: typeof PLANS[0]; yearly: boolean; dark: boolean }) => {
    const price = plan.monthlyPrice === 0 ? 0 : yearly ? Math.round(plan.monthlyPrice * 0.8) : plan.monthlyPrice
    const originalPrice = plan.monthlyPrice

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
                        ${dark ? 'bg-[#27272A]' : 'bg-white'}
                        ${plan.featured
                    ? 'border-2 border-[#2563EB]'
                    : `border ${dark ? 'border-gray-800' : 'border-gray-100'}`
                }`}
        >
            {/* Header */}
            <div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${plan.badgeClass}`}>
                    {plan.badge}
                </span>
                <p className={`text-lg font-bold mt-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</p>
                <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    ${price}
                </span>
                <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>/ mo</span>
                {yearly && plan.monthlyPrice > 0 && (
                    <span className={`text-sm line-through ml-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                        ${originalPrice}
                    </span>
                )}
            </div>

            {/* Divider */}
            <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

            {/* Features */}
            <div className="flex flex-col gap-2 flex-1">
                <p className={`text-[11px] font-medium uppercase tracking-wider ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    AI features
                </p>
                {AI_FEATURES.map(f => (
                    <FeatureRow key={f.key} enabled={plan.config[f.key as keyof typeof plan.config]} label={f.label} dark={dark} />
                ))}

                <p className={`text-[11px] font-medium uppercase tracking-wider mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Growth
                </p>
                {GROWTH_FEATURES.map(f => (
                    <FeatureRow key={f.key} enabled={plan.config[f.key as keyof typeof plan.config]} label={f.label} dark={dark} />
                ))}

                <p className={`text-[11px] font-medium uppercase tracking-wider mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    AI usage
                </p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${plan.aiChipClass}`}>
                    <BoltIcon />
                    {plan.aiConsume} credits / mo
                </span>
            </div>

            {/* CTA */}
            <button
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors duration-150
          ${plan.ctaPrimary
                        ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                        : dark
                            ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
            >
                {plan.ctaLabel}
            </button>
        </motion.div>
    )
}

const Plans = () => {
    const [yearly, setYearly] = useState(false)
    const { globalData } = useGlobalDataContext()
    const dark = !globalData.themeGlobal

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
                {PLANS.map(plan => (
                    <PlanCard key={plan.key} plan={plan} yearly={yearly} dark={dark} />
                ))}
            </div>
        </div>
        </div>
    )
}

export default Plans