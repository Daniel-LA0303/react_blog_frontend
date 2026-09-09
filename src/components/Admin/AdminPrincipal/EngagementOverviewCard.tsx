// components/dashboard/engagement/EngagementOverviewCard.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DateRange, EngagementOverviewResponse } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
import clientAuthAxios from '../../../services/clientAuthAxios';
import { cardVariants, containerVariants } from '../../../utils/animationsUtils';
import { ACCENT_STYLES_ENGAGEMENT, formatNumber, METRICS_ENGAGEMENT } from '../../../utils/adminUtils';

const fetchEngagementOverview = async (range: DateRange): Promise<EngagementOverviewResponse> => {
    const { data } = await clientAuthAxios.get('/dashboard/get-basic-engagement', { params: range });
    return data.data;
};

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
                    {METRICS_ENGAGEMENT.map(({ key, label, icon: Icon, accent }) => {
                        const accentClass = dark ? ACCENT_STYLES_ENGAGEMENT[accent].dark : ACCENT_STYLES_ENGAGEMENT[accent].light;
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