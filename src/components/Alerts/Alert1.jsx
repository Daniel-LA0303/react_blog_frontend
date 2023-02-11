import React from 'react'
import { useSelector } from 'react-redux';

const Alert1 = () => {
  const alertMsg = useSelector(state => state.posts.alertMSG);
  return (
    <div className={`${alertMsg.error ? 'from-red-400 to-red-600' : 'from-sky-400 to-sky-600'} bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10` }>
      {alertMsg.msg}
    </div>
  )
}

export default Alert1