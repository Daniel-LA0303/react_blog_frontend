import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./UserAuthContex";
import { io } from "socket.io-client";
import useGlobalDataContext from "./hooks/useGlobalDataContext";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {

  // socket
  const [socket, setSocket] = useState(null);

  // users online
  const [onlineUsers, setOnlineUsers] = useState([]);

  // auth user
  const { userAuth } = useAuth();

  const { globalData } = useGlobalDataContext();

  const socketRef = useRef(null);

  useEffect(() => {
    if (!userAuth?.userId) return;

    // just once create the socket connection
    if (!socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL_BACKEND_SOCKET, {
        query: { userId: userAuth.userId },
      });

      // Initial user list
      socketRef.current.on("initialOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      // User connects
      socketRef.current.on("userOnline", ({ userId }) => {
        setOnlineUsers((prev) => [...new Set([...prev, userId])]);
      });

      // User disconnects
      socketRef.current.on("userOffline", ({ userId }) => {
        setOnlineUsers((prev) => prev.filter((u) => u !== userId));
      });
    }

    // Cleanup when the provider unmounts (e.g. close tab or logout)
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userAuth?.userId]);



  return (
    <socketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
