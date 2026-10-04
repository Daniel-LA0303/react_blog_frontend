// components/dashboard/engagement/CreationActivityCards.tsx
import { ReactNode, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area,
    LineChart, Line,
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { CreationActivityData } from '../../interfaces/admin.interfaces';
import clientAuthAxios from '../../services/clientAuthAxios';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';


const fetchCreationActivity = async (): Promise<CreationActivityData> => {
    const { data } = await clientAuthAxios.get('/dashboard/get-creation-activity');
    return data.data.data;
};

const shortWeekday = (mmddyyyy: string) => {
    const [mm, dd, yyyy] = mmddyyyy.split('-');
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
};

/* ---------- Wrapper compartido ---------- */
interface ChartCardProps {
    title: string;
    dark: boolean;
    loading: boolean;
    children: ReactNode;
}

const ChartCard = ({ title, dark, loading, children }: ChartCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`rounded-2xl border p-5 flex flex-col gap-4 h-full justify-between
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
    >
        <div>
            <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Last 7 days</p>
        </div>
        <div className="relative w-full h-48">
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`h-16 w-16 rounded-full border-4 border-t-transparent animate-spin
                        ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
                </div>
            ) : (
                children
            )}
        </div>
    </motion.div>
);

const tooltipStyles = (dark: boolean) => ({
    contentStyle: {
        background: dark ? '#1E1E21' : '#FFFFFF',
        border: `1px solid ${dark ? '#27272A' : '#F3F4F6'}`,
        borderRadius: 12,
        fontSize: 12,
        color: dark ? '#E5E7EB' : '#111827',
    },
    itemStyle: { color: dark ? '#FFFFFF' : '#111827' },
    labelStyle: { color: dark ? '#FFFFFF' : '#111827' },
});

/* ---------- Componente principal: un solo fetch, 3 tarjetas ---------- */
export const CreationActivityCards = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<CreationActivityData>({ projects: [], quizzes: [], lists: [] });

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                setData(await fetchCreationActivity());
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const axisColor = dark ? '#6B7280' : '#9CA3AF';
    const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const tt = tooltipStyles(dark);

    // Colores únicos por tarjeta
    const projectsColor = dark ? '#2DD4BF' : '#0D9488';   // teal
    const quizzesColor = dark ? '#E879F9' : '#C026D3';    // fuchsia
    const listsColor = dark ? '#A78BFA' : '#7C3AED';      // violet

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* PROJECTS → Area */}
            <ChartCard title="Projects Created" dark={dark} loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.projects} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="projectsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={projectsColor} stopOpacity={0.45} />
                                <stop offset="100%" stopColor={projectsColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke={gridColor} />
                        <XAxis dataKey="date" tickFormatter={shortWeekday}
                            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                        <YAxis hide allowDecimals={false} />
                        <Tooltip
                            labelFormatter={(l) => shortWeekday(l as string)}
                            formatter={(v: number) => [`${v} projects`, '']}
                            {...tt}
                        />
                        <Area type="monotone" dataKey="count" stroke={projectsColor} strokeWidth={2.5}
                            fill="url(#projectsGradient)" animationDuration={700} />
                    </AreaChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* QUIZZES → Line */}
            <ChartCard title="Quizzes Created" dark={dark} loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.quizzes} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke={gridColor} strokeDasharray="4 4" />
                        <XAxis dataKey="date" tickFormatter={shortWeekday}
                            tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                        <YAxis hide allowDecimals={false} />
                        <Tooltip
                            labelFormatter={(l) => shortWeekday(l as string)}
                            formatter={(v: number) => [`${v} quizzes`, '']}
                            {...tt}
                        />
                        <Line type="monotone" dataKey="count" stroke={quizzesColor} strokeWidth={2.5}
                            dot={{ r: 4, fill: quizzesColor, strokeWidth: 0 }}
                            activeDot={{ r: 6 }} animationDuration={700} />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            {/* STUDY LISTS → Radar */}
            <ChartCard title="Study Lists Created" dark={dark} loading={loading}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={data.lists} outerRadius="75%">
                        <PolarGrid stroke={gridColor} />
                        <PolarAngleAxis dataKey="date" tickFormatter={shortWeekday}
                            tick={{ fontSize: 11, fill: axisColor }} />
                        <Tooltip
                            labelFormatter={(l) => shortWeekday(l as string)}
                            formatter={(v: number) => [`${v} lists`, '']}
                            {...tt}
                        />
                        <Radar dataKey="count" stroke={listsColor} fill={listsColor}
                            fillOpacity={0.35} strokeWidth={2} animationDuration={700} />
                    </RadarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
    );
};