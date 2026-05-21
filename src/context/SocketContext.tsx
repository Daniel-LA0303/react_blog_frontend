import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./UserAuthContex";
import { io, Socket } from "socket.io-client";

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

type Props = {
  children: ReactNode;
};

export const SocketProvider = ({ children }: Props) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const { userAuth } = useAuth();

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userAuth?.userId) return;

    if (!socketRef.current) {
      socketRef.current = io(
        import.meta.env.VITE_API_URL_BACKEND_SOCKET as string,
        {
          query: { userId: userAuth.userId },
        }
      );

      socketRef.current.on("initialOnlineUsers", (users: string[]) => {
        setOnlineUsers(users);
      });

      socketRef.current.on("userOnline", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => [...new Set([...prev, userId])]);
      });

      socketRef.current.on("userOffline", ({ userId }: { userId: string }) => {
        setOnlineUsers((prev) => prev.filter((u) => u !== userId));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userAuth?.userId]);

  return (
    <socketContext.Provider
      value={{ socket: socketRef.current, onlineUsers }}
    >
      {children}
    </socketContext.Provider>
  );
};