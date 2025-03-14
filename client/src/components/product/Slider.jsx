import React,{useState, useEffect} from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import './Product.css';
import { Pagination, FreeMode } from 'swiper/modules';
import build1 from '../../assets/building1.jpg';
import build2 from "../../assets/building2.webp";

const Slider = () => {
    const [slides, setSlides] = useState(3); // Default slidesPerView
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 560) {
                setSlides(2); // Set 2 slides for small screens
            } else {
                setSlides(3); // Default 3 slides
            }
        };
        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize); // Listen for screen resize

        return () => {
            window.removeEventListener('resize', handleResize); // Cleanup event listener
        };
    }, []);
    return (
        <div>
            <Swiper
                slidesPerView={slides}
                spaceBetween={20}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
                modules={[FreeMode, Pagination]}
                className="mySwiper"
                style={{
                    height: '350px', // Set the height of the carousel container
                    width: '56rem',
                    margin: '0px',  // Set the width of the carousel container
                }}
            >
                <SwiperSlide>
                    <div className="card recomm-card" style={{ width: "18rem" }}>
                        <img src={build1} className="card-img-top h-50" alt="img" />
                        <div className="card-body">
                            <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                            <div className='fw-bold'>Om Palace</div>
                            <div>Vile Parle East, Mumbai</div>
                            <a href="#" className="btn view-btn mt-2">Enquire Now</a>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide><div className="card recomm-card" style={{ width: "18rem" }}>
                    <img src={build2} className="card-img-top h-50" alt="img" />
                    <div className="card-body">
                        <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                        <div className='fw-bold'>Om Palace</div>
                        <div>Vile Parle East, Mumbai</div>
                        <a href="#" className="btn view-btn mt-2">Enquire Now</a>
                    </div>
                </div></SwiperSlide>
                <SwiperSlide><div className="card recomm-card" style={{ width: "18rem" }}>
                    <img src={build1} className="card-img-top h-50" alt="img" />
                    <div className="card-body">
                        <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                        <div className='fw-bold'>Om Palace</div>
                        <div>Vile Parle East, Mumbai</div>
                        <a href="#" className="btn view-btn mt-2">Enquire Now</a>
                    </div>
                </div></SwiperSlide>
                <SwiperSlide><div className="card recomm-card" style={{ width: "18rem" }}>
                    <img src={build2} className="card-img-top h-50" alt="img" />
                    <div className="card-body">
                        <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                        <div className='fw-bold'>Om Palace</div>
                        <div>Vile Parle East, Mumbai</div>
                        <a href="#" className="btn view-btn mt-2">Enquire Now</a>
                    </div>
                </div></SwiperSlide>
            </Swiper>
        </div>
    )
}

export default Slider