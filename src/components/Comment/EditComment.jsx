import React from 'react'
import { useSelector } from 'react-redux';

const EditComment = ({
    setEditActive, 
    editActive,
    newComment,
    setNewComment,
    handleEditComment,
    idComment
}) => {
    
    const theme = useSelector(state => state.posts.themeW);
  return (
    <div className={` ${theme ? ' bg-gray-400 text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full flex mx-auto items-center justify-center shadow-lg mb-4 rounded-lg`}>
        <div className="w-full rounded-lg px-4 pt-2" >
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-full px-3 mb-2 mt-2">
                    <textarea 
                        rows="6"
                                  className={`
                                    ${theme ? "" : "bg-gray-700 text-white placeholder-gray-400 "}
                                    p-2 w-full text-sm  border-0 focus:ring-0 
                                    focus:outline-none  
                                     resize-y max-h-40 min-h-24
                                     rounded-lg 
                                    `}
                        placeholder='Type Your Comment' 
                        required
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                    ></textarea>
                </div>
                <div className="w-full md:w-full flex justify-end items-start px-3">
                    <div className="-mr-1">
                        <button 
                            onClick={() => setEditActive(!editActive)}
                            className="text-white font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 bg-red-500 hover:bg-red-700" 
                            placeholder='Type your Comment'
                        >Cancel</button>
                        <button 
                            type='submit' 
                            onClick={() => handleEditComment(idComment)}
                            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                            placeholder='Type your Comment'
                        >Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditComment