import { useParams } from "react-router-dom";
import useConversation from "../../../context/hooks/useConversation";
import useGetAllUsers from "../../../context/hooks/useGetAllUsers";
import { useEffect } from "react";
import Chatuser from "./ChatUser";
import Messages from "./Messages";
import { useAuth } from "../../../context/UserAuthContex";
import Typesend from "./Typesend";

import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";



function Right({ openSidebar }) {

  // we get state zustand
  const { id } = useParams();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { globalData } = useGlobalDataContext();
  const [allUsers] = useGetAllUsers(); // tienes este hook ya en Users

  useEffect(() => {
    if (id && !selectedConversation) {
      const user = allUsers.find((u) => u._id === id);
      if (user) setSelectedConversation(user);
    }
  }, [id, allUsers, selectedConversation, setSelectedConversation]);

  return (
    <div className="w-full h-screen flex flex-col text-gray-300 rounded-md">
      {!selectedConversation ? (
        <NoChatSelected
          openSidebar={openSidebar}
        />
      ) : (
        <>
          {/* Chat Header */}
          <Chatuser openSidebar={openSidebar} />

          {/* Messages Area */}
          <div className={`flex-1 overflow-y-auto ${globalData.themeGlobal ? 'chat-scroll-light' : 'chat-scroll'}` }>
            <Messages />
          </div>

          {/* Message Input */}
          <Typesend />
        </>
      )}
    </div>

  );
}

export default Right;

const NoChatSelected = ({ openSidebar }) => {
  const { userAuth } = useAuth();
  // console.log(authUser);
  return (
    <div className="relative flex h-screen items-center justify-center">
      {/* Botón móvil para abrir sidebar */}
      <button
        className="sm:hidden absolute left-5 top-5 p-2 rounded-md bg-gray-700 text-white hover:bg-blue-500"
        onClick={openSidebar}
      >
        <MenuOutlinedIcon className="text-xl " />
      </button>

      <h1 className="text-center px-4">
        Welcome{" "}
        {/* <span className="font-semibold text-xl">{authUser.user.fullname}</span> */}
        <br />
        No chat selected, please start conversation by selecting anyone from your contacts
      </h1>
    </div>
  );
};
