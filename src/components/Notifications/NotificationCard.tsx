import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faComment,
  faHeart,
  faMessage,
  faNoteSticky,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import clientAuthAxios from "../../services/clientAuthAxios";
import { NotificationI } from "../../interfaces/notification.interface";
import { useNavigate } from "react-router-dom";

const typeConfig: Record<
  string,
  { icon: any; iconClass: string; dotClass: string, route: string}
> = {
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
};

const NotificationCard = ({
  notification,
  changeStatus,
  loadingNotificationId
}: {
  notification: NotificationI,
  changeStatus: (notification: string) => void,
  loadingNotificationId: string | null;
}) => {

  const navigate = useNavigate();

  const { globalData } = useGlobalDataContext();


  const config =
    typeConfig[notification.type] || typeConfig.DEFAULT;


  const routePage = async (notificationId: string) => {
    if(!notification.isRead){
      await changeStatus(notificationId);
    }
    navigate(`${config.route}${notification.entityId}`);
  }


  return (
    <div
      onClick={() => routePage(notification._id)}
      className={` ${!globalData.themeGlobal ? 'bg-[#27272A] text-white' : 'bg-white text-black'} border rounded-xl p-4 transition-all cursor-pointer hover:border-[#525252]`}
    >
      <div className="flex justify-between">
        <div className="flex gap-4 items-start">
          <div className="relative">
            <img
              src={notification.senderId.profilePicture.secure_url !== '' ? notification.senderId.profilePicture.secure_url : "/avatar.png"}
              alt=""
              className="w-12 h-12 rounded-full object-cover"
            />

            {!notification.isRead && (
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${config.dotClass}`}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={config.icon}
                className={`${config.iconClass}`}
              />

              <span className="font-medium text-white">
                {notification.senderId.name}
              </span>
            </div>

            <p className="text-slate-300 mt-1">
              {notification.message}
            </p>

            <span className="text-xs text-slate-500 mt-2 block">
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          {
            !notification.isRead &&
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeStatus(notification._id)
              }}
              className="bg-[rgb(37,99,235)] hover:bg-[#507ddd] py-1 px-4 rounded-lg text-white text-sm">
               {loadingNotificationId === notification._id ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg></> : 'Mark as Read'}
            </button>
          }
        </div>
      </div>
    </div>
  );
}
export default NotificationCard;