import {
    faBell,
    faHeart,
    faComment,
    faMessage,
    faNoteSticky,
    faCheckDouble,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useRef, useState } from 'react'
import useGetSocketNotification from '../../context/hooks/useGetSocketNotification'
import { useAuth } from '../../context/UserAuthContex'
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import clientAuthAxios from '../../services/clientAuthAxios'
import usePages from '../../context/hooks/usePages'
import { NotificationI, NotificationType } from '../../interfaces/notification.interface'
import { Link, useNavigate } from 'react-router-dom'

/* Helpers */
const typeConfig: Record<string, {
    icon: any;
    iconClass: string;
    dotClass: string;
    route: string;
}> = {
    LIKE_POST: {
        icon: faHeart,
        iconClass: "text-rose-400",
        dotClass: "bg-rose-400",
        route: "/view-post/"
    },
    FOLLOW_USER: {
        icon: faUser,
        iconClass: "text-blue-400",
        dotClass: "bg-blue-400",
        route: "/profile/"
    },
    COMMENT_POST: {
        icon: faComment,
        iconClass: "text-sky-400",
        dotClass: "bg-sky-400",
        route: "/view-post/"
    },
    REPLY_COMMENT: {
        icon: faComment,
        iconClass: "text-violet-400",
        dotClass: "bg-violet-400",
        route: "/view-post/"
    },
    MESSAGE: {
        icon: faMessage,
        iconClass: "text-purple-400",
        dotClass: "bg-purple-400",
        route: "/view-post/"
    },
    NOTE: {
        icon: faNoteSticky,
        iconClass: "text-amber-400",
        dotClass: "bg-amber-400",
        route: "/view-post/"
    },
    DEFAULT: {
        icon: faBell,
        iconClass: "text-slate-400",
        dotClass: "bg-slate-400",
        route: "/view-post/"
    },
}

const getConfig = (type: NotificationType) => typeConfig[type] ?? typeConfig.DEFAULT;

const relativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'just now'
    if (m < 60) return `${m}m`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h}h`
    return `${Math.floor(h / 24)}d`
}

/* Component */
const Notifications = () => {

    const navigate = useNavigate();

    const { notifications, setNotifications } = useGetSocketNotification()
    const { globalData } = useGlobalDataContext()
    const { userAuth } = useAuth()
    const { errorPage } = usePages()

    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const unread = (notifications as NotificationI[])?.filter(n => !n.isRead).length ?? 0

    /* fetch on mount */
    useEffect(() => {
        if (!userAuth) return
        setLoading(true)
        clientAuthAxios
            .get(`notifications/get-notifications-by-user-paginated/${userAuth.userId}?page=0&limit=5`)
            .then(r => {
                setNotifications(r.data.data.data)
            })
            .catch(e => console.error('notifications error:', e))
            .finally(() => setTimeout(() => setLoading(false), 200))
    }, [])

    /* close on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
                setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const markAll = () => setNotifications(
        notifications.map(n => ({ ...n, isRead: true }))
    );

    const markOne = async (notification: any, config: any) => {

        if(!config.isRead){
            await changeStatus(notification._id);
        }
        routePage(config, notification.entityId);

        setNotifications(
            notifications.map(n => (n._id === notification._id ? { ...n, isRead: true } : n))
        );
    }

    const changeStatus = async (notificationId: string) => {
        try {
            await clientAuthAxios.post(`notifications/change-status/${notificationId}`);
        } catch (error) {
            console.log(error);
        }
    }

    const routePage = async (config: any, notificationId: string) => {
        navigate(`${config.route}${notificationId}`);
    }

    return (
        <div ref={wrapperRef} className="relative inline-block">

            {/* Bell button */}
            <button
                onClick={() => setOpen(v => !v)}
                className={`
                    relative flex items-center justify-center w-10 h-10 rounded-xl
                    text-slate-300 transition-all duration-150
                    ${open
                        ? 'bg-violet-500/10 ring-1 ring-violet-500/40 text-violet-300'
                        : 'hover:bg-white/5 hover:text-slate-100'}
                `}
                aria-label="Notifications"
            >
                <FontAwesomeIcon icon={faBell} className="text-base" />

                {unread > 0 && (
                    <span className="
                        absolute top-1 right-1 min-w-[14px] h-[14px] px-[3px]
                        rounded-full bg-rose-500 text-white text-[9px] font-bold
                        flex items-center justify-center leading-none
                        ring-2 ring-[#0f0f1a] animate-pulse
                    ">
                        {unread > 5 ? '5+' : unread}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className={`
                    absolute right-0 top-[calc(100%+8px)] w-[360px] z-50
                    rounded-2xl border border-white/[0.07]

                    ${!globalData.themeGlobal ? 'bg-[#27272A] border-gray-800 hover:border-gray-700'
                        : 'bg-white border-gray-100 hover:border-gray-200'}
                        animate-[fadeSlide_0.15s_ease]
                `}>

                    {/* header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold tracking-tight ${!globalData.themeGlobal ? 'text-white' : 'text-black'}`}>
                                Notifications
                            </span>
                            {unread > 0 && (
                                <span className="
                                    text-[10px] font-semibold px-2 py-0.5 rounded-full
                                    bg-rose-500/15 text-rose-400 border border-rose-500/20
                                ">
                                    {unread} new
                                </span>
                            )}
                        </div>

                        {unread > 0 && (
                            <button
                                onClick={markAll}
                                className={`
                                    flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-lg transition-colors duration-150
                                    ${!globalData.themeGlobal ? 'text-white hover:bg-black/30' : 'text-black hover:bg-slate-200'}
                                `}
                            >
                                <FontAwesomeIcon icon={faCheckDouble} className="text-[9px]" />
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* body */}
                    <div className="max-h-[380px] overflow-y-auto">

                        {/* skeleton */}
                        {loading && (
                            <div className="flex flex-col gap-2 p-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="
                                        h-14 rounded-xl
                                        bg-gradient-to-r from-white/[0.03] via-white/[0.07] to-white/[0.03]
                                        bg-[length:200%_100%] animate-[shimmer_1.4s_infinite]
                                    " />
                                ))}
                            </div>
                        )}

                        {/* empty */}
                        {!loading && (!notifications || notifications.length === 0) && (
                            <div className="flex flex-col items-center gap-2 py-12 text-slate-600">
                                <FontAwesomeIcon icon={faBell} className="text-3xl opacity-30" />
                                <p className="text-xs">No notifications yet</p>
                            </div>
                        )}

                        {/* list */}
                        {!loading && (notifications as NotificationI[])?.map((notif, idx, arr) => {
                            const cfg = getConfig(notif.type)
                            const avatar = notif.senderId?.profilePicture?.secure_url
                            const isLast = idx === arr.length - 1

                            return (
                                <div
                                    key={notif._id}
                                    onClick={() => markOne(notif, cfg)}
                                    className={`
                                        relative flex items-start gap-3 px-4 py-3 cursor-pointer
                                        transition-colors duration-150
                                        ${!isLast ? 'border-b border-white/[0.04]' : ''}
                                        ${notif.isRead
                                            ? (!globalData.themeGlobal ? 'bg-black/20 hover:bg-black/10' : 'bg-slate-100 hover:bg-slate-50')
                                            : (!globalData.themeGlobal ? 'bg-black/40 hover:bg-black/10' : 'bg-slate-[#e9eef4] hover:bg-slate-50')
                                        }
                                    `}
                                >
                                    {/* unread dot */}
                                    {!notif.isRead && (
                                        <span className={`
                                            absolute left-1.5 top-1/2 -translate-y-1/2
                                            w-1 h-1 rounded-full ${cfg.dotClass}
                                        `} />
                                    )}

                                    {/* avatar */}
                                    <div className="relative shrink-0">
                                        {avatar
                                            ? <img
                                                src={avatar}
                                                alt={notif.senderId?.name}
                                                className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10"
                                            />
                                            : <div className="
                                                w-9 h-9 rounded-xl bg-white/[0.06]
                                                flex items-center justify-center
                                                text-xs font-bold text-slate-400 ring-1 ring-white/[0.06]
                                              ">
                                                {notif.senderId?.name?.[0]?.toUpperCase() ?? '?'}
                                            </div>
                                        }

                                        {/* type badge */}
                                        <div className={`
                                            absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-md  border border-white/[0.08] flex items-center justify-center
                                            ${!globalData.themeGlobal ? 'bg-[#13131f]' : 'bg-slate-200'}`}
                                        >
                                            <FontAwesomeIcon
                                                icon={cfg.icon}
                                                className={`text-[8px] ${cfg.iconClass}`}
                                            />
                                        </div>
                                    </div>

                                    {/* text */}
                                    <div className="flex-1 min-w-0 pt-0.5">
                                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                                            <span className="text-[12px] font-semibold text-slate-300 truncate">
                                                {notif.senderId?.name ?? 'Someone'}
                                            </span>
                                            <span className="text-[10px] text-slate-600 shrink-0">
                                                {relativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`
                                            text-[11px] leading-snug truncate
                                            ${notif.isRead ? 'text-slate-600' : 'text-slate-400'}
                                        `}>
                                            {notif.message}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* footer */}
                    {!loading && notifications?.length > 0 && (
                        <div className="border-t border-white/[0.06] px-4 py-2.5 text-center">
                            <Link
                                to={`/notifications/${userAuth.userId}`}
                                className={`
                                text-[11px] font-semibold  transition-colors duration-150
                                ${!globalData.themeGlobal ? 'text-white' : 'text-black'}
                            `}>
                                View all notifications
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {/* keyframes injected once */}
            <style>{`
                @keyframes fadeSlide {
                    from { opacity: 0; transform: translateY(-6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% 0; }
                    100% { background-position:  200% 0; }
                }
            `}</style>
        </div>
    )
}

export default Notifications