
/**
 * icons
 */
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

/**
 * hooks
 */
import useGlobalDataContext from '../../context/hooks/useGlobalDataContext';

const ActionsPost = ({
  user,
  id,
  numberLike,
  numberSave,
  numberComments,
  like,
  save,
  handleLike,
  handleDislike,
  handleSave,
  handleUnsave,
}) => {

  const { globalData } = useGlobalDataContext();

  return (
    <div
      className={`${globalData.themeGlobal ? ' text-black' : ' text-white'} my-0 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center`}
    >
      <div className='my-1 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center'>
        {like ? (
          <button
            onClick={() => handleDislike(id)}
            className={`${!globalData.themeGlobal && "neon-red"} text-red-400 cursor-pointer animate-like-pop`}
          >
            <FavoriteBorderIcon fontSize="default" />
          </button>
        ) : (
          <button
            onClick={() => handleLike(id)}
            className=" cursor-pointer"
          >
            <FavoriteBorderIcon fontSize="default" />
          </button>
        )}
        <p className='text-center ml-1 sm:ml-0 text-xl sm:text-2xl'>{numberLike}</p>
      </div>
      <div className={`
          my-1 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center cursor-pointer
          ${globalData.themeGlobal ? "hover:text-orange-300" : "neon-orange-hover"}
        `}>
        <p>
          <ChatBubbleOutlineIcon fontSize="default" />
        </p>
        <p className='ml-1 sm:ml-0 text-xl sm:text-2xl'>{numberComments}</p>
      </div>


      <div className="my-1 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center">
        {save ? (
          <button
            onClick={() => handleUnsave(id)}
            disabled={Object.keys(user) != "" ? false : true}
            className={`${!globalData.themeGlobal && "neon-blue"} text-blue-500 cursor-pointer animate-like-pop`}
          >
            <BookmarkBorderIcon fontSize="default" />
          </button>
        ) : (
          <button
            onClick={() => handleSave(id)}
            disabled={Object.keys(user) != "" ? false : true}
            className="text-mode-white cursor-pointer"
          >
            <BookmarkBorderIcon fontSize="default" />
          </button>
        )}
        <p className='ml-1 sm:ml-0 text-xl sm:text-2xl'>{numberSave}</p>
      </div>
    </div>
  );
}

export default ActionsPost