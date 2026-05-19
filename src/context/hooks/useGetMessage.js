import { useEffect, useState } from "react";
import useConversation from "./useConversation";
import { useAuth } from "../UserAuthContex";
import axios from "axios";
import useGlobalDataContext from "./useGlobalDataContext";


// custom hook to get messages for the selected conversation
const useGetMessage = () => {

  // Tracks whether messages are currently being fetched for UI feedback
  const [loading, setLoading] = useState(false);

  // state zustand
  const { messages, setMessage, selectedConversation } = useConversation();
  const { globalData } = useGlobalDataContext();

  const { userAuth } = useAuth();

  // useEffect to get mesages
  useEffect(() => {

    const getMessages = async () => {

      setLoading(true);

      // Check if selectedConversation exists and has an _id
      if (selectedConversation && selectedConversation._id) {

        // we get the messages for the selected conversation
        try {
          const res = await axios.get(
            `${globalData.link}/message/get/${selectedConversation._id}`,
            {
              credentials: "include",
              headers: {
                Authorization: `Bearer ${userAuth.userAuthToken}`,
              },
            });

          // set messages
          setMessage(res.data);
          setLoading(false);
        } catch (error) {
          console.log("Error in getting messages", error);
          setLoading(false);
        }
      }
    };
    getMessages();

  }, [selectedConversation, setMessage]);


  return { loading, messages };
};

export default useGetMessage;
