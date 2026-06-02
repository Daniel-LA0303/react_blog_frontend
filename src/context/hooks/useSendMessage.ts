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
  const { messages, setMessage, selectedConversation, setConversations, setSelectedConversation, conversations } = useConversation();

  // function to send messages

  // *******************************************
  // SE ENCARGA DE ENVIAR LOS MENSAJES NUEVOS
  // *******************************************
  const sendMessages = async (message: any) => {
    setLoading(true)
    try {
      const receiverId = selectedConversation.members
        ? selectedConversation.members.find((m: any) => m._id !== userAuth.userId)?._id
        : selectedConversation._id

      const res = await axios.post(
        `${globalData.link}/message/send/${receiverId}`,
        { message },
        { headers: { Authorization: `Bearer ${userAuth.userAuthToken}` } }
      )

      setMessage([...messages, res.data])

      // if temp, replace with real conversation
      if (selectedConversation.isTemp) {
        const realConv = {
          ...selectedConversation,
          _id: res.data.conversationId,
          isTemp: false
        }
        setSelectedConversation(realConv)
      }
      const convId = selectedConversation.isTemp
        ? res.data.conversationId
        : selectedConversation._id

      const updatedConversations = conversations.map((c: any) =>
        c._id === convId
          ? { ...c, lastMessage: { message: res.data.message, createdAt: res.data.createdAt } }
          : c
      )
      setConversations(updatedConversations)
    } catch (error) {
      console.log('Error in send messages', error)
    } finally {
      setLoading(false)
    }
  }
  return { loading, sendMessages };
};

export default useSendMessage;
