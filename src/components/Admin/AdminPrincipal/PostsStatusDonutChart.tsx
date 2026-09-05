// components/dashboard/charts/PostsStatusDonutChart.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DateRange } from '../../../interfaces/admin.interfaces';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import { DateRangeFilter } from '../DateRangeFilter';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

type PostStatus = 'PUBLISHED' | 'HIDDEN' | 'DELETED';

interface PostsStatusDatum {
  status: PostStatus;
  count: number;
  percentage: number;
}

interface PostsStatusResponse {
  range: DateRange;
  total: number;
  data: PostsStatusDatum[];
}

const STATUS_META: Record<PostStatus, { label: string; light: string; dark: string }> = {
  PUBLISHED: { label: 'Publicados', light: '#059669', dark: '#34D399' },
  HIDDEN: { label: 'Ocultos', light: '#D97706', dark: '#FBBF24' },
  DELETED: { label: 'Eliminados', light: '#E11D48', dark: '#FB7185' },
};

// ---- Fake service (reemplazar por llamada real) ----
const fetchPostsStatusDistribution = async (range: DateRange): Promise<PostsStatusResponse> => {
  // const { data } = await clientAuthAxios.get('/stats/posts-status-distribution', { params: range });
  // return data;
  await new Promise((r) => setTimeout(r, 500));
  const total = 1000;
  return {
    range,
    total,
    data: [
      { status: 'PUBLISHED', count: 500, percentage: 50 },
      { status: 'HIDDEN', count: 300, percentage: 30 },
      { status: 'DELETED', count: 200, percentage: 20 },
    ],
  };
};

export const PostsStatusDonutChart = () => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<PostsStatusResponse | null>(null);

  const loadData = useCallback(async (range: DateRange) => {
    setLoading(true);
    try {
      const res = await fetchPostsStatusDistribution(range);
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
            Distribución de Posts
          </h3>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Publicados, ocultos y eliminados por el usuario
          </p>
        </div>
        <DateRangeFilter instanceId="posts-status" onChange={loadData} />
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
                  animationBegin={0}
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

            {/* Total centrado */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-9">
              <span className={`text-2xl font-bold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                {stats?.total ?? 0}
              </span>
              <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>Total posts</span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};