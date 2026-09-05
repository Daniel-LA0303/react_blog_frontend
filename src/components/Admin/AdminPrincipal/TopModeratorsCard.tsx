// components/dashboard/moderation/TopModeratorsCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ManageAccountsIcon } from '../../../utils/iconsUtils';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface TopModerator {
  userId: string;
  name: string;
  email: string;
  profilePicture?: { secure_url: string; public_id: string };
  actionsCount: number;
  percentage: number;
}

// ---- Fake service (reemplazar por llamada real) ----
const fetchTopModerators = async (): Promise<TopModerator[]> => {
  // const { data } = await clientAuthAxios.get('/stats/top-moderators');
  // return data.data;
  await new Promise((r) => setTimeout(r, 500));
  return [
    { userId: '1', name: 'Laura Méndez', email: 'laura.mendez@mail.com', profilePicture: { secure_url: '', public_id: '' }, actionsCount: 214, percentage: 100 },
    { userId: '2', name: 'Carlos Ruiz', email: 'carlos.ruiz@mail.com', profilePicture: { secure_url: '', public_id: '' }, actionsCount: 152, percentage: 71 },
    { userId: '3', name: 'Ana Torres', email: 'ana.torres@mail.com', profilePicture: { secure_url: '', public_id: '' }, actionsCount: 98, percentage: 46 },
    { userId: '4', name: 'Diego Paredes', email: 'diego.paredes@mail.com', profilePicture: { secure_url: '', public_id: '' }, actionsCount: 61, percentage: 28 },
    { userId: '5', name: 'Sofía Vega', email: 'sofia.vega@mail.com', profilePicture: { secure_url: '', public_id: '' }, actionsCount: 34, percentage: 16 },
  ];
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

export const TopModeratorsCard = () => {
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  const [loading, setLoading] = useState(true);
  const [moderators, setModerators] = useState<TopModerator[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchTopModerators();
        setModerators(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`rounded-2xl border p-5 flex flex-col gap-4 h-full
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
    >
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center
          ${dark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
          <ManageAccountsIcon size={16} />
        </div>
        <div>
          <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
            Top Moderators
          </h3>
          <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
            Most active moderators overall
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`h-12 rounded-xl animate-pulse ${dark ? 'bg-gray-800/60' : 'bg-gray-100'}`} />
          ))}
        </div>
      ) : (
        <motion.ul variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-3">
          {moderators.map((mod, index) => (
            <motion.li key={mod.userId} variants={rowVariants} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-4 text-center flex-shrink-0
                ${index === 0 ? (dark ? 'text-amber-400' : 'text-amber-500') : dark ? 'text-gray-600' : 'text-gray-400'}`}>
                {index + 1}
              </span>

              <img
                src={mod.profilePicture?.secure_url || '/avatar.png'}
                alt={mod.name}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-semibold truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                    {mod.name}
                  </span>
                  <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {mod.actionsCount}
                  </span>
                </div>
                <div className={`mt-1 h-1.5 w-full rounded-full overflow-hidden ${dark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.percentage}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 * index }}
                    className={`h-full rounded-full ${dark ? 'bg-indigo-400' : 'bg-indigo-500'}`}
                  />
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </motion.div>
  );
};