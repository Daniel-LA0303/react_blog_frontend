import React from 'react'

import { Autoplay, Pagination } from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css"
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Slider = ({cats}) => {

      const theme = useSelector(state => state.posts.themeW);

  return (
    <div className='app'>

    <div className='container'>
        <div className='swiperContainer'>
            <Swiper
                modules={[Pagination, Autoplay]}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false
                }}
                pagination={{
                  el: ".pagination",
                  clickable: true,
                }}
                slidesPerView={1}
                breakpoints={{
                  "@0.00": {
                    slidesPerView: 1,
                    spaceBetween: 10,
                  },
                  "@0.50": {
                    slidesPerView: 1.25,
                    spaceBetween: 10,
                  },
                  "@1.00": {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  "@1.25": {
                    slidesPerView: 2.5,
                    spaceBetween: 10,
                  },
                  "@1.50": {
                    slidesPerView: 3,
                    spaceBetween: 10,
                  },
                  "@1.75": {
                    slidesPerView: 4,
                    spaceBetween: 10,
                  },
                }}
            >
                {cats.map(cat => (
                    <SwiperSlide
                        key={cat._id}
                        
                    >
                      <Link
                              to={`/category/${cat.name}`}
                              key={cat._id}
                              className={`${theme ? 'bgt-light' : 'bgt-dark text-white'} hover:bg-slate-600 hover:text-white w-full max-w-md flex flex-col rounded-xl shadow-lg px-3 py-4`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div style={{ border: `solid 10px ${cat.color}` }} className="rounded-full w-4 h-4"></div>
                                  <p  className="text-sm md:text-xs">
                                    {cat.name}
                                  </p>
                                </div>
                                <div className="flex items-center">
                                  <div className="text-gray-500 hover:text-gray-300 cursor-pointer mx-1 text-sm md:text-xs">
                                    {cat.follows.countFollows}
                                  </div>
                                  <div className="text-gray-500 hover:text-gray-300 cursor-pointer">
                                    <FontAwesomeIcon icon={faUser} />
                                  </div>
                                </div>
                              </div>
                            </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        <div className="pagination" />
    </div>
</div>
  )
}

export default Slider