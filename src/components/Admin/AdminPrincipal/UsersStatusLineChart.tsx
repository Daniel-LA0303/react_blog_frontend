// components/dashboard/charts/UsersStatusLineChart.tsx
import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface UsersTimelinePoint {
  date: string; // MM-DD-YYYY
  ACTIVE: number;
  TO_CONFIRM: number;
  BANNED: number;
}

interface UsersTimelineResponse {
  range: DateRange;
  data: UsersTimelinePoint[];
}

const SERIES_META = {
  ACTIVE: { label: 'Activos', light: '#2563EB', dark: '#60A5FA' },
  TO_CONFIRM: { label: 'Por confirmar', light: '#D97706', dark: '#FBBF24' },
  BANNED: { label: 'Baneados', light: '#E11D48', dark: '#FB7185' },
} as const;

// ---- Fake service (reemplazar por llamada real) ----
const fetchUsersStatusTimeline = async (range: DateRange): Promise<UsersTimelineResponse> => {
  // const { data } = await clientAuthAxios.get('/stats/users-status-timeline', { params: range });
  // return data;
  await new Promise((r) => setTimeout(r, 500));
  const points: UsersTimelinePoint[] = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (9 - i));
    return {
      date: `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`,
      ACTIVE: Math.floor(Math.random() * 20) + 5,
      TO_CONFIRM: Math.floor(Math.random() * 6),
      BANNED: Math.floor(Math.random() * 3),
    };
  });
  return { range, data: points };
};

// Convierte MM-DD-YYYY a algo corto tipo "Ene 05" para el eje X
const shortLabel = (mmddyyyy: string) => {
  const [mm, dd] = mmddyyyy.split('-');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[Number(mm) - 1]} ${dd}`;
};

export const UsersStatusLineChart = () => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState<UsersTimelinePoint[]>([]);

  const loadData = useCallback(async (range: DateRange) => {
    setLoading(true);
    try {
      const res = await fetchUsersStatusTimeline(range);
      setTimeline(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const gridColor = dark ? '#27272A' : '#F3F4F6';
  const axisColor = dark ? '#6B7280' : '#9CA3AF';

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
            Comportamiento de Usuarios
          </h3>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Activos, por confirmar y baneados en el tiempo
          </p>
        </div>
        <DateRangeFilter instanceId="users-status" onChange={loadData} />
      </div>

      <div className="relative w-full h-72 sm:h-80">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`h-24 w-24 rounded-full border-4 border-t-transparent animate-spin
              ${dark ? 'border-gray-700' : 'border-gray-200'}`} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
                iconSize={8}
                formatter={(value) => (
                  <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{value}</span>
                )}
              />
              {(Object.keys(SERIES_META) as (keyof typeof SERIES_META)[]).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={SERIES_META[key].label}
                  stroke={dark ? SERIES_META[key].dark : SERIES_META[key].light}
                  strokeWidth={2.5}
                  dot={{ r: 3, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  animationDuration={700}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};