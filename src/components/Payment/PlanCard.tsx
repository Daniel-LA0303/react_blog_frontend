import { useNavigate } from "react-router-dom";
import { PlanI } from "../../interfaces/payment.interfaces";
import { motion } from 'framer-motion'

const BoltIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
)

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

const FeatureRow = ({ enabled, label, dark }: { enabled: boolean; label: string; dark: boolean }) => (
    <div className={`flex items-center gap-2 text-sm ${enabled ? (dark ? 'text-gray-200' : 'text-gray-700') : 'text-gray-400'}`}>
        {enabled ? <CheckIcon /> : <XIcon />}
        <span>{label}</span>
    </div>
)


const AI_FEATURES: { key: keyof PlanI['config']; label: string }[] = [
    { key: 'aiSummaries',       label: 'AI summaries' },
    { key: 'chatWithArticles',  label: 'Chat with articles' },
    { key: 'aiTranslation',     label: 'AI translation' },
    { key: 'writingAssistant',  label: 'Writing assistant' },
    { key: 'titleGeneration',   label: 'Title generation' },
    { key: 'seoAssistant',      label: 'SEO assistant' },
    { key: 'tagGeneration',     label: 'Tag generation' },
]

const GROWTH_FEATURES: { key: keyof PlanI['config']; label: string }[] = [
    { key: 'advancedAnalytics',       label: 'Advanced analytics' },
    { key: 'aiCovers',                label: 'AI covers' },
    { key: 'notesToArticle',          label: 'Notes to article' },
    { key: 'newsletter',              label: 'Newsletter' },
    { key: 'fullAnalytics',           label: 'Full analytics' },
    { key: 'featuredProfile',         label: 'Featured profile' },
    { key: 'audienceGrowthTools',     label: 'Audience growth tools' },
    { key: 'priorityRecommendations', label: 'Priority recommendations' },
]

// Visual metadata derived from plan name
const PLAN_META: Record<string, {
    badge: string
    badgeClass: string
    aiChipClass: string
    featured: boolean
    ctaLabel: string
    ctaPrimary: boolean
    redirect: string
}> = {
    FREE: {
        badge: 'Free',
        badgeClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        aiChipClass: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
        featured: false,
        ctaLabel: 'Get started',
        ctaPrimary: false,
        redirect: '/'
    },
    PRO: {
        badge: 'Most popular',
        badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        aiChipClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        featured: true,
        ctaLabel: 'Get Pro',
        ctaPrimary: true,
        redirect: '/payment-flow/PRO'
    },
    PREMIUM: {
        badge: 'Premium',
        badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        aiChipClass: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
        featured: false,
        ctaLabel: 'Get Premium',
        ctaPrimary: false,
        redirect: '/payment-flow/PREMIUM'
    },
}

const PlanCard = ({ plan, yearly, dark }: { plan: PlanI; yearly: boolean; dark: boolean }) => {

    const route = useNavigate();

    const meta = PLAN_META[plan.name] ?? PLAN_META.FREE // get all information from plan_meta by plan.name

    const price = plan.price === 0 ? 0 : yearly ? Math.round(plan.price * 0.8) : plan.price

    const handleRedirect = () => {
        route(`${meta.redirect}?interval=${yearly ? 'YEAR' : 'MONTH'}`); 
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col gap-4 rounded-2xl p-5 transition-colors duration-200
                ${dark ? 'bg-[#27272A]' : 'bg-white'}
                ${meta.featured
                    ? 'border-2 border-[#2563EB]'
                    : `border ${dark ? 'border-gray-800' : 'border-gray-100'}`
                }`}
        >
            {/* Header */}
            <div>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${meta.badgeClass}`}>
                    {meta.badge}
                </span>
                <p className={`text-lg font-bold mt-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name.charAt(0) + plan.name.slice(1).toLowerCase()}
                </p>
                <p className={`text-xs mt-0.5 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {plan.description}
                </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    ${price}
                </span>
                <span className={`text-sm ${dark ? 'text-gray-500' : 'text-gray-400'}`}>/ mo</span>
                {yearly && plan.price > 0 && (
                    <span className={`text-sm line-through ml-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                        ${plan.price}
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
                    <FeatureRow
                        key={f.key}
                        enabled={!!plan.config[f.key]}
                        label={f.label}
                        dark={dark}
                    />
                ))}

                <p className={`text-[11px] font-medium uppercase tracking-wider mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Growth
                </p>
                {GROWTH_FEATURES.map(f => (
                    <FeatureRow
                        key={f.key}
                        enabled={!!plan.config[f.key]}
                        label={f.label}
                        dark={dark}
                    />
                ))}

                <p className={`text-[11px] font-medium uppercase tracking-wider mt-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    AI usage
                </p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit ${meta.aiChipClass}`}>
                    <BoltIcon />
                    {plan.config.aiConsume} credits / mo
                </span>
            </div>

            {/* CTA */}
            {!plan.isFree && (
                <button
                    onClick={() => handleRedirect()}
                    className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors duration-150
                        ${meta.ctaPrimary
                            ? 'bg-[#2563EB] text-white hover:bg-blue-700'
                            : dark
                                ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {meta.ctaLabel}
                </button>
            )}
        </motion.div>
    )
}

export default PlanCard;