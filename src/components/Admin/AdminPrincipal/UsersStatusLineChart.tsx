// components/dashboard/charts/UsersStatusLineChart.tsx
import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange, UsersTimelinePoint, UsersTimelineResponse } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
import clientAuthAxios from '../../../services/clientAuthAxios';
import { SERIES_META_USERS } from '../../../utils/adminUtils';





const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const fetchUsersStatusTimeline = async (range: DateRange): Promise<UsersTimelineResponse> => {
  const { data } = await clientAuthAxios.get('/dashboard/get-users-info', { params: range });
  return data.data;
};

const parseMMDDYYYY = (str: string) => {
  const [mm, dd, yyyy] = str.split('-').map(Number);
  return new Date(yyyy, mm - 1, dd);
};

/**
 * Umbral: por encima de este número de días, agrupamos por mes en vez de mostrar día a día.
 */
const DAILY_VIEW_MAX_DAYS = 31;

/**
 * Si el rango es corto (<= DAILY_VIEW_MAX_DAYS), regresa los puntos tal cual (día a día).
 * Si es largo, agrupa y SUMA los valores de cada mes en un solo punto por mes.
 * Esto reduce el número real de puntos en la línea, no solo las etiquetas del eje.
 */
const aggregateTimeline = (
  timeline: UsersTimelinePoint[],
  spanDays: number
): { points: UsersTimelinePoint[]; grouped: boolean } => {
  if (spanDays <= DAILY_VIEW_MAX_DAYS || timeline.length === 0) {
    return { points: timeline, grouped: false };
  }

  const monthBuckets = new Map<string, UsersTimelinePoint>();

  for (const point of timeline) {
    const d = parseMMDDYYYY(point.date);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const existing = monthBuckets.get(monthKey);
    if (existing) {
      existing.ACTIVE += point.ACTIVE;
      existing.TO_CONFIRM += point.TO_CONFIRM;
      existing.BANNED += point.BANNED;
    } else {
      // Usamos el día 01 del mes como "fecha representativa" del bucket
      monthBuckets.set(monthKey, {
        date: `${String(d.getMonth() + 1).padStart(2, '0')}-01-${d.getFullYear()}`,
        ACTIVE: point.ACTIVE,
        TO_CONFIRM: point.TO_CONFIRM,
        BANNED: point.BANNED,
      });
    }
  }

  // Los mapas mantienen orden de inserción, y el timeline original ya viene ordenado
  return { points: Array.from(monthBuckets.values()), grouped: true };
};

const buildLabelFormatter = (grouped: boolean) => (mmddyyyy: string) => {
  const [mm, dd, yyyy] = mmddyyyy.split('-');
  const monthName = MONTHS[Number(mm) - 1];

  if (!grouped) {
    return `${monthName} ${dd}`;
  }
  return `${monthName} ${yyyy}`; // un punto = un mes, mostramos mes + año
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
            Comportamiento de Usuarios
          </h3>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            {grouped
              ? 'Activos, por confirmar y baneados (agrupado por mes)'
              : 'Activos, por confirmar y baneados en el tiempo'}
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
            <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
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
              {(Object.keys(SERIES_META_USERS) as (keyof typeof SERIES_META_USERS)[]).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={SERIES_META_USERS[key].label}
                  stroke={dark ? SERIES_META_USERS[key].dark : SERIES_META_USERS[key].light}
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