import { Socket } from "socket.io-client";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import useGlobalDataContext from "./useGlobalDataContext";
import { useEffect, useState } from "react";


const useGetSocketBannedNotification = () => {
    
    const { socket } = useSocketContext() as { socket: Socket | null };

    const { setAllUsers, userAuth } = useAuth();

    const { globalData } = useGlobalDataContext();

    const [bannedMessage, setMessage] = useState<string>();

    useEffect(() => {

        if (!socket) return;

        const handleBannedNotification = (data: { message: string }) => {
            
            console.log("msg: " + data);
            setMessage(data.message);
        };

        socket.on("closeSession", handleBannedNotification);

        return () => {
            socket.off("closeSession", handleBannedNotification);
        };
    }, [
        socket,
        userAuth?.userAuthToken,
        globalData.link,
    ]);

    return { bannedMessage };
};

export default useGetSocketBannedNotification;