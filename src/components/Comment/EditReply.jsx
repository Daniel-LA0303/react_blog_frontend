import React from 'react'
import { useSelector } from 'react-redux';

const EditReply = ({
    setEditReplyActive,
    editReplyActive,
    editReply,
    setEditReply,
    handleEditReply,
    reply
}) => {

    const theme = useSelector(state => state.posts.themeW);

    const cancelEditReply = () => {
        setEditReplyActive(!editReplyActive);
        setEditReply('');
    }

    //send info to edit reply
    const handleEditReplyAction = (editReply, reply) => {
        // console.log(editReply, reply);
      handleEditReply(editReply, reply);
      setEditReplyActive(!editReplyActive);
    }

  return (
    <div className={` ${theme ? ' bgt-light text-black' : 'bgt-dark hover:bg-zinc-700 text-white'} w-full flex mx-auto items-center justify-center shadow-lg my-4 rounded-lg`}>
        <div className="w-full rounded-lg px-4 pt-2" >
            <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full md:w-full px-3 mb-2 mt-2">
                    <textarea 
                        className=" rounded text-black leading-normal resize-none w-full h-20 py-2 px-3 font-medium  " 
                        placeholder='Type Your Comment' 
                        required
                        onChange={(e) => setEditReply(e.target.value)}
                        value={editReply}
                    ></textarea>
                </div>
                <div className="w-full md:w-full flex justify-end items-start px-3">
                    <div className="-mr-1">
                        <button 
                            onClick={() => cancelEditReply()}
                            className="text-white focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 bg-red-500 hover:bg-red-700" 
                            placeholder='Type your Comment'
                        >Cancel</button>
                        <button 
                            type='submit' 
                            onClick={() => handleEditReplyAction(editReply, reply)}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                            placeholder='Type your Comment'
                        >Save</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default EditReply