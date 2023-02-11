import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

import './ScrollButton.css'

const ScrollButton = () => {

    const [visible, setVisible] = useState(false)
  
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300){
        setVisible(true)
      } 
      else if (scrolled <= 300){
        setVisible(false)
      }
    };
    const scrollToTop = () =>{
      window.scrollTo({
        top: 0, 
        behavior: 'smooth'
      });
    };
    
    window.addEventListener('scroll', toggleVisible);
  return (
    <div className='btn my-5 text-4xl flex justify-start items-center'>
      <div className=' w-10 m-auto'>

      <img 
        className=''
        src='/scroll.png'
        onClick={scrollToTop}
        style={{display: visible ? 'inline' : 'none'}}
      />
      </div>
    </div>
  )
}

export default ScrollButton