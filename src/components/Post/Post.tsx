import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * services
 */
import clientAuthAxios from '../../services/clientAuthAxios'

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext'
import userUserAuthContext from '../../context/hooks/useUserAuthContext'
import { useSwal } from '../../hooks/useSwal'

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[18px] h-[18px]"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[18px] h-[18px]"
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-[17px] h-[17px]"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconButton = ({
  onClick,
  disabled,
  active,
  activeColor,
  children,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  active: boolean;
  activeColor: string;
  children: React.ReactNode;
  label: string;
}) => (
  <motion.button
    type="button"
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-1.5 text-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none
      ${active ? activeColor : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
    whileTap={disabled ? {} : { scale: 0.82 }}
    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={active ? 'active' : 'inactive'}
        initial={{ scale: 0.6, opacity: 0, rotate: -12 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.6, opacity: 0, rotate: 12 }}
        transition={{ type: 'spring', stiffness: 420, damping: 16, duration: 0.22 }}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  </motion.button>
);

const Post = ({ post }: any) => {
  const [like, setLike] = useState(false);
  const [numberLike, setNumberLike] = useState(0);
  const [save, setSave] = useState(false);

  const {
    title,
    linkImage,
    categories,
    _id,
    user,
    likePost,
    usersSavedPost,
    date,
    comments,
    commenstOnPost,
  } = post;

  const { userAuth } = userUserAuthContext();
  const { showConfirmSwal } = useSwal();
  const { globalData } = useGlobalDataContext();
  const dark = !globalData.themeGlobal;

  useEffect(() => {
    if (likePost?.users) {
      setLike(likePost.users.includes(userAuth.userId));
      setNumberLike(likePost.users.length);
    }
  }, []);

  useEffect(() => {
    if (usersSavedPost?.users) {
      setSave(usersSavedPost.users.includes(userAuth.userId));
    }
  }, []);

  const handleDislike = async () => {
    try {
      await clientAuthAxios.post(`/posts/dislike-post/${_id}?userId=${userAuth.userId}`);
      setLike(false);
      setNumberLike((n) => n - 1);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const handleLike = async () => {
    try {
      await clientAuthAxios.post(`/posts/like-post/${_id}?userId=${userAuth.userId}`);
      setLike(true);
      setNumberLike((n) => n + 1);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const handleSave = async () => {
    try {
      await clientAuthAxios.post(`/posts/save-post/${_id}?userId=${userAuth.userId}`);
      setSave(true);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const handleUnSave = async () => {
    try {
      await clientAuthAxios.post(`/posts/unsave-post/${_id}?userId=${userAuth.userId}`);
      setSave(false);
    } catch (error: any) {
      showConfirmSwal({ message: error.response.data.message, status: 'error', confirmButton: true });
    }
  };

  const commentCount = comments?.length ?? commenstOnPost?.numberComments ?? 0;
  const hasImage = !!linkImage?.secure_url;

  return (
    <article
      className={`group w-full rounded-2xl border overflow-hidden transition-colors duration-200 mt-4
        ${dark
          ? 'bg-[#141414] border-gray-800 hover:border-gray-700'
          : 'bg-white border-gray-100 hover:border-gray-200'
        }`}
    >
      <div className="flex flex-col sm:flex-row h-full">

        {/* Thumbnail */}
        {hasImage && (
          <Link
            to={`/view-post/${_id}`}
            className="sm:w-48 md:w-56 flex-shrink-0 overflow-hidden"
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={linkImage.secure_url}
              alt={title}
              className="w-full h-44 sm:h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        )}

        {/* Body */}
        <div className="flex flex-col justify-between flex-1 p-5 gap-3 min-w-0">

          {/* Top: author + date */}
          <div className="flex items-center gap-2.5">
            <Link to={`/profile/${user._id}`} className="flex items-center gap-2 group/author">
              <img
                src={user?.profilePicture?.secure_url || '/avatar.png'}
                alt={user.name}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
              />
              <span className={`text-xs font-medium truncate group-hover/author:underline underline-offset-2
                ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                {user.name}
              </span>
            </Link>
            <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>·</span>
            <time className={`text-xs flex-shrink-0 ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </div>

          {/* Title */}
          <Link to={`/view-post/${_id}`} className="block min-w-0">
            <h2 className={`text-base sm:text-lg font-bold leading-snug tracking-tight line-clamp-2
              transition-colors duration-150
              ${dark
                ? 'text-white hover:text-gray-300'
                : 'text-gray-900 hover:text-gray-600'
              }`}>
              {title}
            </h2>
          </Link>

          {/* Categories */}
          {categories?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat: any) => (
                <Link
                  key={cat._id}
                  to={`/category/${cat.name}`}
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors duration-150
                    ${dark
                      ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
                    }`}
                >
                  #{cat.name}
                </Link>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className={`h-px w-full ${dark ? 'bg-gray-800' : 'bg-gray-100'}`} />

          {/* Footer: actions */}
          <div className="flex items-center justify-between">

            {/* Left: like + comments */}
            <div className="flex items-center gap-4">

              {/* Like */}
              <IconButton
                onClick={like ? handleDislike : handleLike}
                disabled={!userAuth.userId}
                active={like}
                activeColor="text-rose-500"
                label={like ? 'Unlike post' : 'Like post'}
              >
                <HeartIcon filled={like} />
              </IconButton>
              <AnimatePresence initial={false}>
                <motion.span
                  key={numberLike}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className={`text-xs tabular-nums -ml-3 ${dark ? 'text-gray-500' : 'text-gray-400'}`}
                >
                  {numberLike > 0 ? numberLike : ''}
                </motion.span>
              </AnimatePresence>

              {/* Comments */}
              <Link
                to={`/view-post/${_id}`}
                className={`flex items-center gap-1.5 text-sm transition-colors duration-150
                  ${dark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <CommentIcon />
                <span className="text-xs">{commentCount > 0 ? commentCount : ''}</span>
              </Link>
            </div>

            {/* Right: read time + save */}
            <div className="flex items-center gap-3">
              <span className={`text-xs ${dark ? 'text-gray-600' : 'text-gray-400'}`}>5 min read</span>

              <IconButton
                onClick={save ? handleUnSave : handleSave}
                disabled={!userAuth.userId}
                active={save}
                activeColor="text-[#2563EB]"
                label={save ? 'Unsave post' : 'Save post'}
              >
                <BookmarkIcon filled={save} />
              </IconButton>
            </div>
          </div>

        </div>
      </div>
    </article>
  );
};

export default Post;