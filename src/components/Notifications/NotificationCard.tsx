import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import { NotificationI, NotificationType } from "../../interfaces/notification.interface";
import { useNavigate } from "react-router-dom";
import { typeNotificationConfig } from "../../utils/notificationUtils";

const NotificationCard = ({
  notification,
  changeStatus,
  loadingNotificationId
}: {
  notification: NotificationI;
  changeStatus: (notification: string) => void;
  loadingNotificationId: string | null;
}) => {
  const navigate = useNavigate();
  const { globalData } = useGlobalDataContext();

  const isDark = !globalData.themeGlobal;

  const getConfig = (type: NotificationType) =>
    typeNotificationConfig[type] ?? typeNotificationConfig.DEFAULT;

  const config = getConfig(notification.type);
  const IconComponent = config.icon;

  const routePage = async (notificationId: string) => {
    if (!notification.isRead) {
      await changeStatus(notificationId);
    }
    navigate(`${config.route}${notification.entityId}`);
  };

  return (
    <div
      onClick={() => routePage(notification._id)}
      className={`${
        isDark ? "bg-[#27272A] text-white" : "bg-white text-black"
      } rounded-xl p-4 transition-all cursor-pointer`}
    >
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex gap-4 items-start">
          <div className="relative">
            <img
              src={
                notification.senderId.profilePicture.secure_url !== ""
                  ? notification.senderId.profilePicture.secure_url
                  : "/avatar.png"
              }
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
              <IconComponent size={18} className={config.iconClass} />

              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {notification.senderId.name}
              </span>
            </div>

            <p
              className={`mt-1 text-sm md:text-base ${
                isDark ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {notification.message.length < 40
                ? notification.message
                : notification.message.slice(0, 60) + "..."}
            </p>

            <span
              className={`text-xs mt-2 block ${
                isDark ? "text-slate-500" : "text-gray-400"
              }`}
            >
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex md:block justify-center">
          {!notification.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                changeStatus(notification._id);
              }}
              className="bg-[rgb(37,99,235)] hover:bg-[#507ddd] py-1 px-1 md:px-4 rounded-lg text-white text-xs md:text-sm mt-2 md:mt-0 w-3/4 md:w-auto flex items-center justify-center gap-2"
            >
              {loadingNotificationId === notification._id ? (
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                "Mark as Read"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default NotificationCard;