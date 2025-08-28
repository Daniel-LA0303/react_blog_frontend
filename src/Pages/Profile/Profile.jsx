import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCake } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import axios from 'axios';
import Post from '../../components/Post/Post';
import usePages from '../../context/hooks/usePages';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import clientAuthAxios from '../../services/clientAuthAxios';


const Profile = () => {

  /**
 * context
 */
  const { errorPage, setErrorPage } = usePages();
  const { error, message } = errorPage;

  /**
   * hooks
   */
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();

  /**
   * router
   */
  const params = useParams();
  const route = useNavigate();


  /**
   * States
   */
  const [isFollow, setIsFollow] = useState(null); // -> to paint follow
  const [posts, setPosts] = useState([]); // -> user's posts
  const [user, setUser] = useState({}); //-> user view
  const [loading, setLoading] = useState(false); // -> loading
  const [page, setPage] = useState(0); // page 1
  const [hasMore, setHasMore] = useState(true); // check more blogs
  const limit = 5;


  /**
   * States Redux
   */
  const theme = useSelector(state => state.posts.themeW);
  const link = useSelector(state => state.posts.linkBaseBackend);

  /**
   * useEffect
   */
  useEffect(() => {
    setErrorPage({
      error: false,
      message: {}
    });
  }, []);

  // useeffect to get info profile
  useEffect(() => {
    setLoading(true);
    axios.get(`${link}/pages/page-profile-user/${params.id}`)
      .then((pageProfile) => {

        console.log(pageProfile.data.data);


        setUser(pageProfile.data.data);
        // paint buttons
        if (pageProfile.data.data.followersUsers.followers.includes(userAuth.userId)) {
          setIsFollow(true);
        } else {
          setIsFollow(false);
        }

        setLoading(false);
      }).catch((error) => {
        console.log(error);
        if (error.code === 'ERR_NETWORK') {
          setErrorPage({
            error: true,
            message: {
              status: null,
              message: 'Network Error',
              desc: null
            }
          });
          setLoading(false);
        } else {
          setLoading(false);
          showConfirmSwal({
            message: error.response.data.message,
            status: "error",
            confirmButton: true
          });
          route("/");

        }
      });
  }, [params.id]);

  /**
  * init posts charge the first page
  */
  useEffect(() => {
    setPosts([]); // clean post profile in case to change profile
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [params.id]);

  /**
   * infinite scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      if (
        !loading &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  /**
   * Functions
   */
  // follow user
  const handleUnFollowUser = async () => {
    try {
      await clientAuthAxios.post(`/users/user-unfollow/${userAuth.userId}?userUnfollow=${params.id}`);
      setIsFollow(false);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  /**
 * fetch posts with pagination (infinite scroll)
 */
  const fetchPosts = async (pageToFetch = page) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `${link}/users/posts-by-user/${params.id}?page=${pageToFetch}&limit=${limit}`
      );

      const { data, meta } = response.data.data;
      if (data && data.length > 0) {
        setPosts((prev) => [...prev, ...data]);
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

  // unfollow user
  const handleFollowUser = async () => {
    try {
      await clientAuthAxios.post(`/users/user-follow/${userAuth.userId}?userFollow=${params.id}`);
      setIsFollow(true);
    } catch (error) {
      console.log(error);
      showConfirmSwal({
        message: error.response.data.message,
        status: "error",
        confirmButton: true
      });
    }
  }

  return (
    <div className=''>
      <Sidebar />
      {

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <div className="mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">

              {/* header user card */}
              <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                <div className="bg-gradient-to-br from-[var(--primary-100)] to-white p-6">
                  <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
                    <div className="relative">

                      <div
                        className="flex flex-col items-center space-y-4 text-center">
                        <img
                          alt="User profile photo"
                          className="h-24 w-24 rounded-full object-cover"
                          src={
                            user?.profilePicture?.secure_url
                              ? user.profilePicture.secure_url
                              : "/avatar.png"
                          }
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h1 className="text-lg font-bold sm:text-xl">{user?.name}</h1>
                      <p className="mt-1 text-lg font-light">{user?.info?.work}</p>
                      <p className="mt-1 text-sm font-light">{user?.info?.education}</p>
                      <div className='flex justify-start items-center mt-2'>
                        <FontAwesomeIcon icon={faCake} />
                        <p className="mt-1 text-xm font-light ml-2">Joined in <span className='font-bold'>{new Date(user.createdAt).toDateString()}</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex justify-end mt-2">
                    {user._id === userAuth.userId || Object.keys(userAuth) == "" ? null : (
                      <>
                        {isFollow ? (
                          <button
                            type="button"
                            onClick={() => handleUnFollowUser()}
                            className={`${theme ? 'btn-theme-light-op2' : 'btn-theme-dark-op2'} hover:bg-gray-500 w-28 text-xs text-sm:nomral mx-1 font-medium rounded-lg px-5 py-2`}
                          >
                            Following
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleFollowUser()}
                            className={`${theme ? 'btn-theme-light-op1' : 'btn-theme-dark-op1'} hover:bg-blue-500 w-28 text-xs text-sm:nomral mx-1 font-medium rounded-lg px-5 py-2 `}
                          >
                            Follow
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* aside mobile */}
              <aside className="space-y-8 block lg:hidden mt-8">

                {/* contact */}
                <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                  <div className="p-6">
                    <h3 className={`text-left text-lg md:text-xl font-semibold py-0 mb-3 ${theme ? '' : 'text-white'}`}>Contact</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <i className="fa-solid fa-envelope text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user?.email}</p>
                      </div>

                      {user?.info?.social?.facebook && (
                        <div className="flex items-center">
                          <i className="fa-brands fa-facebook text-xl w-6 text-center"></i>
                          <p className="text-xl ml-2">{user.info.social.facebook}</p>
                        </div>
                      )}

                      {user?.info?.social?.instagram && (
                        <div className="flex items-center">
                          <i className="fa-brands fa-instagram text-xl w-6 text-center"></i>
                          <p className="text-xl ml-2">{user.info.social.instagram}</p>
                        </div>
                      )}

                      {user?.info?.social?.twitter && (
                        <div className="flex items-center">
                          <i className="fa-brands fa-twitter text-xl w-6 text-center"></i>
                          <p className="text-xl ml-2">{user.info.social.twitter}</p>
                        </div>
                      )}

                      {user?.info?.social?.youtube && (
                        <div className="flex items-center">
                          <i className="fa-brands fa-youtube text-xl w-6 text-center"></i>
                          <p className="text-xl ml-2">{user.info.social.youtube}</p>
                        </div>
                      )}

                      {user?.info?.social?.linkedin && (
                        <div className="flex items-center">
                          <i className="fa-brands fa-linkedin text-xl w-6 text-center"></i>
                          <p className="text-xl ml-2">{user.info.social.linkedin}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Skills */}
                <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                  <div className="p-6">
                    <h3 className={`text-left text-lg md:text-xl font-semibold py-0 ${theme ? '' : 'text-white'}`}>Skills</h3>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {user?.info?.skills?.map((skill, i) => (
                        <span
                          key={i}
                          className="rounded-full px-4 py-2 mb-3 text-sm font-medium bg-blue-300 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                  <div className="p-6">
                    <h3 className={`text-left text-lg md:text-xl font-semibold py-0 mb-3 ${theme ? '' : 'text-white'}`}>Activity</h3>
                    <ul className="mt-1 space-y-4">
                      <li className="flex justify-between border-t border-gray-200 pt-4">
                        <span className="text-sm font-medium">Blogs Published</span>
                        <span className="text-sm font-semibold">{user?.numberPost || 0}</span>
                      </li>
                      <li className="flex justify-between border-t border-gray-200 pt-4">
                        <span className="text-sm font-medium">Likes Given</span>
                        <span className="text-sm font-semibold">{user?.likePost?.posts?.length || 0} </span>
                      </li>
                      <li className="flex justify-between border-t border-gray-200 pt-4">
                        <span className="text-sm font-medium">Followers</span>
                        <span className="text-sm font-semibold">{user?.followersUsers?.followers?.length || 0}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>

              {/* show posts by user whit infite scroll*/}
              <div className="mt-8">
                <h3
                  className={`text-left text-xl md:text-3xl font-semibold pb-0 ${theme ? "" : "text-white"
                    }`}
                >
                  Published Blogs
                </h3>
                <div className="mt-4 space-y-6">
                  {posts.map((post) => (
                    <Post key={post._id} post={post} />
                  ))}
                </div>
                {loading && <Spinner />}
                {!hasMore && (
                  <p className="text-center mt-4 text-gray-500 text-sm">
                    No more posts
                  </p>
                )}
              </div>

            </div>

            {/* aside desktop */}
            <aside className="space-y-8 hidden lg:block">
              {/* contact */}
              <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                <div className="p-6">
                  <h3 className={`text-left text-lg md:text-xl font-semibold py-0 mb-3 ${theme ? '' : 'text-white'}`}>Contact</h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center">
                      <i className="fa-solid fa-envelope text-xl w-6 text-center"></i>
                      <p className="text-xl ml-2">{user?.email}</p>
                    </div>

                    {user?.info?.social?.facebook && (
                      <div className="flex items-center">
                        <i className="fa-brands fa-facebook text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user.info.social.facebook}</p>
                      </div>
                    )}

                    {user?.info?.social?.instagram && (
                      <div className="flex items-center">
                        <i className="fa-brands fa-instagram text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user.info.social.instagram}</p>
                      </div>
                    )}

                    {user?.info?.social?.twitter && (
                      <div className="flex items-center">
                        <i className="fa-brands fa-twitter text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user.info.social.twitter}</p>
                      </div>
                    )}

                    {user?.info?.social?.youtube && (
                      <div className="flex items-center">
                        <i className="fa-brands fa-youtube text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user.info.social.youtube}</p>
                      </div>
                    )}

                    {user?.info?.social?.linkedin && (
                      <div className="flex items-center">
                        <i className="fa-brands fa-linkedin text-xl w-6 text-center"></i>
                        <p className="text-xl ml-2">{user.info.social.linkedin}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Skills */}
              <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                <div className="p-6">
                  <h3 className={`text-left text-lg md:text-xl font-semibold py-0 ${theme ? '' : 'text-white'}`}>Skills</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {user?.info?.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-full px-4 py-2 mb-3 text-sm font-medium bg-blue-300 text-blue-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className={`overflow-hidden rounded-lg shadow ${theme ? 'bgt-light' : 'bgt-dark text-white'}`}>
                <div className="p-6">
                  <h3 className={`text-left text-lg md:text-xl font-semibold py-0 mb-3 ${theme ? '' : 'text-white'}`}>Activity</h3>
                  <ul className="mt-1 space-y-4">
                    <li className="flex justify-between border-t border-gray-200 pt-4">
                      <span className="text-sm font-medium">Blogs Published</span>
                      <span className="text-sm font-semibold">{user?.numberPost || 0}</span>
                    </li>
                    <li className="flex justify-between border-t border-gray-200 pt-4">
                      <span className="text-sm font-medium">Likes Given</span>
                      <span className="text-sm font-semibold">{user?.likePost?.posts?.length || 0}</span>
                    </li>
                    <li className="flex justify-between border-t border-gray-200 pt-4">
                      <span className="text-sm font-medium">Followers</span>
                      <span className="text-sm font-semibold">{user?.followersUsers?.followers?.length || 0}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </main>
      }
    </div>
  )
}

export default Profile