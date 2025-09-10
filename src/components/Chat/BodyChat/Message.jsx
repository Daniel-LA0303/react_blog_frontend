import { Tooltip } from "@mui/material";
import { useAuth } from "../../../context/UserAuthContex";
import { Link } from "react-router-dom";


function Message({ message }) {
  
  const { userAuth } = useAuth();
  const itsMe = (message.senderId._id || message.senderId) === userAuth.userId;

  // Colores y bordes según el mensaje
  const bgColor = itsMe ? "bg-blue-500 text-white" : "bg-[#303030] text-white";
  const roundedCorners = itsMe
    ? "rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-none"
    : "rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-none";

  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-2">
      <div className={`flex flex-col ${itsMe ? "items-end" : "items-start"}`}>

        <div className="flex items-center space-x-2 mb-1">
          <Tooltip title={message.senderId.name} arrow>
            <div className="relative w-6 h-6">
              <Link
                to={`/profile/${message.senderId._id || message.senderId}`}
              >
                <img
                  className="w-full h-full rounded-full"
                  src={`${message.senderId.profilePicture?.secure_url || "/avatar.png"}`}
                  alt="Avatar"
                />
              </Link>
            </div>
          </Tooltip>
        </div>

        {/* Message bubble */}
        <div
          className={`px-3 py-2 break-words ${bgColor} ${roundedCorners}`}
        >
          {message.message}
        </div>

        {/* Timestamp */}
        <div className="text-xs text-gray-400 mt-1">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}

export default Message;
