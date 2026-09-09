// components/dashboard/engagement/NotificationsActivityCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import clientAuthAxios from '../../../services/clientAuthAxios';
import { NotificationsActivityPoint } from '../../../interfaces/admin.interfaces';
import { TYPE_META } from '../../../utils/adminUtils';

const fetchNotificationsActivity = async (): Promise<NotificationsActivityPoint[]> => {
    const { data } = await clientAuthAxios.get('/dashboard/get-notifications-info');
    return data.data.data;
};

const shortWeekday = (mmddyyyy: string) => {
    const [mm, dd, yyyy] = mmddyyyy.split('-');
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
};

export const NotificationsActivityCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<NotificationsActivityPoint[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await fetchNotificationsActivity();
                setData(res);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const axisColor = dark ? '#6B7280' : '#9CA3AF';
    const colorOf = (key: keyof typeof TYPE_META) => (dark ? TYPE_META[key].dark : TYPE_META[key].light);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 h-full
                ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
        >
            <div>
                <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Notifications Activity
                </h3>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Follows, likes, comments and replies · Last 7 days
                </p>
            </div>

            <div className="relative w-full h-48">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`h-16 w-16 rounded-full border-4 border-t-transparent animate-spin
                            ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                            <defs>
                                {(Object.keys(TYPE_META) as (keyof typeof TYPE_META)[]).map((key) => (
                                    <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={colorOf(key)} stopOpacity={0.5} />
                                        <stop offset="100%" stopColor={colorOf(key)} stopOpacity={0.03} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <XAxis
                                dataKey="date"
                                tickFormatter={shortWeekday}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis hide width={0} />
                            <Tooltip
                                labelFormatter={(label) => shortWeekday(label as string)}
                                contentStyle={{
                                    background: dark ? '#1E1E21' : '#FFFFFF',
                                    border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: dark ? '#E5E7EB' : '#111827',
                                }}
                            />
                            <Legend
                                iconType="circle"
                                iconSize={7}
                                wrapperStyle={{ fontSize: 11 }}
                                formatter={(value) => (
                                    <span className={dark ? 'text-gray-400' : 'text-gray-600'}>{value}</span>
                                )}
                            />
                            {(Object.keys(TYPE_META) as (keyof typeof TYPE_META)[]).map((key) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    name={TYPE_META[key].label}
                                    stackId="1"
                                    stroke={colorOf(key)}
                                    strokeWidth={2}
                                    fill={`url(#grad-${key})`}
                                    animationDuration={700}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>
    );
};