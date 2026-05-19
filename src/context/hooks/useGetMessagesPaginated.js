import { useState } from "react";
import useConversation from "./useConversation";
import { useAuth } from "../UserAuthContex";
import useGlobalDataContext from "./useGlobalDataContext";
import axios from "axios";


export const useGetMessagesPaginated = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessage, selectedConversation } = useConversation();
  const { userAuth } = useAuth();
  const { globalData } = useGlobalDataContext();
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = async () => {
    if (loading || !hasMore || !selectedConversation) return;
    setLoading(true);

    try {
      const res = await axios.get(
        `${globalData.link}/message/get/${selectedConversation._id}`,
        {
          params: { page, limit: 20 },
          headers: { Authorization: `Bearer ${userAuth.userAuthToken}` },
        }
      );

      console.log("**************************");
      
      console.log(res.data);
      

      if (res.data.data.length > 0) {
        setMessage(prev => [...res.data.data, ...prev]); // agregamos al inicio
        setPage(page + 1);
        setHasMore(page < res.data.meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, messages, fetchMessages, hasMore };
};
