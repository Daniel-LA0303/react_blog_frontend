import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import useConversation from "../../../context/hooks/useConversation";
import useGlobalDataContext from "../../../context/hooks/useGlobalDataContext";
import { useAuth } from "../../../context/UserAuthContex";
import { CircularProgress } from '@mui/material';
import axios from "axios";


function Messages() {

const {
    selectedConversation,
    messages,
    setMessage,
    messagePage,
    setMessagePage,
    hasMoreMessages,
    setHasMoreMessages,
    prependMessages
  } = useConversation();
  
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const messagesEndRef = useRef<any>(null);
  const messagesContainerRef = useRef<any>(null);
  const { globalData } = useGlobalDataContext();
  const { userAuth } = useAuth();

  // Obtener mensajes iniciales (los más recientes)
  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;
      
      setLoading(true);
      setMessagePage(1);
      setHasMoreMessages(true);

      try {
        const res = await axios.get(
          `${globalData.link}/message/get/${selectedConversation._id}?page=1&limit=20`,
          {
            //withCredentials: true,
            headers: {
              Authorization: `Bearer ${userAuth.userAuthToken}`,
            },
          }
        );
        
        // INVERTIR el orden: los más recientes deben estar al final
        const reversedMessages = res.data.messages.reverse();
        setMessage(reversedMessages);
        setHasMoreMessages(res.data.meta.page < res.data.meta.totalPages);
      } catch (error) {
        console.log("Error in getting messages", error);
      } finally {
        setLoading(false);
      }
    };
    
    getMessages();
  }, [selectedConversation, setMessage, setMessagePage, setHasMoreMessages]);

  // Auto scroll al último mensaje (el más reciente) - CORREGIDO
  useEffect(() => {
    // Scroll al final cuando se cargan los mensajes iniciales
    if (messages.length > 0 && messagePage === 1) {
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [messages, messagePage]);

  // Scroll al final cuando cambia la conversación
  useEffect(() => {
    if (selectedConversation && messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }, 100);
    }
  }, [selectedConversation]);

  // Cargar mensajes más antiguos
  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreMessages || !selectedConversation?._id) return;
    
    setLoadingMore(true);
    
    try {
      const nextPage = messagePage + 1;
      const res = await axios.get(
        `${globalData.link}/message/get/${selectedConversation._id}?page=${nextPage}&limit=20`,
        {
          //withCredentials: true,
          headers: {
            Authorization: `Bearer ${userAuth.userAuthToken}`,
          },
        }
      );
      
      if (res.data.messages && res.data.messages.length > 0) {
        // Guardar posición de scroll antes de agregar nuevos mensajes
        const container = messagesContainerRef.current;
        const oldScrollHeight = container.scrollHeight;
        
        // INVERTIR el orden y agregar al PRINCIPIO (mensajes más antiguos)
        const reversedMessages = res.data.messages.reverse();
        prependMessages(reversedMessages);
        
        // Mantener la posición de scroll después de cargar más mensajes
        setTimeout(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - oldScrollHeight;
        }, 0);
        
        setMessagePage(nextPage);
        setHasMoreMessages(nextPage < res.data.meta.totalPages);
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.log("Error loading more messages", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto"
    >
      {loading ? (
        <div className="flex justify-center items-center h-auto">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Botón para cargar mensajes más antiguos (arriba de todo) */}
          {hasMoreMessages && (
            <div className="flex justify-center p-2 sticky top-0 z-10 bg-opacity-90">
              <button 
                onClick={handleLoadMore}
                disabled={loadingMore}
                className={`px-4 py-1 md:py-2 ${loadingMore ? '' : 'bg-blue-500'} text-white rounded-md disabled:opacity-50`}
              >
                {loadingMore ?  <CircularProgress size={50} /> : 'Load Older Messages'}
              </button>
            </div>
          )}
          
          {messages.length > 0 ? (
            <div>
              {messages.map((message) => (
                <div key={message._id}>
                  <Message message={message} />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-center text-slate-500">
                Say! Hi to start the conversation
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Messages;
