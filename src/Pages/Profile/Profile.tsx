import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'

/**
 * icons
 */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCake } from '@fortawesome/free-solid-svg-icons';

/**
 * components
 */
import Sidebar from '../../components/Sidebar/Sidebar';
import Post from '../../components/Post/Post';

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
import useGetAllUsers from '../../context/hooks/useGetAllUsers';
import useConversation from '../../context/hooks/useConversation';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.34, 1.56, 0.64, 1] },
  }),
};

const slideRight = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const SkeletonPulse = ({ className = '' }: { className?: string }) => (
  <motion.div
    className={`rounded-md bg-gray-200 dark:bg-gray-700 ${className}`}
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
  />
);

const ProfileSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`overflow-hidden rounded-2xl shadow-sm border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'} p-8`}>
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <SkeletonPulse className="h-24 w-24 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3 w-full">
        <SkeletonPulse className="h-6 w-48" />
        <SkeletonPulse className="h-4 w-36" />
        <SkeletonPulse className="h-4 w-28" />
      </div>
    </div>
  </div>
);

const PostSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`rounded-2xl border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'} p-6 space-y-3`}>
    <SkeletonPulse className="h-5 w-3/4" />
    <SkeletonPulse className="h-4 w-full" />
    <SkeletonPulse className="h-4 w-2/3" />
    <div className="flex gap-3 pt-2">
      <SkeletonPulse className="h-3 w-16" />
      <SkeletonPulse className="h-3 w-20" />
    </div>
  </div>
);

const StatItem = ({
  label,
  value,
  delay,
  dark,
}: {
  label: string;
  value: number;
  delay: number;
  dark: boolean;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 900;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.li
      ref={ref}
      variants={fadeUp}
      custom={delay}
      className={`flex justify-between items-center py-3.5 border-t ${dark ? 'border-gray-800' : 'border-gray-100'}`}
    >
      <span className={`text-sm font-medium tracking-wide ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      <motion.span
        className={`text-sm font-semibold tabular-nums ${dark ? 'text-white' : 'text-gray-900'}`}
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: delay * 0.08 }}
      >
        {count}
      </motion.span>
    </motion.li>
  );
};

const SkillBadge = ({ skill, index }: { skill: string; index: number }) => (
  <motion.span
    variants={scaleIn}
    custom={index}
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.97 }}
    className="inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800 cursor-default select-none"
  >
    {skill}
  </motion.span>
);

const ActionButton = ({
  onClick,
  variant,
  children,
}: {
  onClick: () => void;
  variant: 'primary' | 'outline' | 'success';
  children: React.ReactNode;
}) => {
  const base =
    'relative overflow-hidden flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';
  const styles = {
    primary: 'bg-[#2563EB] text-white hover:bg-[#2563EB] dark:bg-[#2563EB] dark:hover:bg-[#2563EB] ',
    outline: 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-800 focus-visible:ring-gray-400',
    success: 'bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500 focus-visible:ring-slate-500',
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`${base} ${styles[variant]}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96, transition: { duration: 0.1 } }}
    >
      {children}
    </motion.button>
  );
};

const ContactRow = ({ icon, value, delay }: { icon: string; value: string; delay: number }) => (
  <motion.div
    variants={slideRight}
    custom={delay}
    className="flex items-center gap-3 group"
  >
    <i className={`${icon} text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors text-base`} />
    <span className="text-sm text-gray-600 dark:text-gray-300 truncate">{value}</span>
  </motion.div>
);

const AnimatedPost = ({ post, index }: { post: any; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 3}
    >
      <Post post={post} />
    </motion.div>
  );
};

const SideCard = ({
  title,
  dark,
  delay,
  children,
}: {
  title: string;
  dark: boolean;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className={`rounded-2xl border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'} overflow-hidden`}
  >
    <div className="p-6">
      <h3 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${dark ? 'text-gray-400' : 'text-gray-400'}`}>
        {title}
      </h3>
      {children}
    </div>
  </motion.div>
);


const LoadingSpinner = () => (
  <div className="flex justify-center py-10">
    <motion.div
      className="h-6 w-6 rounded-full border-2 border-gray-300 border-t-gray-700 dark:border-gray-600 dark:border-t-gray-200"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  </div>
);


const SidebarContent = ({
  user,
  dark,
  animated = true,
}: {
  user: any;
  dark: boolean;
  animated?: boolean;
}) => {
  const hasSocial = user?.info?.social;
  const hasSkills = user?.info?.skills?.length > 0;
  return (
    <>
      <SideCard title="Contact" dark={dark} delay={animated ? 1 : 0}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {user?.email && <ContactRow icon="fa-solid fa-envelope" value={user.email} delay={0} />}
          {hasSocial?.facebook && <ContactRow icon="fa-brands fa-facebook" value={hasSocial.facebook} delay={1} />}
          {hasSocial?.instagram && <ContactRow icon="fa-brands fa-instagram" value={hasSocial.instagram} delay={2} />}
          {hasSocial?.twitter && <ContactRow icon="fa-brands fa-twitter" value={hasSocial.twitter} delay={3} />}
          {hasSocial?.youtube && <ContactRow icon="fa-brands fa-youtube" value={hasSocial.youtube} delay={4} />}
          {hasSocial?.linkedin && <ContactRow icon="fa-brands fa-linkedin" value={hasSocial.linkedin} delay={5} />}
        </motion.div>
      </SideCard>

      <AnimatePresence>
        {hasSkills && (
          <SideCard title="Skills" dark={dark} delay={animated ? 1.5 : 0}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-wrap gap-2">
              {user.info.skills.map((skill: string, i: number) => (
                <SkillBadge key={i} skill={skill} index={i} />
              ))}
            </motion.div>
          </SideCard>
        )}
      </AnimatePresence>

      <SideCard title="Activity" dark={dark} delay={animated ? 2 : 0}>
        <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
          <StatItem label="Blogs Published" value={user?.numberPost || 0} delay={0} dark={dark} />
          <StatItem label="Likes Given" value={user?.likePost?.posts?.length || 0} delay={1} dark={dark} />
          <StatItem label="Followers" value={user?.followersUsers?.followers?.length || 0} delay={2} dark={dark} />
        </motion.ul>
      </SideCard>
    </>
  );
};


const Profile = () => {
  const { setErrorPage } = usePages();
  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();
  const { globalData } = useGlobalDataContext();
  const { setSelectedConversation } = useConversation();
  const [allUsers, addUser, prependUser] = useGetAllUsers();
  const params = useParams();
  const route = useNavigate();

  const dark = !globalData.themeGlobal;

  const [isFollow, setIsFollow] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 5;

  useEffect(() => {
    setErrorPage({ error: false, message: {} });
  }, []);

  useEffect(() => {
    setProfileLoading(true);
    axios
      .get(`${globalData.link}/pages/page-profile-user/${params.id}`)
      .then((res) => {
        setUser(res.data.data);
        setIsFollow(res.data.data.followersUsers.followers.includes(userAuth.userId));
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
    prependUser(userChat);
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
                          <FontAwesomeIcon icon={faCake} className="text-gray-300 dark:text-gray-600 text-xs" />
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
                    {!isOwn && !isGuest && (
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
                    )}
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
                    <LoadingSpinner />
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

          {/* ── Right Sidebar Desktop ────────────────────────────────────── */}
          <motion.aside
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4 hidden lg:block"
          >
            <SidebarContent user={user} dark={dark} animated />
          </motion.aside>
        </div>
      </main>
    </div>
  );
};

export default Profile;