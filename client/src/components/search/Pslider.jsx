import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './Search.css';
import { Pagination, FreeMode } from 'swiper/modules';
import backcard from "../../assets/backcard.jpg";

const Pslider = ({ propimg, propvideo,cardcss }) => {
    return (
        <div style={{ height: '100%' }}>
            <Swiper
                slidesPerView={1}
                spaceBetween={25}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className={cardcss}
                style={{
                    height: '100%', // Set the height of the carousel container
                    width: '18rem',
                    margin: '0px',  // Set the width of the carousel container
                    position: 'relative',
                    zIndex: '0',
                }}
            >    {propvideo ? <SwiperSlide>
                                <video src={propvideo} className='sr-demo-img' autoPlay loop muted playsInline />
                              </SwiperSlide> : null}
                {propimg && propimg.length > 0 ? (
                    propimg.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img src={image} alt="image" className="sr-img" />
                        </SwiperSlide>
                    ))
                ) : (
                    <SwiperSlide>
                        <img src={backcard} alt="default image" className="sr-demo-img" />
                    </SwiperSlide>
                )}
            </Swiper>
        </div>
    )
}

export default Pslider