import {
    faBell,
    faHeart,
    faComment,
    faMessage,
    faNoteSticky,
    faUser,
} from '@fortawesome/free-solid-svg-icons'

export const typeNotificationConfig: Record<string, {
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