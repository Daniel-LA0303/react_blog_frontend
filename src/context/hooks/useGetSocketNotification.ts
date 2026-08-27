import { useEffect, useState } from "react";
import { useSocketContext } from "../SocketContext";
import { useAuth } from "../UserAuthContex";
import useGlobalDataContext from "./useGlobalDataContext";
import { Socket } from "socket.io-client";
import useNotification from "../../storeZustand/useNotification";
import { NotificationI } from "../../interfaces/notification.interface";

type Notifications = Record<string, number>;

const useGetSocketNotification = () => {
    const { socket } = useSocketContext() as { socket: Socket | null };

    const { setAllUsers, userAuth } = useAuth();

    const { notifications, setNotifications,addNotification } = useNotification();

    const { globalData } = useGlobalDataContext();

    useEffect(() => {

        if (!socket) return;

        const handleNotification = (newNotification: NotificationI) => {
            
            addNotification(newNotification);
        };

        socket.on("newNotification", handleNotification);

        return () => {
            socket.off("newNotification", handleNotification);
        };
    }, [
        socket,
        setAllUsers,
        userAuth?.userAuthToken,
        globalData.link,
    ]);

    return { notifications, setNotifications };
};

export default useGetSocketNotification;