import { useEffect, useState } from "react";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import useConversation from "./useConversation";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";
import { Socket } from "socket.io-client";
import { NewMessageFromSocketI } from "../../interfaces/message.interfaces";

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

    const handleNewMessage = (newMessage: NewMessageFromSocketI) => {

      console.log("new message from socket: ", newMessage);
      console.log("selected conversation id: ", selectedConversation._id.toString());
      
      // TODO: this is wrong, we use user id as -> /chat/68af8251c9d1f9e8fcfec0a2
      // we need to use conversationId not senderId._id

      if (
        selectedConversation &&
        newMessage.senderId._id.toString() ===
          selectedConversation._id.toString()
      ) {
        // we update messages UI
        setMessage([...messages, newMessage]);
      } else {

        // update UI to go up ui to the top
        const sender = newMessage.senderId;
        const senderId = sender._id || sender;

        setAllUsers((prev) => {
          const normalizedSender =
            typeof newMessage.senderId === "object"
              ? {
                  _id: newMessage.senderId._id,
                  fullname: newMessage.senderId.name,
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