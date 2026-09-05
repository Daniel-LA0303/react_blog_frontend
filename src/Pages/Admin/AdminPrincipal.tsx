import React from 'react'
import { FlagIcon, ManageAccountsIcon, VerifiedUserIcon } from '../../utils/iconsUtils';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import { motion, Variants } from "framer-motion";
import { UsersStatusLineChart } from '../../components/Admin/AdminPrincipal/UsersStatusLineChart';
import { PostsStatusDonutChart } from '../../components/Admin/AdminPrincipal/PostsStatusDonutChart';
import { ModerationActionsChart } from '../../components/Admin/AdminPrincipal/ModerationActionsChart';
import { TopModeratorsCard } from '../../components/Admin/AdminPrincipal/TopModeratorsCard';
import { RecentActionsCard } from '../../components/Admin/AdminPrincipal/RecentActionsCard';
import { CategoryAnalyticsCard } from '../../components/Admin/AdminPrincipal/CategoryAnalyticsCard';
import { EngagementOverviewCard } from '../../components/Admin/AdminPrincipal/EngagementOverviewCard';
import { ReportsDistributionCard } from '../../components/Admin/AdminPrincipal/ReportsDistributionCard';
import { MessagesActivityCard } from '../../components/Admin/AdminPrincipal/MessagesActivityCard';
import { NotificationsActivityCard } from '../../components/Admin/AdminPrincipal/NotificationsActivityCard';
import { ActiveSessionsCard } from '../../components/Admin/AdminPrincipal/ActiveSessionsCard';

const IconBase = ({ size = 20, children }: { size?: number; children: React.ReactNode }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {children}
    </svg>
);

const PostsIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <path d="M4 4h16v16H4z" opacity="0" />
        <path d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
        <path d="M9 13h6" /><path d="M9 17h6" /><path d="M9 9h2" />
    </IconBase>
);

const CategoriesIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
);

const CommentsIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <path d="M21 12a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.94L3 21l1.44-5.6A8.5 8.5 0 1 1 21 12z" />
    </IconBase>
);

const ConversationsIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <path d="M18 8a4 4 0 0 0-8 0v3a4 4 0 0 1-8 0" opacity="0" />
        <rect x="3" y="5" width="14" height="10" rx="2" />
        <path d="M7 19l3-4" /><path d="M17 9h4v6h-3l-1 3-1-3" opacity="0" />
    </IconBase>
);

const NotificationsIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </IconBase>
);

const TokensIcon = ({ size }: { size?: number }) => (
    <IconBase size={size}>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </IconBase>
);

// ---- Tipos ----
interface DashboardStatsData {
    usersTotal: number;
    postsTotal: number;
    categoriesTotal: number;
    commentsTotal: number;
    reportsTotal: number;
    conversationsTotal: number;
    notificationsTotal: number;
    tokensTotal: number;
    auditLogsTotal: number;
}

interface StatCardConfig {
    key: keyof DashboardStatsData;
    label: string;
    icon: (props: { size?: number }) => JSX.Element;
    accent: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'violet' | 'fuchsia' | 'teal' | 'slate';
}

const CARDS: StatCardConfig[] = [
    { key: 'usersTotal', label: 'Users', icon: VerifiedUserIcon, accent: 'indigo' },
    { key: 'postsTotal', label: 'Posts', icon: PostsIcon, accent: 'emerald' },
    { key: 'categoriesTotal', label: 'Categories', icon: CategoriesIcon, accent: 'amber' },
    { key: 'commentsTotal', label: 'Comments', icon: CommentsIcon, accent: 'sky' },
    { key: 'reportsTotal', label: 'Reports', icon: FlagIcon, accent: 'rose' },
    { key: 'conversationsTotal', label: 'Conversations', icon: ConversationsIcon, accent: 'violet' },
    { key: 'notificationsTotal', label: 'Notifications', icon: NotificationsIcon, accent: 'fuchsia' },
    { key: 'tokensTotal', label: 'Sesiones activas', icon: TokensIcon, accent: 'teal' },
    { key: 'auditLogsTotal', label: 'Audit Logs', icon: ManageAccountsIcon, accent: 'slate' },
];

const ACCENT_STYLES: Record<StatCardConfig['accent'], { light: string; dark: string }> = {
    indigo: { light: 'bg-indigo-50 text-indigo-600', dark: 'bg-indigo-500/10 text-indigo-400' },
    emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
    amber: { light: 'bg-amber-50 text-amber-600', dark: 'bg-amber-500/10 text-amber-400' },
    rose: { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-500/10 text-rose-400' },
    sky: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
    violet: { light: 'bg-violet-50 text-violet-600', dark: 'bg-violet-500/10 text-violet-400' },
    fuchsia: { light: 'bg-fuchsia-50 text-fuchsia-600', dark: 'bg-fuchsia-500/10 text-fuchsia-400' },
    teal: { light: 'bg-teal-50 text-teal-600', dark: 'bg-teal-500/10 text-teal-400' },
    slate: { light: 'bg-slate-100 text-slate-600', dark: 'bg-slate-500/10 text-slate-400' },
};

// ---- Data fake (aquí luego conectas tu endpoint real) ----
const FAKE_STATS: DashboardStatsData = {
    usersTotal: 1999,
    postsTotal: 4820,
    categoriesTotal: 32,
    commentsTotal: 12873,
    reportsTotal: 47,
    conversationsTotal: 356,
    notificationsTotal: 9021,
    tokensTotal: 1543,
    auditLogsTotal: 782,
};

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

const containerVariants = {
    hidden: {},
    show: {
        transition: { staggerChildren: 0.05 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};


const AdminPrincipal = () => {

    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;
    const stats = FAKE_STATS; // <- reemplazar por data real cuando exista el endpoint

    return (
        <main className='max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10 space-y-7'>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4"
            >
                {CARDS.map(({ key, label, icon: Icon, accent }) => {
                    const value = stats[key];
                    const accentClass = dark ? ACCENT_STYLES[accent].dark : ACCENT_STYLES[accent].light;

                    return (
                        <motion.div
                            key={key}
                            variants={cardVariants}
                            whileHover={{ y: -3 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={`rounded-2xl border p-5 flex flex-col gap-4 transition-colors duration-200 cursor-pointer
                                ${dark
                                    ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
                                    : 'bg-white border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${accentClass}`}>
                                <Icon size={18} />
                            </div>

                            <div className="flex flex-col gap-1 min-w-0">
                                <span className={`text-2xl font-bold tracking-tight tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {formatNumber(value)}
                                </span>
                                <span className={`text-xs font-medium truncate ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>


            <div>
                <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Users and Posts Activity
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">

                    <UsersStatusLineChart />
                    <PostsStatusDonutChart />
                </div>
            </div>


            <section className="mt-6 flex flex-col gap-4">
                <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Moderation Activity
                </h2>

                <ModerationActionsChart />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <TopModeratorsCard />
                    <RecentActionsCard />
                </div>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 mt-4">
                <div className="xl:col-span-3">
                    <CategoryAnalyticsCard />
                </div>
                <div className="xl:col-span-2">
                    <EngagementOverviewCard />
                </div>
            </div>

            <section className="mt-6 flex flex-col gap-4">
                <h2 className={`text-base font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    Reports & Activity
                </h2>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <ReportsDistributionCard />
                    <MessagesActivityCard />
                    <NotificationsActivityCard />
                </div>
            </section>

            <section className="mt-6">
                <ActiveSessionsCard />
            </section>
        </main>
    );
};

export default AdminPrincipal