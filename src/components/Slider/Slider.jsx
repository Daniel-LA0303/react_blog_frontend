import React from 'react'
import Aside from '../Aside/Aside'


import { Autoplay, Pagination } from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import "swiper/css"

const Slider = ({cats}) => {
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
                        <Aside 
                            cats={cat}
                        />
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