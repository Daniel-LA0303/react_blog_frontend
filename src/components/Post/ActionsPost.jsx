import React, { useEffect } from 'react'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useSelector } from 'react-redux';

const ActionsPost = ({
    handleLike,
    handleDislike,
    handleSave,
    handleUnsave,    
    like,
    save,
    numberLike,
    numberSave,
    id,
    numberComments, 
    user
}) => {

  const theme = useSelector(state => state.posts.themeW);

  return (
    <div
    className={`${theme ? ' text-black' : ' text-white'} my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center`}
        // className=""
    >
      <div 
    
      >
        {like ? (
          <button
            onClick={() => handleDislike(id)}
            className="text-red-400  cursor-pointer"
          >
            <FavoriteBorderIcon fontSize="default" />
          </button>
        ) : (
          <button
            onClick={() => handleLike(id)}
            className="text-white cursor-pointer"
          >
            <FavoriteBorderIcon fontSize="default" />
          </button>
        )}
        <p className='text-center'>{numberLike}</p>
      </div>
      <div className="my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center">
        <p>
          <ChatBubbleOutlineIcon fontSize="default" />
        </p>
        <p>{numberComments}</p>
      </div>
      <div className="my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center">
        {save ? (
          <button 
            onClick={() => handleUnsave(id)} disabled={Object.keys(user) != "" ? false : true}
            className='text-blue-500 cursor-pointer'
          >
            <BookmarkBorderIcon fontSize="default" />
          </button>
        ) : (
          <button 
            onClick={() => handleSave(id)} disabled={Object.keys(user) != "" ? false : true}
            className='text-mode-white cursor-pointer'
          >
            <BookmarkBorderIcon fontSize="default" />
          </button>
        )}
        <p>{numberSave}</p>
      </div>
    </div>
  );
}

export default ActionsPost