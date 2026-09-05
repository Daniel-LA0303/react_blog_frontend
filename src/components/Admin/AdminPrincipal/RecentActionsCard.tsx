// components/dashboard/moderation/RecentActionsCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlagIcon } from '../../../utils/iconsUtils';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

interface RecentAction {
    _id: string;
    action: string;
    category: 'AUTH' | 'MODERATION' | 'CONTENT' | 'SYSTEM';
    actor: { name: string; roles: string[] };
    target?: { entityType?: string; name?: string };
    createdAt: string;
}

// ---- Fake service (reemplazar por llamada real) ----
const fetchRecentActions = async (): Promise<RecentAction[]> => {
    // const { data } = await clientAuthAxios.get('/audit-logs/recent', { params: { limit: 5 } });
    // return data.data;
    await new Promise((r) => setTimeout(r, 500));
    const now = Date.now();
    return [
        { _id: '1', action: 'HIDE_POST', category: 'MODERATION', actor: { name: 'Laura Méndez', roles: ['ROLE_USER', 'ROLE_MOD'] }, target: { entityType: 'Post', name: 'Cómo mejorar tu setup' }, createdAt: new Date(now - 5 * 60000).toISOString() },
        { _id: '2', action: 'BAN_USER', category: 'MODERATION', actor: { name: 'admin_root', roles: ['ROLE_USER', 'ROLE_ADMIN'] }, target: { entityType: 'User', name: 'spamuser123' }, createdAt: new Date(now - 42 * 60000).toISOString() },
        { _id: '3', action: 'DELETE_COMMENT', category: 'MODERATION', actor: { name: 'Carlos Ruiz', roles: ['ROLE_USER', 'ROLE_MOD'] }, target: { entityType: 'Comment', name: 'comentario ofensivo' }, createdAt: new Date(now - 3 * 3600000).toISOString() },
        { _id: '4', action: 'SYSTEM_CLEANUP', category: 'SYSTEM', actor: { name: 'system', roles: [] }, target: undefined, createdAt: new Date(now - 6 * 3600000).toISOString() },
        { _id: '5', action: 'ADD_MODERATOR', category: 'SYSTEM', actor: { name: 'admin_root', roles: ['ROLE_USER', 'ROLE_ADMIN'] }, target: { entityType: 'User', name: 'Ana Torres' }, createdAt: new Date(now - 26 * 3600000).toISOString() },
    ];
};

const CATEGORY_STYLES: Record<RecentAction['category'], { light: string; dark: string }> = {
    MODERATION: { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-500/10 text-rose-400' },
    SYSTEM: { light: 'bg-slate-100 text-slate-600', dark: 'bg-slate-500/10 text-slate-400' },
    AUTH: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
    CONTENT: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
};

// "action" viene como ADD_MODERATOR -> "Add moderator"
const formatActionLabel = (action: string) =>
    action
        .toLowerCase()
        .split('_')
        .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
        .join(' ');

const formatRelativeTime = (iso: string) => {
    const diffMs = Date.now() - new Date(iso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const rowVariants = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export const RecentActionsCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState<RecentAction[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchRecentActions();
                setActions(data);
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
                    ${dark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                    <FlagIcon size={16} />
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Recent Actions
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Last 5 logged actions
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
                <motion.ul variants={containerVariants} initial="hidden" animate="show" className="flex flex-col gap-1">
                    {actions.map((item, index) => {
                        const badgeClass = dark ? CATEGORY_STYLES[item.category].dark : CATEGORY_STYLES[item.category].light;
                        return (
                            <motion.li
                                key={item._id}
                                variants={rowVariants}
                                className={`flex items-center justify-between gap-3 py-2.5 ${index !== actions.length - 1 ? `border-b ${dark ? 'border-gray-800' : 'border-gray-100'}` : ''
                                    }`}
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0 ${badgeClass}`}>
                                        {formatActionLabel(item.action)}
                                    </span>
                                    <span className={`text-xs truncate ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        by <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item.actor.name}</span>
                                        {item.target?.name && (
                                            <>
                                                {' '}on <span className={`font-medium ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{item.target.name}</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                                <span className={`text-[11px] flex-shrink-0 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                                    {formatRelativeTime(item.createdAt)}
                                </span>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            )}
        </motion.div>
    );
};