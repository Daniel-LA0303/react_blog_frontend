import React from 'react'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

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
    post, 
    user
}) => {
  return (
    <>
      <div className="my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center">
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
        <p>{numberLike}</p>
      </div>
      <div className="my-3 text-2xl mx-10 sm:mx-0 flex flex-row sm:flex-col justify-center items-center">
        <p>
          <ChatBubbleOutlineIcon fontSize="default" />
        </p>
        <p>{post.commenstOnPost.comments.length}</p>
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
    </>
  );
}

export default ActionsPost