import { useEffect, useState } from "react";
/**
 * route
 */
import { Link, useNavigate } from "react-router-dom";
/**
 * hooks
 */
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";
import userUserAuthContext from "../../context/hooks/useUserAuthContext";
import { useSwal } from "../../hooks/useSwal";
import clientAuthAxios from "../../services/clientAuthAxios";
import useConversation from "../../context/hooks/useConversation";
import useGetAllUsers from "../../context/hooks/useGetAllUsers";
import { motion, AnimatePresence } from "framer-motion";

const UserCardLong = ({ user }: any) => {
    const navigate = useNavigate();

    const [isFollow, setIsFollow] = useState(false);

    const { userAuth } = userUserAuthContext();
    const { showConfirmSwal } = useSwal();
    const { globalData } = useGlobalDataContext();
    const { selectedConversation, setSelectedConversation } = useConversation();
    const [allUsers, loading, addUser, prependUser] = useGetAllUsers();

    const isLight = globalData.themeGlobal;

    useEffect(() => {
        const userProfileFound = user.followersUsers.followers.includes(
            userAuth.userId
        );
        if (userProfileFound) setIsFollow(true);
    }, [userAuth, user]);

    const handleClickUnFollow = async () => {
        try {
            await clientAuthAxios.post(
                `/users/user-unfollow/${userAuth.userId}?userUnfollow=${user._id}`
            );
            setIsFollow(false);
        } catch (error: any) {
            showConfirmSwal({
                message: error?.response?.data?.message || "Error in unfollow User",
                status: "error",
                confirmButton: true,
            });
        }
    };

    const handleClickFollow = async () => {
        try {
            await clientAuthAxios.post(
                `/users/user-follow/${userAuth.userId}?userFollow=${user._id}`
            );
            setIsFollow(true);
        } catch (error: any) {
            showConfirmSwal({
                message: error?.response?.data?.message || "Error in follow User",
                status: "error",
                confirmButton: true,
            });
        }
    };

    const handleClickChat = () => {
        const userChat = {
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
        };
        setSelectedConversation(userChat);
        prependUser(userChat);
        navigate(`/chat/${user._id}`);
    };

    const stats = [
        { label: "Followers", value: user.followersUsers.conutFollowers || 0 },
        { label: "Following", value: user.followedUsers.conutFollowed || 0 },
        { label: "Posts", value: user.posts.length || 0 },
    ];

    return (
        <div
            className={`
                w-full rounded-2xl overflow-hidden transition-all duration-200
                ${isLight
                    ? "bg-white border border-gray-100 shadow-sm hover:shadow-md text-gray-900"
                    : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600 text-white"
                }
            `}
        >
            <div className="p-5 md:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">

                {/* Left: Avatar + Info */}
                <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <Link
                        to={`/profile/${user._id}`}
                        className="shrink-0 relative block"
                    >
                        <div
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-center bg-cover bg-no-repeat ring-2 ring-offset-2 transition-all
                                hover:ring-blue-500
                                ring-transparent
                            "
                            style={{
                                backgroundImage: `url("${user?.profilePicture?.secure_url || "/avatar.png"}")`
                            }}
                            aria-label={`${user.name}'s profile picture`}
                        />
                        {/* Online indicator (optional visual touch) */}
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-800" />
                    </Link>

                    {/* Text info */}
                    <div className="min-w-0 flex flex-col gap-0.5">
                        <Link
                            to={`/profile/${user._id}`}
                            className={`text-base sm:text-lg font-semibold leading-tight truncate hover:underline underline-offset-2
                                ${isLight ? "text-gray-900" : "text-zinc-100"}
                            `}
                        >
                            {user.name}
                        </Link>
                        <Link
                            to={`/profile/${user._id}`}
                            className={`text-xs sm:text-sm truncate
                                ${isLight ? "text-gray-500 hover:text-gray-700" : "text-zinc-400 hover:text-zinc-300"}
                            `}
                        >
                            {user.email}
                        </Link>

                        {/* Stats row */}
                        <div className="flex items-center gap-3 mt-2">
                            {stats.map((stat, i) => (
                                <span key={stat.label} className="flex items-center gap-2">
                                    <span className="text-xs font-medium">
                                        <span className={`font-bold ${isLight ? "text-gray-900" : "text-zinc-100"}`}>
                                            {stat.value.toLocaleString()}
                                        </span>
                                        {" "}
                                        <span className={isLight ? "text-gray-400" : "text-zinc-500"}>
                                            {stat.label}
                                        </span>
                                    </span>
                                    {i < stats.length - 1 && (
                                        <span className={`h-3 w-px ${isLight ? "bg-gray-200" : "bg-zinc-600"}`} />
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Action buttons */}
                {userAuth?.userId && user._id !== userAuth.userId && (
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        {/* Follow / Unfollow */}
                        <AnimatePresence mode="wait" initial={false}>
                            {isFollow ? (
                                <motion.button
                                    key="following"
                                    type="button"
                                    onClick={handleClickUnFollow}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`flex-1 sm:flex-none rounded-xl px-5 py-2 text-xs font-medium border transition-colors
                                        ${isLight
                                            ? "bg-gray-100 border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                                            : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-red-900/30 hover:border-red-800 hover:text-red-400"
                                        }`}
                                >
                                    ✓ Following
                                </motion.button>
                            ) : (
                                <motion.button
                                    key="follow"
                                    type="button"
                                    onClick={handleClickFollow}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex-1 sm:flex-none rounded-xl px-5 py-2 text-xs font-semibold text-white transition-colors"
                                    style={{ backgroundColor: "#2563EB" }}
                                    onMouseEnter={(e: any) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
                                    onMouseLeave={(e: any) => (e.currentTarget.style.backgroundColor = "#2563EB")}
                                >
                                    Follow
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Message */}
                        <motion.button
                            type="button"
                            onClick={handleClickChat}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 sm:flex-none rounded-xl px-5 py-2 text-xs font-medium border transition-colors
                                ${isLight
                                    ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    : "border-gray-700 text-gray-300 hover:bg-gray-800"
                                }`}
                        >
                            Message
                        </motion.button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCardLong;