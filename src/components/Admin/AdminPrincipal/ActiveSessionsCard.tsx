// components/dashboard/sessions/ActiveSessionsCard.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { VerifiedUserIcon, BlockIcon } from '../../../utils/iconsUtils';
import useGlobalDataContext from '../../../context/hooks/useGlobalDataContext';
// import { clientAuthAxios } from '../../../services/clientAuthAxios';

// ---- Iconos locales estilo IconBase ----
const DevicesIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="14" height="10" rx="1.5" />
        <path d="M8 18h4" /><path d="M6 22h10" />
    </svg>
);
const AlertIcon = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);
const DesktopIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
);
const MobileIcon = ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" />
    </svg>
);

// ---- Tipos ----
interface SessionUser {
    userId: string;
    name: string;
    email: string;
    profilePicture?: { secure_url: string; public_id: string };
}

interface ActiveSession {
    id: string;
    user: SessionUser;
    ipAddress: string;
    userAgent: string;
    origin?: string;
    host?: string;
    status: 'ACTIVE' | 'REVOKED';
    isSuspicious: boolean;
    createdAt: string;
}

interface ActiveSessionsResponse {
    summary: {
        activeSessions: number;
        revokedSessions: number;
        uniqueUsersActive: number;
        suspiciousSessions: number;
    };
    sessions: ActiveSession[];
}

// ---- Parser simple de userAgent (sin dependencias) ----
const parseUserAgent = (ua: string) => {
    const isMobile = /iphone|ipad|android|mobile/i.test(ua);
    let browser = 'Unknown browser';
    if (/edg/i.test(ua)) browser = 'Edge';
    else if (/chrome/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';

    let os = 'Unknown OS';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/mac os/i.test(ua)) os = 'macOS';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad/i.test(ua)) os = 'iOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    return { isMobile, label: `${browser} · ${os}` };
};

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

const formatNumber = (n: number) => new Intl.NumberFormat('en-US').format(n);

// ---- Fake service (reemplazar por llamada real) ----
const fetchActiveSessions = async (): Promise<ActiveSessionsResponse> => {
    // const { data } = await clientAuthAxios.get('/stats/active-sessions');
    // return data;
    await new Promise((r) => setTimeout(r, 500));
    const now = Date.now();
    return {
        summary: { activeSessions: 342, revokedSessions: 128, uniqueUsersActive: 301, suspiciousSessions: 5 },
        sessions: [
            { id: '1', user: { userId: 'u1', name: 'Laura Méndez', email: 'laura.mendez@mail.com', profilePicture: { secure_url: '', public_id: '' } }, ipAddress: '187.190.22.4', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36', origin: 'app.miproyecto.com', host: 'api.miproyecto.com', status: 'ACTIVE', isSuspicious: false, createdAt: new Date(now - 12 * 60000).toISOString() },
            { id: '2', user: { userId: 'u2', name: 'Carlos Ruiz', email: 'carlos.ruiz@mail.com', profilePicture: { secure_url: '', public_id: '' } }, ipAddress: '45.132.10.9', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X)', origin: 'app.miproyecto.com', host: 'api.miproyecto.com', status: 'ACTIVE', isSuspicious: true, createdAt: new Date(now - 32 * 60000).toISOString() },
            { id: '3', user: { userId: 'u3', name: 'Ana Torres', email: 'ana.torres@mail.com', profilePicture: { secure_url: '', public_id: '' } }, ipAddress: '201.14.88.3', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15', origin: 'app.miproyecto.com', host: 'api.miproyecto.com', status: 'ACTIVE', isSuspicious: false, createdAt: new Date(now - 55 * 60000).toISOString() },
            { id: '4', user: { userId: 'u4', name: 'Diego Paredes', email: 'diego.paredes@mail.com', profilePicture: { secure_url: '', public_id: '' } }, ipAddress: '98.211.3.77', userAgent: 'Mozilla/5.0 (Linux; Android 14)', origin: 'app.miproyecto.com', host: 'api.miproyecto.com', status: 'ACTIVE', isSuspicious: true, createdAt: new Date(now - 2 * 3600000).toISOString() },
            { id: '5', user: { userId: 'u5', name: 'Sofía Vega', email: 'sofia.vega@mail.com', profilePicture: { secure_url: '', public_id: '' } }, ipAddress: '186.90.4.21', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/128.0', origin: 'app.miproyecto.com', host: 'api.miproyecto.com', status: 'ACTIVE', isSuspicious: false, createdAt: new Date(now - 4 * 3600000).toISOString() },
        ],
    };
};

const SUMMARY_TILES: { key: keyof ActiveSessionsResponse['summary']; label: string; accent: 'emerald' | 'slate' | 'sky' | 'rose' }[] = [
    { key: 'activeSessions', label: 'Active Sessions', accent: 'emerald' },
    { key: 'revokedSessions', label: 'Revoked Sessions', accent: 'slate' },
    { key: 'uniqueUsersActive', label: 'Unique Users Logged In', accent: 'sky' },
    { key: 'suspiciousSessions', label: 'Suspicious Sessions', accent: 'rose' },
];

const ACCENT_STYLES: Record<string, { light: string; dark: string }> = {
    emerald: { light: 'bg-emerald-50 text-emerald-600', dark: 'bg-emerald-500/10 text-emerald-400' },
    slate: { light: 'bg-slate-100 text-slate-600', dark: 'bg-slate-500/10 text-slate-400' },
    sky: { light: 'bg-sky-50 text-sky-600', dark: 'bg-sky-500/10 text-sky-400' },
    rose: { light: 'bg-rose-50 text-rose-600', dark: 'bg-rose-500/10 text-rose-400' },
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const rowVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export const ActiveSessionsCard = () => {
    const { globalData } = useGlobalDataContext();
    const dark = !globalData.themeGlobal;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ActiveSessionsResponse | null>(null);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await fetchActiveSessions();
                setData(res);
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
            className={`w-full rounded-2xl border p-5 flex flex-col gap-5
        ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
        >
            {/* Header */}
            <div className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center
          ${dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                    <VerifiedUserIcon size={16} />
                </div>
                <div>
                    <h3 className={`text-sm font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                        Active Sessions
                    </h3>
                    <p className={`text-xs ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        Who is currently logged in across the platform
                    </p>
                </div>
            </div>

            {/* Summary tiles */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`h-20 rounded-xl animate-pulse ${dark ? 'bg-gray-800/60' : 'bg-gray-100'}`} />
                    ))}
                </div>
            ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SUMMARY_TILES.map(({ key, label, accent }) => {
                        const accentClass = dark ? ACCENT_STYLES[accent].dark : ACCENT_STYLES[accent].light;
                        return (
                            <motion.div
                                key={key}
                                variants={rowVariants}
                                className={`rounded-xl border p-4 flex flex-col gap-2 ${dark ? 'bg-[#1E1E21] border-gray-800' : 'bg-gray-50 border-gray-100'}`}
                            >
                                <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-full w-fit ${accentClass}`}>
                                    {label}
                                </span>
                                <span className={`text-2xl font-bold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}>
                                    {formatNumber(data?.summary[key] ?? 0)}
                                </span>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* Divider */}
            <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

            {/* Sessions list */}
<div className={`rounded-xl border overflow-hidden ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
  <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
    {loading ? (
      <div className="p-3 flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={`h-14 rounded-xl animate-pulse ${dark ? 'bg-gray-800/60' : 'bg-gray-100'}`} />
        ))}
      </div>
    ) : (
      <table className="w-full border-collapse min-w-[640px]">
        <thead className={`sticky top-0 z-10 ${dark ? 'bg-[#27272A]' : 'bg-white'}`}>
          <tr className={`border-b ${dark ? 'border-gray-800' : 'border-gray-100'}`}>
            <th className={`text-left text-[10px] font-semibold uppercase tracking-wide px-4 py-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              User
            </th>
            <th className={`text-left text-[10px] font-semibold uppercase tracking-wide px-4 py-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Device
            </th>
            <th className={`text-left text-[10px] font-semibold uppercase tracking-wide px-4 py-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              IP Address
            </th>
            <th className={`text-left text-[10px] font-semibold uppercase tracking-wide px-4 py-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Status
            </th>
            <th className={`text-right text-[10px] font-semibold uppercase tracking-wide px-4 py-3 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Time
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.sessions.map((session, index) => {
            const { isMobile, label: deviceLabel } = parseUserAgent(session.userAgent);
            const isLast = index === (data.sessions.length - 1);

            return (
              <tr
                key={session.id}
                className={`
                  ${!isLast ? `border-b ${dark ? 'border-gray-800' : 'border-gray-100'}` : ''}
                  ${session.isSuspicious ? (dark ? 'bg-rose-500/[0.04]' : 'bg-rose-50/60') : ''}
                  transition-colors duration-150
                  ${dark ? 'hover:bg-gray-800/30' : 'hover:bg-gray-50'}
                `}
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={session.user.profilePicture?.secure_url || '/avatar.png'}
                      alt={session.user.name}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0 mx-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-semibold whitespace-nowrap ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                          {session.user.name}
                        </span>
                        {session.isSuspicious && (
                          <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0
                            ${dark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <AlertIcon size={10} /> Suspicious
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] block ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {session.user.email}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Device */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`flex-shrink-0 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {isMobile ? <MobileIcon size={13} /> : <DesktopIcon size={13} />}
                    </span>
                    <span className={`text-xs whitespace-nowrap ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {deviceLabel}
                    </span>
                  </div>
                </td>

                {/* IP */}
                <td className="px-4 py-3">
                  <span className={`text-xs font-mono whitespace-nowrap ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {session.ipAddress}
                  </span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap
                    ${session.status === 'ACTIVE'
                      ? (dark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                      : (dark ? 'bg-slate-500/10 text-slate-400' : 'bg-slate-100 text-slate-600')
                    }`}>
                    {session.status === 'ACTIVE' ? <VerifiedUserIcon size={10} /> : <BlockIcon size={10} />}
                    {session.status === 'ACTIVE' ? 'Active' : 'Revoked'}
                  </span>
                </td>

                {/* Time */}
                <td className="px-4 py-3 text-right">
                  <span className={`text-[11px] whitespace-nowrap ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
                    {formatRelativeTime(session.createdAt)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    )}
  </div>
</div>
        </motion.div>
    );
};