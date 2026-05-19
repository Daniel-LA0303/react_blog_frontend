import { useNavigate } from "react-router-dom";
import useConversation from "../../../context/hooks/useConversation";
import { useSocketContext } from "../../../context/SocketContext";
import useGetSocketMessage from "../../../context/hooks/useGetSocketMessage";
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";



function User({ user, onSelect }) {

  const navigate = useNavigate();

  // state zustand
  const { selectedConversation, setSelectedConversation } = useConversation();

  const { globalData } = useGlobalDataContext();

  // context socket to get online users
  const { socket, onlineUsers } = useSocketContext();

  // notifications
  const { notifications, setNotifications } = useGetSocketMessage();

  // we select one user then we paint the messages
  const isSelected = selectedConversation?._id === user._id;

  // Check if the user is online
  const isOnline = onlineUsers.includes(user._id);

  // Count unread messages for the user
  const unreadMessages = notifications[user._id] || 0;

  // Handle user selection
  const handleSelectConversation = () => {

    navigate(`/chat/${user._id}`);


    setSelectedConversation(user);

    // console.log("Selected user:", user);
    
    setNotifications((prev) => ({
      ...prev,
      [user._id]: 0,
    }));

    if (window.innerWidth < 640) {
      onSelect?.(); // función pasada desde Users → ChatLayout
    }

  };

  return (
    <div
      className={`mb-1 rounded-md hover:bg-blue-500 hover:rounded-md duration-300 hover:text-white 
        ${isSelected ? "bg-blue-500 hover:rounded-md" : "hover:rounded-md"} 
        `}
      onClick={handleSelectConversation}
    >
      <div className="flex items-center space-x-4 px-2 py-3 cursor-pointer hover:text-white">
        <div className="relative w-10 h-10">
          {/* Avatar */}
          <img
            className="w-full h-full rounded-full"
            src={`${user.profilePicture?.secure_url || "/avatar.png"}`}
            alt="Avatar"
          />

          {/* Indicador de estado */}
          <span
            className={`
              absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-900
              ${isOnline ? "bg-green-500" : "bg-gray-400"}
            `}
          ></span>
        </div>
        <p className={`text-lg 
          hover:text-white truncate
        `}>
          {user.email}
        </p>
        {/* Mostrar el contador de mensajes no leídos */}
        {unreadMessages > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2">
            {unreadMessages}
          </span>
        )}
      </div>
    </div>
  );
}

export default User;

