import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "./UserAuthContex";
import { io, Socket } from "socket.io-client";
import { setSocket } from "../services/socketRef";

type SocketContextType = {
  socket: Socket | null;
  onlineUsers: string[];
};

const socketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocketContext = () => {
  const context = useContext(socketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocketState] = useState<Socket | null>(null); // estado, no ref

  const { userAuth } = useAuth();

  useEffect(() => {
    if (!userAuth?.userId) return;

    const s = io(import.meta.env.VITE_API_URL_BACKEND_SOCKET as string, {
      query: { userId: userAuth.userId },
    });

    s.on("initialOnlineUsers", (users: string[]) => setOnlineUsers(users));
    s.on("userOnline", ({ userId }: { userId: string }) =>
      setOnlineUsers((prev) => [...new Set([...prev, userId])])
    );
    s.on("userOffline", ({ userId }: { userId: string }) =>
      setOnlineUsers((prev) => prev.filter((u) => u !== userId))
    );

    setSocketState(s); // para React (useProjectSocket)
    setSocket(s);      // para axios (interceptor)

    return () => {
      s.disconnect();
      setSocketState(null);
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [userAuth?.userId]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};