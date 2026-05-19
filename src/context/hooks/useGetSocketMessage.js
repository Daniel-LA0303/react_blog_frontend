import { useEffect, useState } from "react";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import useConversation from "./useConversation";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";


// custom hook to get messages from socket and handle notifications
const useGetSocketMessage = () => {

  // socket 
  const { socket } = useSocketContext();

  const { setAllUsers, userAuth } = useAuth();

  // context zustand
  const { messages, setMessage, selectedConversation } = useConversation();

  // notifications by user
  const [notifications, setNotifications] = useState({});

  // count messages that it have been readed
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { globalData } = useGlobalDataContext();

  // get messages unread
  useEffect(() => {
    const fetchUnreadMessages = async () => {

      try {
        const response = await axios.get(`${globalData.link}/message/unread`, {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${userAuth.userAuthToken}`,
          },
        });
        // console.log("mesnajes no leidos", response);

        setUnreadMessages(response.data.unreadMessagesCount);
      } catch (error) {
        console.error("Error al obtener los mensajes no leídos", error);
      }
    };

    fetchUnreadMessages();


    // *******************************************
    // SE ENCARGA DE ESCUCHAR LOS MENSAJES NUEVOS
    // *******************************************
    // Listen for new incoming messages via socket
    socket.on("newMessage", (newMessage) => {
      // Play notification sound
      //   const notification = new Audio(sound);
      //   notification.play();

      // If message belongs to current conversation, add to messages
      if (selectedConversation &&
        newMessage.senderId._id.toString() === selectedConversation._id.toString()) {
        setMessage([...messages, newMessage]);

        console.log("NO PINTA NOTIFICACIONES");

      } else {
        // If message is from another conversation, increment notifications

        console.log("PINTA NOTIFICACIONES");

        const sender = newMessage.senderId; // viene como objeto {_id, fullname, email...}
        const senderId = sender._id || sender;

        // 1. Moverlo arriba si ya existe o agregarlo si no existe
        setAllUsers((prev) => {
          // Normalizamos: si senderId es objeto tomamos su _id, si no es objeto usamos el valor directo
          const sender = typeof newMessage.senderId === "object"
            ? {
              _id: newMessage.senderId._id,
              fullname: newMessage.senderId.fullname,
              email: newMessage.senderId.email,
            }
            : { _id: newMessage.senderId };

          const exists = prev.find((u) => u._id === sender._id);

          if (exists) {
            // moverlo al inicio
            const merged = { ...exists, ...sender }; // mergea datos por si hay fullname/email nuevos
            return [merged, ...prev.filter((u) => u._id !== sender._id)];
          } else {
            // crear conversación nueva y ponerla arriba
            return [sender, ...prev];
          }
        });

        // 2. Incrementar notificaciones para ese usuario
        setNotifications((prev) => ({
          ...prev,
          [senderId.toString()]: (prev[senderId.toString()] || 0) + 1,
        }));

        // Increment total unread messages count
        setUnreadMessages((prev) => prev + 1);
      }
    });

    // Cleanup: remove socket listener on unmount
    return () => {
      socket.off("newMessage");
    };

  }, [socket, messages, selectedConversation, setMessage]);

  /**
   * functions
   */

  // Handle selecting a conversation and resetting its notifications
  // const handleSelectConversation = (user) => {

  //   setSelectedConversation(user);

  //   if (socket) {
  //     socket.emit("joinRoom", { conversationId: user._id });
  //   }


  //   // Reset notifications for this user
  //   setNotifications((prev) => ({
  //     ...prev,
  //     [user._id]: 0,
  //   }));
  //   // Reset unread messages count
  //   setUnreadMessages(0);
  // };



  return { notifications, setNotifications, unreadMessages };
};

export default useGetSocketMessage;

