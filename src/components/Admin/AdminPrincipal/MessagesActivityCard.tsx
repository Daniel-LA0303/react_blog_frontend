// components/dashboard/engagement/MessagesActivityCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface MessagesActivityPoint {
    date: string; // MM-DD-YYYY
    count: number;
}

// ---- Fake service (reemplazar por llamada real) ----
// Nota: siempre mandamos days=7, no depende de ningún filtro de UI
const fetchMessagesActivity = async (): Promise<MessagesActivityPoint[]> => {
    // const { data } = await clientAuthAxios.get('/stats/messages-activity', { params: { days: 7 } });
    // return data.data;
    await new Promise((r) => setTimeout(r, 500));
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
            date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`,
            count: Math.floor(Math.random() * 60) + 20,
        };
    });
};

const shortWeekday = (mmddyyyy: string) => {
    const [mm, dd, yyyy] = mmddyyyy.split('-');
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[d.getDay()];
};

export const MessagesActivityCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<MessagesActivityPoint[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await fetchMessagesActivity();
                setData(res);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const barColor = dark ? '#34D399' : '#059669';
    const axisColor = dark ? '#6B7280' : '#9CA3AF';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={`rounded-2xl border p-5 flex flex-col gap-4 h-full
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
        >
            <div>
                <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Messages Activity
                </h3>
                <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Last 7 days
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
                        <BarChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="date"
                                tickFormatter={shortWeekday}
                                tick={{ fontSize: 11, fill: axisColor }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis hide />
                            <Tooltip
                                labelFormatter={(label) => shortWeekday(label as string)}
                                formatter={(value: number) => [`${value} messages`, '']}
                                contentStyle={{
                                    background: dark ? '#1E1E21' : '#FFFFFF',
                                    border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
                                    borderRadius: 12,
                                    fontSize: 12,
                                    color: dark ? '#E5E7EB' : '#111827',
                                }}
                                cursor={{ fill: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                            />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={28} animationDuration={700}>
                                {data.map((_, i) => (
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