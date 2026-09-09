// components/dashboard/charts/ModerationActionsChart.tsx
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DateRange, ModerationActionPoint, ModerationActionsResponse } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
import clientAuthAxios from '../../../services/clientAuthAxios';
import { MONTHS_MODERATION } from '../../../utils/adminUtils';


const fetchModerationActionsTimeline = async (range: DateRange): Promise<ModerationActionsResponse> => {
    const { data } = await clientAuthAxios.get('/dashboard/get-moderation-info', { params: range });
    return data.data;
};

// Parsea MM-DD-YYYY a Date
const parseMMDDYYYY = (str: string) => {
    const [mm, dd, yyyy] = str.split('-').map(Number);
    return new Date(yyyy, mm - 1, dd);
};

const DAILY_VIEW_MAX_DAYS = 31;

const aggregateTimeline = (
    timeline: ModerationActionPoint[],
    spanDays: number
): { points: ModerationActionPoint[]; grouped: boolean } => {
    if (spanDays <= DAILY_VIEW_MAX_DAYS || timeline.length === 0) {
        return { points: timeline, grouped: false };
    }

    const monthBuckets = new Map<string, ModerationActionPoint>();

    for (const point of timeline) {
        const d = parseMMDDYYYY(point.date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        const existing = monthBuckets.get(monthKey);
        if (existing) {
            existing.count += point.count;
        } else {
            monthBuckets.set(monthKey, {
                date: `${String(d.getMonth() + 1).padStart(2, '0')}-01-${d.getFullYear()}`,
                count: point.count,
            });
        }
    }

    return { points: Array.from(monthBuckets.values()), grouped: true };
};

const buildLabelFormatter = (grouped: boolean) => (mmddyyyy: string) => {
    const [mm, dd, yyyy] = mmddyyyy.split('-');
    const monthName = MONTHS_MODERATION[Number(mm) - 1];

    if (!grouped) {
        return `${monthName} ${dd}`;
    }
    return `${monthName} ${yyyy}`;
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

    const spanDays = useMemo(() => {
        if (timeline.length < 2) return 0;
        const first = parseMMDDYYYY(timeline[0].date);
        const last = parseMMDDYYYY(timeline[timeline.length - 1].date);
        return Math.round((last.getTime() - first.getTime()) / (1000 * 60 * 60 * 24));
    }, [timeline]);

    const { points: chartData, grouped } = useMemo(
        () => aggregateTimeline(timeline, spanDays),
        [timeline, spanDays]
    );

    const labelFormatter = useMemo(() => buildLabelFormatter(grouped), [grouped]);

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
                        {grouped
                            ? 'Actions logged by moderators and admins (grouped by month)'
                            : 'Actions logged by moderators and admins over time'}
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
                        <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickFormatter={labelFormatter}
                                interval={grouped ? 0 : 'preserveStartEnd'}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={{ stroke: gridColor }}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                labelFormatter={(label) => labelFormatter(label as string)}
                                formatter={(value: number) => [`${value} actions`, '']}
                                contentStyle={{
                                    background: dark ? '#1E1E21' : '#FFFFFF',
                                    border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: dark ? '#E5E7EB' : '#111827',
                                }}
                                itemStyle={{
                                    color: dark ? '#FFFFFF' : '#111827',
                                }}
                                labelStyle={{
                                    color: dark ? '#FFFFFF' : '#111827',
                                }}
                                cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} animationDuration={700}>
                                {chartData.map((_, i) => (
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