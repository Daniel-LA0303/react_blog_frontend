import { useEffect, useState } from "react";
import userUserAuthContext from "../../context/hooks/useUserAuthContext";
import { useSwal } from "../../hooks/useSwal";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";


const UserCardLong = ({ user }) => {
    /**
     * states
     */
    const [isFollow, setIsFollow] = useState(false);

    /**
     * hooks
     */
    const { userAuth } = userUserAuthContext();
    const { showConfirmSwal } = useSwal();

    /**
     * states Redux
     */
    const theme = useSelector((state) => state.posts.themeW);

    /**
     * useEffect
     */
    useEffect(() => {        
        const userProfileFound = user.followersUsers.followers.includes(
            userAuth.userId
        );
        if (userProfileFound) {
            setIsFollow(true);
        }
    }, [userAuth, user]);

    /**
     * functions
     */
    const handleClickUnFollow = async () => {
        try {
            await clientAuthAxios.post(
                `/users/user-unfollow/${userAuth.userId}?userUnfollow=${user._id}`
            );
            setIsFollow(false);
        } catch (error) {
            console.log(error);
            showConfirmSwal({
                message: error.response.data.message,
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
        } catch (error) {
            console.log(error);
            showConfirmSwal({
                message: error.response.data.message,
                status: "error",
                confirmButton: true,
            });
        }
    };

    return (
        <div
className={`
          ${theme
        ? " bgt-light text-black"
        : "bgt-dark hover:bg-zinc-700 text-white"
      }
          w-full overflow-hidden rounded-xl shadow-lg`}
        >
            <div className="flex gap-6 p-8 flex-row flex-wrap justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link
                        to={`/profile/${user._id}`}
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 shrink-0"
                        style={{
                            backgroundImage: `url("${user?.profilePicture.secure_url || "/avatar.png"
                                }")`,
                        }}
                    ></Link>
                    <div className="flex flex-col justify-center">
                        <Link 
                            to={`/profile/${user._id}`}
                            className="text-slate-900 dark:text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
                            {user.name}
                        </Link>
                        <Link
                            to={`/profile/${user._id}`}
                            className="text-slate-500 dark:text-gray-300 text-base font-normal mt-1">
                            {user.email}
                        </Link>
                        <div className="flex items-center gap-4 mt-3 text-slate-500 dark:text-gray-300 text-sm">
                            <div>
                                <span className="font-semibold text-slate-700 dark:text-white">
                                    {user.followersUsers.conutFollowers || 0}
                                </span>{" "}
                                Followers
                            </div>
                            <div className="h-4 border-l border-slate-200 dark:border-gray-500"></div>
                            <div>
                                <span className="font-semibold text-slate-700 dark:text-white">
                                    {user.followedUsers.conutFollowed || 0}
                                </span>{" "}
                                Following
                            </div>
                            <div className="h-4 border-l border-slate-200 dark:border-gray-500"></div>
                            <div>
                                <span className="font-semibold text-slate-700 dark:text-white">
                                    {user.posts.length || 0}
                                </span>{" "}
                                Posts
                            </div>
                        </div>
                    </div>
                </div>
                {userAuth?.userId && user._id !== userAuth.userId && (
                    <button
                        type="button"
                        onClick={isFollow ? handleClickUnFollow : handleClickFollow}
                        className={`flex  cursor-pointer items-center justify-center overflow-hidden rounded-md h-10 px-5 text-sm font-bold transition-colors w-32 @[480px]:w-auto ${theme
                                ? isFollow
                                    ? "bg-gray-200 text-black hover:bg-gray-300"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                                : isFollow
                                    ? "bg-gray-700 text-white hover:bg-gray-600"
                                    : "bg-blue-600 text-white hover:bg-blue-700"
                            }`}
                    >
                        <span className="truncate">{isFollow ? "Following" : "Follow"}</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCardLong;
