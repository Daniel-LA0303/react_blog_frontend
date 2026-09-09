// components/dashboard/moderation/RecentActionsCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FlagIcon } from '../../../utils/iconsUtils';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
import clientAuthAxios from '../../../services/clientAuthAxios';
import UIModal from '../../Global/UIModal';
import { RecentAction } from '../../../interfaces/admin.interfaces';
import { CATEGORY_STYLES } from '../../../utils/adminUtils';
import { containerVariants, rowVariants } from '../../../utils/animationsUtils';
import useGetSocketNewLogNotification from '../../../context/hooks/webSockets/useGetNewLogNotification';

const fetchRecentActions = async (): Promise<RecentAction[]> => {
    const { data } = await clientAuthAxios.get('/dashboard/get-recent-logs', { params: { limit: 5 } });
    return data.data;
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

export const RecentActionsCard = () => {

    const { newLog } = useGetSocketNewLogNotification();

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;
    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState<RecentAction[]>([]);
    const [selectedAction, setSelectedAction] = useState<RecentAction | null>(null);

    useEffect(() => {
        if (!newLog) return;

        setActions((prevActions) => {
            const updated = [newLog, ...prevActions]; // add new
            return updated.slice(0, 5);                // only 5 recents
        });
    }, [newLog]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const data = await fetchRecentActions();
                console.log(data);

                setActions(data);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
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
                                    onClick={() => setSelectedAction(item)}
                                    className={`flex items-center justify-between gap-3 py-2.5 cursor-pointer rounded-lg px-1 -mx-1 transition-colors
                                        ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}
                                        ${index !== actions.length - 1 ? `border-b ${dark ? 'border-gray-800' : 'border-gray-100'}` : ''
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

            <UIModal
                open={!!selectedAction}
                onClose={() => setSelectedAction(null)}
                dark={dark}
                maxWidth={420}
            >
                {selectedAction && (
                    <div className="p-5 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span
                                className={`text-[10px] font-bold px-2 py-1 rounded-full flex-shrink-0
                                    ${dark ? CATEGORY_STYLES[selectedAction.category].dark : CATEGORY_STYLES[selectedAction.category].light}`}
                            >
                                {formatActionLabel(selectedAction.action)}
                            </span>
                            <span className={`text-[11px] ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatRelativeTime(selectedAction.createdAt)}
                            </span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm">
                                <span className={dark ? 'text-gray-500' : 'text-gray-400'}>Actor</span>
                                <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {selectedAction.actor.name}
                                </span>
                            </div>
                            {selectedAction.target?.name && (
                                <div className="flex justify-between text-sm">
                                    <span className={dark ? 'text-gray-500' : 'text-gray-400'}>Target</span>
                                    <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {selectedAction.target.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className={dark ? 'text-gray-500' : 'text-gray-400'}>Date</span>
                                <span className={`font-medium ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {new Date(selectedAction.createdAt).toLocaleString()}
                                </span>
                            </div>
                            {/* If your RecentAction has extra fields (metadata, description, etc), drop them here */}
                        </div>

                        <button
                            onClick={() => setSelectedAction(null)}
                            className={`self-end text-xs font-medium px-3 py-1.5 rounded-lg
                                ${dark ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                            Close
                        </button>
                    </div>
                )}
            </UIModal>
        </>
    );
};