// components/dashboard/categories/CategoryAnalyticsCard.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface FollowedCategory {
    categoryId: string;
    name: string;
    color: string;
    countFollows: number;
    percentage: number;
}

interface UsedCategory {
    categoryId: string;
    name: string;
    color: string;
    postsCount: number;
    percentage: number;
}

interface CategoriesAnalyticsResponse {
    range: DateRange;
    mostFollowed: FollowedCategory[];
    mostUsed: UsedCategory[];
}

// ---- Fake service (reemplazar por llamada real) ----
const fetchCategoriesAnalytics = async (range: DateRange): Promise<CategoriesAnalyticsResponse> => {
    // const { data } = await clientAuthAxios.get('/stats/categories-analytics', { params: range });
    // return data;
    await new Promise((r) => setTimeout(r, 500));
    return {
        range,
        mostFollowed: [
            { categoryId: '1', name: 'Tecnología', color: '#4F46E5', countFollows: 1240, percentage: 100 },
            { categoryId: '2', name: 'Deportes', color: '#059669', countFollows: 890, percentage: 72 },
            { categoryId: '3', name: 'Música', color: '#D97706', countFollows: 610, percentage: 49 },
            { categoryId: '4', name: 'Viajes', color: '#DB2777', countFollows: 430, percentage: 35 },
            { categoryId: '5', name: 'Cocina', color: '#0284C7', countFollows: 310, percentage: 25 },
        ],
        mostUsed: [
            { categoryId: '1', name: 'Tecnología', color: '#4F46E5', postsCount: 512, percentage: 38 },
            { categoryId: '3', name: 'Música', color: '#D97706', postsCount: 340, percentage: 25 },
            { categoryId: '2', name: 'Deportes', color: '#059669', postsCount: 260, percentage: 19 },
            { categoryId: '5', name: 'Cocina', color: '#0284C7', postsCount: 150, percentage: 11 },
            { categoryId: '4', name: 'Viajes', color: '#DB2777', postsCount: 95, percentage: 7 },
        ],
    };
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const rowVariants = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export const CategoryAnalyticsCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CategoriesAnalyticsResponse | null>(null);

    const loadData = useCallback(async (range: DateRange) => {
        setLoading(true);
        try {
            const res = await fetchCategoriesAnalytics(range);
            setData(res);
        } finally {
            setLoading(false);
        }
    }, []);

    const pieData = data?.mostUsed.map((c) => ({
        name: c.name,
        value: c.postsCount,
        percentage: c.percentage,
        color: c.color,
    })) ?? [];

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
                        Category Analytics
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Most followed and most used categories
                    </p>
                </div>
                <DateRangeFilter instanceId="categories-analytics" onChange={loadData} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Most Followed - list con barras */}
                <div className="flex flex-col gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Most Followed
                    </span>

                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className={`h-10 rounded-xl animate-pulse ${dark ? 'bg-gray-800/60' : 'bg-gray-100'}`} />
                            ))}
                        </div>
                    ) : (
                        <motion.ul variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
                            {data?.mostFollowed.map((cat, index) => (
                                <motion.li key={cat.categoryId} variants={rowVariants} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span
                                                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                            <span className={`text-xs font-medium truncate ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {cat.name}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {cat.countFollows.toLocaleString('en-US')}
                                        </span>
                                    </div>
                                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${cat.percentage}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.06 * index }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                    </div>
                                </motion.li>
                            ))}
                        </motion.ul>
                    )}
                </div>

                {/* Most Used - pie chart */}
                <div className="flex flex-col gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Most Used
                    </span>

                    <div className="relative w-full h-56">
                        {loading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className={`h-16 w-16 rounded-full border-4 border-t-transparent animate-spin
                                    ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="55%"
                                        outerRadius="85%"
                                        paddingAngle={3}
                                        cornerRadius={6}
                                        animationDuration={700}
                                    >
                                        {pieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: dark ? '#1E1E21' : '#FFFFFF',
                                            border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
                                            borderRadius: 12,
                                            fontSize: 12,
                                            color: dark ? '#E5E7EB' : '#111827',
                                        }}
                                        formatter={(value: number, _name, item: any) => [
                                            `${value} posts (${item.payload.percentage}%)`,
                                            item.payload.name,
                                        ]}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={48}
                                        iconType="circle"
                                        iconSize={7}
                                        formatter={(value) => (
                                            <span className={`text-[11px] ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};