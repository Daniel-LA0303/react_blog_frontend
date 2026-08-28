import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * components
 */
import Sidebar from '../../components/Sidebar/Sidebar';

/**
 * route
 */
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

/**
 * hooks
 */
import usePages from '../../context/hooks/usePages';
import userUserAuthContext from '../../context/hooks/useUserAuthContext';
import { useSwal } from '../../hooks/useSwal';
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';
import clientAuthAxios from '../../services/clientAuthAxios';
import useConversation from '../../context/hooks/useConversation';
import UserRecommendedCard from '../../components/UserCard/UserRecommendedCard';
import { fadeIn, fadeUp, scaleIn, staggerContainer } from '../../utils/animationsUtils';
import AnimatedPost from '../../components/ProfileButton/AnimatedPost';
import PostSkeleton from '../../components/Spinner/Skeletons/PostSkeleton';
import SidebarContent from '../../components/ProfileButton/SidebarContent';
import ActionButton from '../../components/ProfileButton/ActionButton';
import SmallSpinner from '../../components/Spinner/SmallSpinner';
import ProfileSkeleton from '../../components/Spinner/Skeletons/ProfileSkeleton';
import { CakeIcon } from '../../utils/iconsUtils';

const Profile = () => {
  const { setErrorPage } = usePages();
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();
  const { globalData } = useGlobalDataContext();
  const { setSelectedConversation } = useConversation();
  const params = useParams();
  const route = useNavigate();

  const dark = !globalData.themeGlobal;

  const [isFollow, setIsFollow] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [recommendedUsers, setRecommendedUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [shuffledUsers, setShuffledUsers] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  useEffect(() => {
    setErrorPage({ error: false, message: {} });
  }, []);

  useEffect(() => {
    if (recommendedUsers.length > 0) {
      setShuffledUsers(
        [...recommendedUsers]
          .filter((c: any) => c.name !== params.id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3)
      );
    }
  }, [recommendedUsers]);

  useEffect(() => {
    setProfileLoading(true);

    const profileRequest = axios.get(`${globalData.link}/pages/page-profile-user/${params.id}`);
    const recommendedRequest = userAuth.userId && params.id !== userAuth.userId
      ? clientAuthAxios.get(`${globalData.link}/users/get-users-recommended`)
      : null;

    Promise.all([profileRequest, recommendedRequest])
      .then(([profileRes, recommendedRes]) => {
        setUser(profileRes.data.data);
        setIsFollow(profileRes.data.data.followersUsers.followers.includes(userAuth.userId));

        if (recommendedRes) {
          const { recommendedUsers } = recommendedRes.data.data.recomended;

          setRecommendedUsers(recommendedUsers);
        }
        setProfileLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setProfileLoading(false);
        if (error.code === 'ERR_NETWORK') {
          setErrorPage({ error: true, message: { status: null, message: 'Network Error', desc: null } });
        } else {
          showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
          route('/');
        }
      });

  }, [params.id]);

  useEffect(() => {
    setPosts([]);
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
      const response = await axios.get(
        `${globalData.link}/users/posts-by-user/${params.id}?page=${pageToFetch}&limit=${limit}`
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

  const handleUnFollowUser = async () => {
    try {
      await clientAuthAxios.post(`/users/user-unfollow/${userAuth.userId}?userUnfollow=${params.id}`);
      setIsFollow(false);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const handleFollowUser = async () => {
    try {
      await clientAuthAxios.post(`/users/user-follow/${userAuth.userId}?userFollow=${params.id}`);
      setIsFollow(true);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const handleClickChat = () => {
    const userChat = { _id: user._id, name: user.name, email: user.email, profilePicture: user.profilePicture };
    setSelectedConversation(userChat);
    route(`/chat/${user._id}`);
  };

  const isOwn = user._id === userAuth.userId;
  const isGuest = Object.keys(userAuth).length === 0;

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0f0f0f]' : 'bgt-white'} transition-colors duration-300`}>
      <Sidebar />

      <main className="max-w-screen-xl mx-auto px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-8">

            {/* Profile Header Card */}
            <AnimatePresence mode="wait">
              {profileLoading ? (
                <motion.div key="skeleton" variants={fadeIn} initial="hidden" animate="visible" exit="hidden">
                  <ProfileSkeleton dark={dark} />
                </motion.div>
              ) : (
                <motion.div
                  key="profile"
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className={`rounded-2xl border overflow-hidden ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                >
                  <div className="p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                      {/* Avatar */}
                      <motion.div variants={scaleIn} custom={0} className="relative flex-shrink-0">
                        <motion.img
                          alt={user?.name || 'Profile'}
                          className="h-24 w-24 rounded-full object-cover ring-4 ring-offset-2 ring-gray-100 dark:ring-gray-800"
                          src={user?.profilePicture?.secure_url || '/avatar.png'}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                        />

                      </motion.div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <motion.h1
                          variants={fadeUp}
                          custom={1}
                          className={`text-2xl font-bold tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}
                        >
                          {user?.name}
                        </motion.h1>

                        {user?.info?.work && (
                          <motion.p variants={fadeUp} custom={2} className="mt-1 text-base text-gray-500 dark:text-gray-400 font-medium">
                            {user.info.work}
                          </motion.p>
                        )}

                        {user?.info?.education && (
                          <motion.p variants={fadeUp} custom={3} className="mt-0.5 text-sm text-gray-400 dark:text-gray-500">
                            {user.info.education}
                          </motion.p>
                        )}

                        <motion.div variants={fadeUp} custom={4} className="mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                          <CakeIcon isDark={globalData.themeGlobal}/>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Joined{' '}
                            <span className="font-medium text-gray-500 dark:text-gray-400">
                              {new Date(user.createdAt).toDateString()}
                            </span>
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {
                      userAuth.userId !== null && (
                        !isOwn && !isGuest && (
                          <motion.div
                            variants={fadeUp}
                            custom={5}
                            className="mt-6 flex justify-center sm:justify-end items-center gap-3"
                          >
                            <AnimatePresence mode="wait">
                              {isFollow ? (
                                <motion.div
                                  key="following"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ActionButton onClick={handleUnFollowUser} variant="outline">
                                    ✓ Following
                                  </ActionButton>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="follow"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ActionButton onClick={handleFollowUser} variant="primary">
                                    Follow
                                  </ActionButton>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <ActionButton onClick={handleClickChat} variant="success">
                              Message
                            </ActionButton>
                          </motion.div>
                        )
                      )
                    }
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4 block lg:hidden"
            >
              <SidebarContent user={user} dark={dark} animated={false} />
              {
                userAuth.userId !== null && shuffledUsers.length > 0 && (
                  <>
                    <p className={`pt-5 font-semibold ${dark ? 'text-white' : 'text-black'}`}>Users recommended</p>
                    <div className='flex flex-col gap-2'>
                      {profileLoading
                        ? Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className={`flex items-center justify-between gap-3 p-3 rounded-xl border animate-pulse
                            ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`h-10 w-10 rounded-full flex-shrink-0 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                              <div className="flex flex-col gap-2">
                                <div className={`h-3 w-24 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                                <div className={`h-2 w-16 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                              </div>
                            </div>
                            <div className={`h-7 w-16 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                          </div>
                        ))
                        :
                        shuffledUsers.map((u: any) =>
                          <UserRecommendedCard key={u._id} user={u} />
                        )
                      }
                    </div>
                  </>
                )
              }
            </motion.div>

            {/* Posts Section */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2}>
              <h2 className={`text-xl font-bold tracking-tight mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>
                Published Blogs
              </h2>

              {/* Post Skeletons while initial load */}
              <AnimatePresence>
                {posts.length === 0 && loading && (
                  <motion.div
                    key="postskels"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="space-y-4"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} variants={fadeUp} custom={i}>
                        <PostSkeleton dark={dark} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-5">
                {posts.map((post, index) => (
                  <AnimatedPost key={post._id} post={post} index={index} />
                ))}
              </div>

              {/* Spinner for pagination loads */}
              <AnimatePresence>
                {loading && posts.length > 0 && (
                  <motion.div
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                  <SmallSpinner />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* End of posts */}
              <AnimatePresence>
                {!hasMore && posts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-4 mt-8"
                  >
                    <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                    <span className="text-xs text-gray-400 tracking-wider uppercase font-medium">End of posts</span>
                    <div className={`flex-1 h-px ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Empty state */}
              <AnimatePresence>
                {!loading && posts.length === 0 && !hasMore && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-center py-16 rounded-2xl border ${dark ? 'border-gray-800 bg-[#27272A]' : 'border-gray-100 bg-white'}`}
                  >
                    <p className="text-4xl mb-3">✍️</p>
                    <p className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>No posts yet</p>
                    <p className={`text-xs mt-1 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>Check back later</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4 hidden lg:block"
          >
            <SidebarContent user={user} dark={dark} animated />

            {
              userAuth.userId !== null && recommendedUsers.length > 0 && (
                <>
                  <p className={`pt-5 font-semibold ${dark ? 'text-white' : 'text-black'}`}>Users recommended</p>
                  <div className='flex flex-col gap-2'>
                    {profileLoading
                      ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className={`flex items-center justify-between gap-3 p-3 rounded-xl border animate-pulse
                          ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-full flex-shrink-0 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                            <div className="flex flex-col gap-2">
                              <div className={`h-3 w-24 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                              <div className={`h-2 w-16 rounded-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />
                            </div>
                          </div>
                          <div className={`h-7 w-16 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        </div>
                      ))
                      : shuffledUsers.map((u: any) =>
                        <UserRecommendedCard key={u._id} user={u} />
                      )
                    }
                  </div>
                </>
              )
            }
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;