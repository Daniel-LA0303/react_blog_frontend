import { BellIcon, CommentIcon, HeartIcon, MessageIcon, NoteStickyIcon, UserIcon  } from "./iconsUtils";

export const typeNotificationConfig: Record<string, {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    iconClass: string;
    dotClass: string;
    route: string;
}> = {
    LIKE_POST: {
        icon: HeartIcon,
        iconClass: "text-rose-400",
        dotClass: "bg-rose-400",
        route: "/view-post/"
    },
    FOLLOW_USER: {
        icon: UserIcon,
        iconClass: "text-blue-400",
        dotClass: "bg-blue-400",
        route: "/profile/"
    },
    COMMENT_POST: {
        icon: CommentIcon,
        iconClass: "text-sky-400",
        dotClass: "bg-sky-400",
        route: "/view-post/"
    },
    REPLY_COMMENT: {
        icon: CommentIcon,
        iconClass: "text-violet-400",
        dotClass: "bg-violet-400",
        route: "/view-post/"
    },
    MESSAGE: {
        icon: MessageIcon,
        iconClass: "text-purple-400",
        dotClass: "bg-purple-400",
        route: "/view-post/"
    },
    NOTE: {
        icon: NoteStickyIcon,
        iconClass: "text-amber-400",
        dotClass: "bg-amber-400",
        route: "/view-post/"
    },
    DEFAULT: {
        icon: BellIcon,
        iconClass: "text-slate-400",
        dotClass: "bg-slate-400",
        route: "/view-post/"
    },
};
