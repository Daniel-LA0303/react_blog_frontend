import { useEffect, useState } from "react";
import NotificationCard from "../../components/Notifications/NotificationCard";
import Sidebar from "../../components/Sidebar/Sidebar";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import { useAuth } from "../../context/UserAuthContex";
import clientAuthAxios from "../../services/clientAuthAxios";
import { NotificationI } from "../../interfaces/notification.interface";
import axios from "axios";
import { useParams } from "react-router-dom";
import Spinner from "../../components/Spinner/Spinner";

import { AnimatePresence, motion } from 'framer-motion'

const LoadingSpinner = () => (
  <div className="flex justify-center py-10">
    <motion.div
      className="h-20 w-20 rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-600 dark:border-t-gray-200"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);


const Notifications = () => {

  const params = useParams();
  const { userAuth } = useAuth();
  const { globalData } = useGlobalDataContext();
  const [loading, setLoading] = useState(false);
  const [loadingNotificationId, setLoadingNotificationId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationI[]>([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;

  useEffect(() => {
    setNotifications([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!loading && hasMore && window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight) {
        fetchPosts();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page]);

  const fetchPosts = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await clientAuthAxios
        .get(`notifications/get-notifications-by-user-paginated/${userAuth.userId}?page=${pageToFetch}&limit=${limit}`
        );
      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setNotifications((prev) => [...prev, ...data]);
        setPage(pageToFetch + 1);
        setHasMore(pageToFetch < meta.totalPages);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const changeStatus = async (notificationId: string) => {
    try {
      setLoadingNotificationId(notificationId);
      await clientAuthAxios.post(`notifications/change-status/${notificationId}`);
      setNotifications((prev) =>
        prev.map(n => n._id === notificationId ? { ...n, isRead: !n.isRead } : n)
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingNotificationId(null);
    }
  }

  if (loading && notifications.length === 0) return <Spinner />

  return (
    <div>
      <Sidebar />

      <div className="w-full max-w-3xl mx-auto px-4">
        <h1 className={`text-2xl font-bold mb-6 ${!globalData.themeGlobal ? "text-white" : "text-black"}`}>
          Notifications
        </h1>

        <div className="flex flex-col gap-3">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              changeStatus={changeStatus}
              loadingNotificationId={loadingNotificationId}
            />
          ))}

          <AnimatePresence>
            {loading && notifications.length > 0 && (
              <motion.div
                key="spinner"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LoadingSpinner />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Notifications;