// components/dashboard/engagement/EngagementOverviewCard.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

// Iconos locales estilo IconBase (cámbialos por los de tu catálogo si ya tienes equivalentes)
const CommentsIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.94L3 21l1.44-5.6A8.5 8.5 0 1 1 21 12z" />
    </svg>
);
const ReplyIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
);
const MessageIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
    </svg>
);
const NotificationIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

interface EngagementOverviewResponse {
    range: DateRange;
    commentsTotal: number;
    repliesTotal: number;
    messagesTotal: number;
    notificationsTotal: number;
}

// ---- Fake service (reemplazar por llamada real) ----
const fetchEngagementOverview = async (range: DateRange): Promise<EngagementOverviewResponse> => {
    // const { data } = await clientAuthAxios.get('/stats/engagement-overview', { params: range });
    // return data;
    await new Promise((r) => setTimeout(r, 500));
    return {
        range,
        commentsTotal: 3420,
        repliesTotal: 1180,
        messagesTotal: 890,
        notificationsTotal: 6210,
    };
};

const METRICS: { key: keyof Omit<EngagementOverviewResponse, 'range'>; label: string; icon: (p: { size?: number }) => JSX.Element; accent: 'sky' | 'violet' | 'emerald' | 'fuchsia' }[] = [
    { key: 'commentsTotal', label: 'Comments', icon: CommentsIcon, accent: 'sky' },
    { key: 'repliesTotal', label: 'Replies', icon: ReplyIcon, accent: 'violet' },
    { key: 'messagesTotal', label: 'Messages', icon: MessageIcon, accent: 'emerald' },
    { key: 'notificationsTotal', label: 'Notifications', icon: NotificationIcon, accent: 'fuchsia' },
];

const ACCENT_STYLES: Record<string, { light: string; dark: string }> = {
    sky: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
    violet: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/10 text-violet-400' },
    emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
    fuchsia: { light: 'bg-fuchsia-50 text-fuchsia-600', dark: 'bg-fuchsia-500/10 text-fuchsia-400' },
};

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export const EngagementOverviewCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<EngagementOverviewResponse | null>(null);

    const loadData = useCallback(async (range: DateRange) => {
        setLoading(true);
        try {
            const res = await fetchEngagementOverview(range);
            setData(res);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border p-5 flex flex-col gap-5 h-full
                ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Engagement Overview
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Comments, replies, messages and notifications
                    </p>
                </div>
                <DateRangeFilter instanceId="engagement-overview" onChange={loadData} />
            </div>

            {loading ? (
                <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`h-20 rounded-xl animate-pulse ${dark ? 'bg-gray-800/60' : 'bg-gray-100'}`} />
                    ))}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
                    {METRICS.map(({ key, label, icon: Icon, accent }) => {
                        const accentClass = dark ? ACCENT_STYLES[accent].dark : ACCENT_STYLES[accent].light;
                        const value = data?.[key] ?? 0;

                        return (
                            <motion.div
                                key={key}
                                variants={cardVariants}
                                whileHover={{ y: -2 }}
                                className={`rounded-xl border p-4 flex flex-col gap-2.5 transition-colors duration-200
                                    ${dark ? 'bg-[#1E1E21] border-gray-800' : 'bg-gray-50 border-gray-100'}`}
                            >
                                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${accentClass}`}>
                                    <Icon size={15} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className={`text-xl font-bold tracking-tight tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                                        {formatNumber(value)}
                                    </span>
                                    <span className={`text-[11px] font-medium ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {label}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}
        </motion.div>
    );
};