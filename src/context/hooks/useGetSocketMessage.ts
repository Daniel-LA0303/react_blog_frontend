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
      if (
        selectedConversation &&
        newMessage.senderId._id.toString() ===
          selectedConversation._id.toString()
      ) {
        setMessage([...messages, newMessage]);
      } else {
        const sender = newMessage.senderId;
        const senderId = sender._id || sender;

        setAllUsers((prev) => {
          const normalizedSender =
            typeof newMessage.senderId === "object"
              ? {
                  _id: newMessage.senderId._id,
                  fullname: newMessage.senderId.fullname,
                  email: newMessage.senderId.email,
                }
              : { _id: newMessage.senderId };

          const exists = prev.find((u) => u._id === normalizedSender._id);

          if (exists) {
            const merged = { ...exists, ...normalizedSender };
            return [
              merged,
              ...prev.filter((u) => u._id !== normalizedSender._id),
            ];
          } else {
            return [normalizedSender, ...prev];
          }
        });

        setNotifications((prev) => ({
          ...prev,
          [senderId.toString()]: (prev[senderId.toString()] || 0) + 1,
        }));

        setUnreadMessages((prev) => prev + 1);
      }
    };

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