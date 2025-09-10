import { Link } from "react-router-dom";
import useConversation from "../../../context/hooks/useConversation";
import { useSocketContext } from "../../../context/SocketContext";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";


function Chatuser({ openSidebar }) {

  // we get state zustand
  const { selectedConversation } = useConversation();
  const { globalData } = useGlobalDataContext();

  // we get online users from socket context
  const { onlineUsers } = useSocketContext();

  // if user is online
  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(userId) ? "Online" : "Offline";
  };

  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <div className={`
       p-2 h-16 md:h-20 flex items-center space-x-3 md:space-x-4 duration-300 shadow-md rounded-md 
      ${globalData.themeGlobal ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-900 text-white'}
    `}>
      <button
        className="sm:hidden p-1 rounded hover:bg-gray-500"
        onClick={openSidebar}
      >
        <MenuOutlinedIcon className="text-xl " />
      </button>
      {/* Avatar */}
      <div>
        <div className="relative w-10 sm:w-12 md:w-14 rounded-full cursor-pointer">
          <img
            src={`${selectedConversation?.profilePicture?.secure_url || "/avatar.png"}`}
            alt="user avatar"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <Link
          to={`/profile/${selectedConversation._id}`}
          className="text-sm sm:text-base md:text-lg font-medium cursor-pointer truncate ">
          {selectedConversation.email}
        </Link>
        <span className="text-xs sm:text-sm md:text-base">
          {getOnlineUsersStatus(selectedConversation._id)}
        </span>
      </div>
    </div>
  );
}

export default Chatuser;
