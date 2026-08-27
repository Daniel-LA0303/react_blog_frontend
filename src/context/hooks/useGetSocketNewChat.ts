import { Socket } from "socket.io-client";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import { useEffect } from "react";
import useGlobalDataContext from "./useGlobalDataContext";
import useConversation from "./useConversation";
import { ConversationI } from "../../interfaces/message.interfaces";

const useGetSocketNewChat = () => {
    const { socket } = useSocketContext() as { socket: Socket | null };

    const { setAllUsers, userAuth } = useAuth();

    const { conversations, setConversations, prependConversation } = useConversation();

    const { globalData } = useGlobalDataContext();

    useEffect(() => {

        if (!socket) return;

        const handleChat = (newChat: ConversationI) => {
            
            prependConversation(newChat);
        };

        socket.on("newConversation", handleChat);

        return () => {
            socket.off("newConversation", handleChat);
        };
    }, [
        socket,
        setAllUsers,
        userAuth?.userAuthToken,
        globalData.link,
    ]);

    return { conversations, setConversations };
};

export default useGetSocketNewChat;