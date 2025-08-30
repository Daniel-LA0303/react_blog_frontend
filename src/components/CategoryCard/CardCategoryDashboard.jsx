import { useEffect, useState } from "react";
import { useSwal } from "../../hooks/useSwal";
import { useSelector } from "react-redux";
import clientAuthAxios from "../../services/clientAuthAxios";
import { Link } from "react-router-dom";

const CardCategoryDashboard = ({ category, userAuth }) => {
  /**
   * states
   */
  const [isFollow, setIsFollow] = useState(false);

  /**
   * hooks
   */
  const { showConfirmSwal } = useSwal();

  /**
   * states Redux
   */
  const theme = useSelector((state) => state.posts.themeW);
  const link = useSelector((state) => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {

    console.log(category);


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
        `${link}/users/unfollow-tag/${userAuth.userId}?categoryId=${category._id}`
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
      className={`group w-full mb-5 mx-auto rounded-2xl overflow-hidden shadow-sm flex ${theme ? "bg-white" : "bgt-dark text-white"
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
            className={`text-2xl font-bold ${theme ? "text-gray-800" : "text-white"
              }`}
          >
            {category.name}
          </Link>
          <p className={`max-w-md ${theme ? "text-gray-500" : "text-gray-300"}`}>
            {category.desc}
          </p>

          <p className={`max-w-md ${theme ? "text-gray-500" : "text-gray-300"} text-sm`}>
            Followers {''}
            {category.follows.countFollows}
          </p>

          {userAuth?.userId && (
            <button
              onClick={isFollow ? handleUnFollowTag : handleFollowTag}
              className={`flex items-center justify-center w-fit px-5 py-2.5 text-sm font-medium rounded-lg transition-colors duration-300 ${isFollow
                  ? theme
                    ? "bg-gray-200 text-black hover:bg-gray-300"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                  : `bg-[${category.color}] text-white hover:bg-blue-600`
                }`}
            >
              {isFollow ? "Following" : "Follow"}
            </button>
          )}
        </div>

        {/* Image */}
        <div
          className="w-64 h-40 bg-cover bg-center rounded-lg ml-8 flex-shrink-0"
          style={{ backgroundImage: `url(${category.image || ""})` }}
        ></div>
      </div>
    </div>
  );
};

export default CardCategoryDashboard;
