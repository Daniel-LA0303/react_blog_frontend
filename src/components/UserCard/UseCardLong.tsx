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
import { motion, AnimatePresence } from "framer-motion";
import UIButton from "../Global/UIButton";

const UserCardLong = ({ user }: any) => {
    const navigate = useNavigate();

    const [isFollow, setIsFollow] = useState(false);

    const { userAuth } = userUserAuthContext();
    const { showConfirmSwal } = useSwal();
    const { globalData } = useGlobalDataContext();
    const { selectedConversation, setSelectedConversation } = useConversation();

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
                cancelButton: false,
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
                cancelButton: false,
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
                            {isFollow ?
                                <UIButton dark={!isLight} variant="accent" onClick={handleClickUnFollow} size="small">Following</UIButton>
                                :
                                <UIButton dark={!isLight} variant="primary" onClick={handleClickFollow} size="small">Follow</UIButton>
                            }

                        </AnimatePresence>

                        {/* Message */}
                        <UIButton dark={!isLight} variant="secondary" onClick={handleClickChat} size="small">Message</UIButton>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserCardLong;