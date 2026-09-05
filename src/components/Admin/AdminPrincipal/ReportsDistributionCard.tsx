// components/dashboard/reports/ReportsDistributionCard.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

type ReportStatus = 'PENDING' | 'RESOLVED' | 'DISMISSED';

interface ReportsDatum {
    status: ReportStatus;
    count: number;
    percentage: number;
}

interface ReportsDistributionResponse {
    range: DateRange;
    total: number;
    data: ReportsDatum[];
}

const STATUS_META: Record<ReportStatus, { label: string; light: string; dark: string }> = {
    PENDING: { label: 'Pending', light: '#D97706', dark: '#FBBF24' },
    RESOLVED: { label: 'Resolved', light: '#059669', dark: '#34D399' },
    DISMISSED: { label: 'Dismissed', light: '#6B7280', dark: '#9CA3AF' },
};

// ---- Fake service (reemplazar por llamada real) ----
const fetchReportsDistribution = async (range: DateRange): Promise<ReportsDistributionResponse> => {
    // const { data } = await clientAuthAxios.get('/stats/reports-distribution', { params: range });
    // return data;
    await new Promise((r) => setTimeout(r, 500));
    return {
        range,
        total: 180,
        data: [
            { status: 'PENDING', count: 90, percentage: 50 },
            { status: 'RESOLVED', count: 65, percentage: 36 },
            { status: 'DISMISSED', count: 25, percentage: 14 },
        ],
    };
};

export const ReportsDistributionCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReportsDistributionResponse | null>(null);

    const loadData = useCallback(async (range: DateRange) => {
        setLoading(true);
        try {
            const res = await fetchReportsDistribution(range);
            setStats(res);
        } finally {
            setLoading(false);
        }
    }, []);

    const chartData = stats?.data.map((d) => ({
        name: STATUS_META[d.status].label,
        value: d.count,
        percentage: d.percentage,
        color: dark ? STATUS_META[d.status].dark : STATUS_META[d.status].light,
    })) ?? [];

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
                        Reports Overview
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Pending, resolved and dismissed reports
                    </p>
                </div>
                <DateRangeFilter instanceId="reports-distribution" onChange={loadData} />
            </div>

            <div className="relative w-full h-72 sm:h-80">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`h-24 w-24 rounded-full border-4 border-t-transparent animate-spin
              ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius="62%"
                                    outerRadius="88%"
                                    paddingAngle={3}
                                    cornerRadius={6}
                                    animationDuration={700}
                                >
                                    {chartData.map((entry, i) => (
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
                                        `${value} (${item.payload.percentage}%)`,
                                        item.payload.name,
                                    ]}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    iconSize={8}
                                    formatter={(value) => (
                                        <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
                            <span className={`text-2xl font-bold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                                {stats?.total ?? 0}
                            </span>
                            <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Total reports</span>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};