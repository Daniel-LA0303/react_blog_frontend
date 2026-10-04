import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import userUserAuthContext from "../../context/hooks/useUserAuthContext";
import { NotificationI, NotificationType } from "../../interfaces/notification.interface";
import { useNavigate } from "react-router-dom";
import { typeNotificationConfig } from "../../utils/notificationUtils";

const MAX_MESSAGE_LENGTH = 60;

const NotificationCard = ({
  notification,
  changeStatus,
  loadingNotificationId,
}: {
  notification: NotificationI;
  changeStatus: (notification: string) => void;
  loadingNotificationId: string | null;
}) => {
  const navigate = useNavigate();
  const { globalData } = useGlobalDataContext();
  const { userAuth } = userUserAuthContext();

  const isDark = !globalData.themeGlobal;

  const getConfig = (type: NotificationType) =>
    typeNotificationConfig[type] ?? typeNotificationConfig.DEFAULT;

  const config = getConfig(notification.type);
  const IconComponent = config.icon;

  // Notificaciones del sistema (badges) no tienen remitente
  const sender = notification.senderId;
  const isSystem = !sender;
  const avatarSrc = sender?.profilePicture?.secure_url || "/avatar.png";
  const senderName = isSystem ? "Badge unlocked" : sender.name;

  const routePage = async (notificationId: string) => {
    if (!notification.isRead) {
      await changeStatus(notificationId);
    }

    // La badge se ve en el perfil del propio usuario
    if (notification.type === "BADGE_AWARDED") {
      navigate(`/profile/${userAuth.userId}`); // ajusta a tu ruta real de perfil
      return;
    }

    navigate(`${config.route}${notification.entityId}`);
  };

  const message =
    notification.message.length < MAX_MESSAGE_LENGTH
      ? notification.message
      : notification.message.slice(0, MAX_MESSAGE_LENGTH) + "...";

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
            {isSystem ? (
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-500/15">
                <IconComponent size={24} className={config.iconClass} />
              </div>
            ) : (
              <img
                src={avatarSrc}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
            )}

            {!notification.isRead && (
              <div
                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${config.dotClass}`}
              />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              {/* En system el icono ya está en el avatar, no se repite */}
              {!isSystem && <IconComponent size={18} className={config.iconClass} />}

              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {senderName}
              </span>
            </div>

            <p
              className={`mt-1 text-sm md:text-base ${
                isDark ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {message}
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