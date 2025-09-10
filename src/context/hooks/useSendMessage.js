import { useState } from "react";
import { useAuth } from "../UserAuthContex";
import { useSocketContext } from "../SocketContext";
import useConversation from "./useConversation";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";


// custom hook to send messages
const useSendMessage = () => {

  // Tracks whether messages are currently being fetched for UI feedback
  const [loading, setLoading] = useState(false);

  const { allUsers, addUser, prependUser, userAuth } = useAuth();

  const { socket } = useSocketContext();

  const { globalData } = useGlobalDataContext();

  // state zustand
  const { messages, setMessage, selectedConversation } = useConversation();

  // function to send messages

  // *******************************************
  // SE ENCARGA DE ENVIAR LOS MENSAJES NUEVOS
  // *******************************************
  const sendMessages = async (message) => {

    setLoading(true);
    try {
      const res = await axios.post(
        `${globalData.link}/message/send/${selectedConversation._id}`,
        { message },
        {
          headers: {
            Authorization: `Bearer ${userAuth.userAuthToken}`,
          },
        });

      // set new message to conversation
      setMessage([...messages, res.data]);

      /// estaba mal esto
      // if (socket) {
      //   socket.emit("sendMessage", {
      //     senderId: res.data.senderId,
      //     receiverId: res.data.receiverId,
      //     message: res.data.message,
      //     conversationId: res.data.conversationId,
      //   });
      // }

      setLoading(false);
    } catch (error) {
      console.log("Error in send messages", error);
      setLoading(false);
    }
  };
  return { loading, sendMessages };
};

export default useSendMessage;
