// components/dashboard/charts/ModerationActionsChart.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface ModerationActionPoint {
    date: string; // MM-DD-YYYY
    count: number;
}

interface ModerationActionsResponse {
    range: DateRange;
    data: ModerationActionPoint[];
}

// ---- Fake service (reemplazar por llamada real) ----
const fetchModerationActionsTimeline = async (range: DateRange): Promise<ModerationActionsResponse> => {
    // const { data } = await clientAuthAxios.get('/stats/moderation-actions-timeline', { params: range });
    // return data;
    await new Promise((r) => setTimeout(r, 500));
    const points: ModerationActionPoint[] = Array.from({ length: 10 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (9 - i));
        return {
            date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`,
            count: Math.floor(Math.random() * 15) + 1,
        };
    });
    return { range, data: points };
};

const shortLabel = (mmddyyyy: string) => {
    const [mm, dd] = mmddyyyy.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[Number(mm) - 1]} ${dd}`;
};

export const ModerationActionsChart = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [timeline, setTimeline] = useState<ModerationActionPoint[]>([]);

    const loadData = useCallback(async (range: DateRange) => {
        setLoading(true);
        try {
            const res = await fetchModerationActionsTimeline(range);
            setTimeline(res.data);
        } finally {
            setLoading(false);
        }
    }, []);

    const gridColor = dark ? '#27272A' : '#F3F4F6';
    const axisColor = dark ? '#6B7280' : '#9CA3AF';
    const barColor = dark ? '#818CF8' : '#4F46E5';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border p-5 flex flex-col gap-4 h-full
                ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Moderation Actions
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Actions logged by moderators and admins over time
                    </p>
                </div>
                <DateRangeFilter instanceId="moderation-actions" onChange={loadData} />
            </div>

            <div className="relative w-full h-64">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`h-20 w-20 rounded-full border-4 border-t-transparent animate-spin
                            ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={shortLabel}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={{ stroke: gridColor }}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                labelFormatter={(label) => shortLabel(label as string)}
                                formatter={(value: number) => [`${value} actions`, '']}
                                contentStyle={{
                                    background: dark ? '#1E1E21' : '#FFFFFF',
                                    border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: dark ? '#E5E7EB' : '#111827',
                                }}
                                cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={700}>
                                {timeline.map((_, i) => (
                                    <Cell key={i} fill={barColor} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};