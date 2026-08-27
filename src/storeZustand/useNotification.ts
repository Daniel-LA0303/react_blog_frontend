import { create } from "zustand";

export type Notification = any; // replace later with real backend type

type NotificationStore = {
    notifications: Notification[];
    setNotifications: (notifications: Notification[]) => void;
    addNotification: (notification: Notification) => void;
};

const useNotification = create<NotificationStore>((set, get) => ({
    notifications: [],
    setNotifications: (notifications) => set({ notifications }),
    addNotification: (notification) => 
        set((state) => ({ notifications: [notification, ...state.notifications] })),

}));

export default useNotification;