import { useEffect, useState } from "react";

/**
 * hooks
 */
import { useSwal } from "../../hooks/useSwal";

/**
 * route 
 */
import { Link } from "react-router-dom";

/**
 * services
 */
import clientAuthAxios from "../../services/clientAuthAxios";
import useGlobalDataContext from "../../context/hooks/useGlobalDataContext";

const CardCategoryDashboard = ({ category, userAuth }) => {

  /**
   * hooks
   */
  const { globalData } = useGlobalDataContext();

  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * hooks
   */
  const { showConfirmSwal } = useSwal();

  /**
   * useEffect
   */
  useEffect(() => {

    const userInCat = category.follows.users.includes(userAuth.userId);
    if (userInCat) setIsFollow(true);
  }, [userAuth, category]);

  /**
   * functions
   */
  const handleFollowTag = async () => {
    try {
      await clientAuthAxios.post(
        `/users/follow-tag/${userAuth.userId}?categoryId=${category._id}`
      );
      setIsFollow(true);
    } catch (error) {
      showConfirmSwal({
        message: error.response?.data?.message || error.message,
        status: "error",
        confirmButton: true,
      });
    }
  };

  const handleUnFollowTag = async () => {
    try {
      await clientAuthAxios.post(
        `/users/unfollow-tag/${userAuth.userId}?categoryId=${category._id}`
      );
      setIsFollow(false);
    } catch (error) {
      showConfirmSwal({
        message: error.response?.data?.message || error.message,
        status: "error",
        confirmButton: true,
      });
    }
  };

  /**
   * render
   */
  return (
    <div
      className={`group w-full mb-5 mx-auto rounded-2xl overflow-hidden shadow-sm flex ${globalData.themeGlobal ? "bg-white" : "bgt-dark text-white"
        }`}
    >
      {/* Color side */}
      <div
        className={`w-8 transition-all duration-300 ease-in-out group-hover:w-12`}
        style={{ backgroundColor: category.color }}
      ></div>

      {/* Content */}
      <div className="flex-1 flex justify-between items-center p-6">
        {/* Textual content */}
        <div className="flex flex-col gap-4">
          <Link
            to={`/category/${category.name}`}
            className={`text-2xl font-bold ${globalData.themeGlobal ? "text-gray-800" : "text-white"
              }`}
          >
            {category.name}
          </Link>
          <p className={`max-w-md ${globalData.themeGlobal ? "text-gray-500" : "text-gray-300"}`}>
            {category.desc}
          </p>

          <p className={`max-w-md ${globalData.themeGlobal ? "text-gray-500" : "text-gray-300"} text-sm`}>
            Followers {''}
            {category.follows.countFollows}
          </p>

          {userAuth?.userId && (
            <button
              onClick={isFollow ? handleUnFollowTag : handleFollowTag}
              className={`flex items-center justify-center w-fit px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 
                ${isFollow
                  ? globalData.themeGlobal
                    ? "bg-gray-200 text-black hover:bg-gray-300"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                  : `bg-gray-500 text-white hover:bg-blue-600`
                }`}
            >
              {isFollow ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardCategoryDashboard;
