import { useEffect, useState } from "react";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import useConversation from "./useConversation";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";
import { Socket } from "socket.io-client";

type Notifications = Record<string, number>;

const useGetSocketMessage = () => {
  const { socket } = useSocketContext() as { socket: Socket | null };

  const { setAllUsers, userAuth } = useAuth();

  const { messages, setMessage, selectedConversation } = useConversation();

  const [notifications, setNotifications] = useState<Notifications>({});

  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  const { globalData } = useGlobalDataContext();

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `${globalData.link}/message/unread`,
          {
            //withCredentials: true,
            headers: {
              Authorization: `Bearer ${userAuth.userAuthToken}`,
            },
          }
        );

        setUnreadMessages(response.data.unreadMessagesCount);
      } catch (error) {
        console.error("Error al obtener los mensajes no leídos", error);
      }
    };

    fetchUnreadMessages();

    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      const senderId = newMessage.senderId._id || newMessage.senderId

      // check if message belongs to current open conversation
      const isCurrentConversation = selectedConversation && (
        selectedConversation._id === newMessage.conversationId ||
        selectedConversation.members?.some((m: any) => m._id === senderId)
      )

      if (isCurrentConversation) {
        setMessage([...messages, newMessage])
      } else {
        setNotifications((prev) => ({
          ...prev,
          [senderId.toString()]: (prev[senderId.toString()] || 0) + 1,
        }))
        setUnreadMessages((prev) => prev + 1)
      }
    }

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [
    socket,
    messages,
    selectedConversation,
    setMessage,
    setAllUsers,
    userAuth?.userAuthToken,
    globalData.link,
  ]);

  return { notifications, setNotifications, unreadMessages };
};

export default useGetSocketMessage;