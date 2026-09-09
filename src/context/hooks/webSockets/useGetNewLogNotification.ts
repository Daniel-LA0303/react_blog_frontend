import { Socket } from "socket.io-client";
import { useSocketContext } from "../../SocketContext";
import { useAuth } from "../../UserAuthContex";
import useGlobalDataContext from "../useGlobalDataContext";
import { useEffect, useState } from "react";


const useGetSocketNewLogNotification = () => {

    const { socket } = useSocketContext() as { socket: Socket | null };
    const { setAllUsers, userAuth } = useAuth();
    const { globalData } = useGlobalDataContext();

    const [newLog, setNewLog] = useState<any>();

    useEffect(() => {

        if (!socket) return;

        const handleNewLogNotification = (data: any) => {
            console.log("new log received:", data);
            setNewLog(data); // 👈 esto faltaba
        };

        socket.on("newLog", handleNewLogNotification);

        return () => {
            socket.off("newLog", handleNewLogNotification);
        };
    }, [
        socket,
        userAuth?.userAuthToken,
        globalData.link,
    ]);

    return { newLog };
};

export default useGetSocketNewLogNotification;