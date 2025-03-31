import React, { useState, useEffect } from 'react'
import './Home.css'
import Navbar from '../navbar/Navbar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import build1 from "../../assets/building1.jpg";
import build2 from "../../assets/building2.webp";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay'; // Autoplay styles
import { Pagination, Autoplay } from 'swiper/modules';
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import Footer from './Footer';

const Home = () => {

    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState('Buy');
    const propertyTypes = {
        Buy: ["Flat", "Villa", "Penthouse", "Residential House", "Builder Floor Ready to Move", "Builder Under Construction"],
        Rent: ["Flat", "Villa", "Penthouse", "Residential House", "Builder Floor Ready", "Office", "Shop", "Retail", "Godam", "Industry"],
        'Plot/Land': ["Plot/Land"],
        PG: ["Flat", "Villa", "Penthouse", "Residential House", "Builder Floor Ready"],
        Commercial: ["Office", "Shop", "Retail", "Godam", "Industry"],
    };
    const [filter, setfilter] = useState({
        tab: 'Buy', city: '', location: '', property: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.tab) {
            setSelectedTab(location.state.tab);
        }
        localStorage.removeItem('filterTab'); // Removes the item with the key 'filterTab'
    }, [location]);

    const changetab = (value) => {
        setSelectedTab(value);
        setfilter((prevState) => ({
            ...prevState,
            tab: value, // Update formData with the selected unit
        }));
    }
    const change1 = (value) => {
        setfilter((prevState) => ({
            ...prevState,
            city: value, // Update formData with the selected unit
        }));
    }
    const handlelocation = (e) => {
        const value = e.target.value;
        setfilter((prevState) => ({
            ...prevState,
            location: value, // Update formData with the selected unit
        }));
    }
    const changeproperty = (value) => {
        setfilter((prevState) => ({
            ...prevState,
            property: value, // Update formData with the selected unit
        }));
    };
    const sellnav = () => {
        navigate('/profile', { state: { tab: 'Sell' } })
    };
    const handleSearch = () => {
        navigate('/search', { state: filter });
    }
    const handleabout= ()=>{
        navigate('/about-us', { state: filter });
    }
    const handleblog = ()=>{
        navigate('/about-us/blogs', { state: filter });
    }
    const handlePrivacy = ()=>{
        navigate('/about-us/privacy-policy', { state: filter });
    }
    return (
        <>
            <Helmet>
                <title>Housing</title>
                <meta name="description" content="Top real estate agents near me,Hiring a real estate agent,Realtor reviews,Selling my house quickly,House selling process,
                Sell your home for cash,Real estate market analysis" />
                <meta name="keywords" content="home,realtor,houses for sale,houses for rent,mls,property,property for sale,homes for rent,
                land for sale,for sale by owner,apartments for rent near me,mls listings,condos for sale" />
            </Helmet>
            <Navbar back="profile-bg" />
            <div className='d-flex'>
                <div className='main-hcont'>
                    <div id="carouselExampleAutoplaying" className="carousel slide h-adv-cont" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="https://housing-images.n7net.in/3a1452c5/69b1a317abbdcf1e6f1072386dc28707/v0/banner.jpg" className="d-block w-100 h-adv-image img-fluid" alt="img" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://i.pinimg.com/originals/c2/52/d7/c252d7160599e5d0683c65f968bd103b.jpg" className="d-block w-100 h-adv-image img-fluid" alt="img" />
                            </div>
                            <div className="carousel-item">
                                <img src="https://png.pngtree.com/thumb_back/fh260/background/20220405/pngtree-real-estatebright-colorful-tone-concept-dispossession-foreclosure-exterior-photo-image_16921278.jpg" className="d-block w-100 h-adv-image img-fluid" alt="img" />
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className='d-sm-none'>
                        <Swiper
                            slidesPerView={3}
                            spaceBetween={40}
                            autoplay={{
                                delay: 3000, // Time in milliseconds before the next slide
                                disableOnInteraction: false, // Autoplay will continue even after user interaction
                            }}
                            modules={[Autoplay]}
                            className="mySwipers"
                            style={{
                                height: '45px', // Set the height of the carousel container
                                width: '25rem',
                            }}
                        >
                            <SwiperSlide style={{ marginLeft: '20px', marginTop: '4px' }}><div><img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/249_Logo.png" className="res-adv-img" alt="img" /></div></SwiperSlide>
                            <SwiperSlide><div><img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/91_Logo.png" className="res-adv-img" alt="img" /></div></SwiperSlide>
                            <SwiperSlide style={{ marginTop: '4px' }}><div><img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/249_Logo.png" className="res-adv-img" alt="img" /></div></SwiperSlide>
                            <SwiperSlide><div> <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/177_Logo.png" className="res-adv-img" alt="img" /></div></SwiperSlide>
                        </Swiper>
                    </div>
                    <div className='s-cont d-flex res-cont justify-content-center'>
                        <div className='s-cont-box'>
                            <div className='s-cont-box1 d-flex'>
                                <div onClick={() => changetab('Buy')}
                                    className={`s-itm ${selectedTab === 'Buy' ? 's-itmcol' : ''}`}>Buy</div>
                                <div onClick={sellnav}
                                    className={`s-itm ${selectedTab === 'Sell' ? 's-itmcol' : ''}`} >Sell</div>
                                <div onClick={() => changetab('Rent')}
                                    className={`s-itm ${selectedTab === 'Rent' ? 's-itmcol' : ''}`}>Rent</div>
                                <div onClick={() => changetab('Plot/Land')}
                                    className={`s-itm ${selectedTab === 'Plot/Land' ? 's-itmcol' : ''}`}>Plot/Land</div>
                                <div onClick={() => changetab('PG')}
                                    className={`s-itm ${selectedTab === 'PG' ? 's-itmcol' : ''}`}>PG</div>
                                <div onClick={() => changetab('Commercial')}
                                    className={`s-itm ${selectedTab === 'Commercial' ? 's-itmcol' : ''}`}>Commercial</div>
                            </div>
                            <div className='s-cont-sbox d-flex p-2'>
                                <form className='d-flex align-items-center justify-content-start ms-2'>
                                    <div className="dropdown d-flex loc-dropdown">
                                        <button className="btn btn-secondary dropdown-toggle bg-white text-dark p-2 loc-drop" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filter.city || 'Select City'}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Mumbai")} >Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Western Mumbai")} >Western Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Central Mumbai")} >Central Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Navi Mumbai")} >Navi Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Thane")} >Thane</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Beyond Thane")} >Beyond Thane</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Pune")} >Pune</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Nashik")} >Nashik</a></li>
                                        </ul>
                                    </div>
                                    <input type="text" className="s-cont-input" placeholder='Location'
                                        value={filter.location}
                                        onChange={handlelocation} />
                                </form>
                                <div className='d-flex align-items-center s-drop'>
                                    <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        {filter.property || 'Property Type'}
                                    </a>
                                    <ul className="dropdown-menu">
                                        {propertyTypes[selectedTab].map((type, index) => (
                                            <li key={index}>
                                                <a
                                                    className="dropdown-item"
                                                    onClick={() => changeproperty(type)}
                                                    href="#"
                                                >
                                                    {type}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className='d-flex align-items-center ms-auto'>
                                    <button className='btn search-btn text-white' onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='s-cont d-flex justify-content-center d-sm-none'>
                        <div className='s-cont-box'>
                            <div className='s-cont-box1 d-flex'>
                                <div onClick={() => changetab('Buy')}
                                    className={`s-itm ${selectedTab === 'Buy' ? 's-itmcol' : ''}`}>Buy</div>
                                <div onClick={() => changetab('Rent')}
                                    className={`s-itm ${selectedTab === 'Rent' ? 's-itmcol' : ''}`}>Rent</div>
                                <div onClick={() => changetab('Plot/Land')}
                                    className={`s-itm ${selectedTab === 'Plot/Land' ? 's-itmcol' : ''}`}>Plot</div>
                                <div onClick={() => changetab('PG')}
                                    className={`s-itm ${selectedTab === 'PG' ? 's-itmcol' : ''}`}>PG</div>
                                <div onClick={() => changetab('Commercial')}
                                    className={`s-itm ${selectedTab === 'Commercial' ? 's-itmcol' : ''}`}>Commercial</div>
                            </div>
                            <div className='s-cont-sbox d-flex p-2'>
                                <form className='d-flex align-items-center justify-content-start ms-2'>
                                    <div className="dropdown d-flex loc-dropdown">
                                        <button className="btn btn-secondary dropdown-toggle bg-white text-dark p-2 loc-drop" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {filter.city || 'Select City'}
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Mumbai")} >Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Western Mumbai")} >Western Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Central Mumbai")} >Central Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Navi Mumbai")} >Navi Mumbai</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Thane")} >Thane</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Beyond Thane")} >Beyond Thane</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Pune")} >Pune</a></li>
                                            <li><a role="button" className="dropdown-item" onClick={() => change1("Nashik")} >Nashik</a></li>
                                        </ul>
                                    </div>
                                    <input type="text" className="s-cont-input" placeholder='Location'
                                        value={filter.location}
                                        onChange={handlelocation} />
                                </form>
                                <div className='d-flex align-items-center ms-auto'>
                                    <button className='btn search-btn text-white' onClick={handleSearch}><FaSearch /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='advbox d-none d-sm-block'>
                    <Swiper
                        direction={'vertical'} // Enables vertical direction
                        pagination={{
                            clickable: true, // Pagination dots will be clickable
                        }}
                        autoplay={{
                            delay: 4000, // Time in milliseconds before the next slide
                            disableOnInteraction: false, // Autoplay will continue even after user interaction
                        }}
                        modules={[Pagination, Autoplay]}  // Include the Pagination module
                        className="mySwiper"
                        style={{
                            height: '387px', // Set the height of the carousel container
                            width: '100%',  // Set the width of the carousel container
                        }}
                    >
                        {/* Slides */}
                        <SwiperSlide style={{ display: 'flex', flexDirection: "column" }}>
                            <div className="card text-bg-dark adv-card" >
                                <img src="https://www.iccsafe.org/wp-content/uploads/bsj/GettyImages-851924668.jpg" className="card-img advbox-img" alt="img" />
                                <div className="card-img-overlay d-flex align-items-end">
                                    <div>
                                        <h5 className="card-title advbox-txt">Silicon Hofe</h5>
                                        <p className="card-text advbox-txt mb-0">Tilak Nagar, Mumbai</p>
                                        <p className="card-text advbox-txt">₹ 25.0 L - 50.0 L</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card text-bg-dark adv-card" >
                                <img src="https://www.footanstey.com/wp-content/uploads/2021/10/office-flats-hotel-buidling-1024x682.jpg" className="card-img advbox-img" alt="img" />
                                <div className="card-img-overlay d-flex align-items-end">
                                    <div>
                                        <h5 className="card-title advbox-txt">Dynamix Group</h5>
                                        <p className="card-text advbox-txt mb-0">Andheri East, Mumbai</p>
                                        <p className="card-text advbox-txt">₹ 1.25 Cr - 2.5 Cr</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide style={{ display: 'flex', flexDirection: "column" }}>
                            <div className="card text-bg-dark adv-card" >
                                <img src="https://www.footanstey.com/wp-content/uploads/2021/10/office-flats-hotel-buidling-1024x682.jpg" className="card-img advbox-img" alt="img" />
                                <div className="card-img-overlay d-flex align-items-end">
                                    <div>
                                        <h5 className="card-title advbox-txt">Dynamix Group</h5>
                                        <p className="card-text advbox-txt mb-0">Andheri East, Mumbai</p>
                                        <p className="card-text advbox-txt">₹ 1.25 Cr - 2.5 Cr</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card text-bg-dark adv-card" >
                                <img src="https://www.iccsafe.org/wp-content/uploads/bsj/GettyImages-851924668.jpg" className="card-img advbox-img" alt="img" />
                                <div className="card-img-overlay d-flex align-items-end">
                                    <div>
                                        <h5 className="card-title advbox-txt">Silicon Hofe</h5>
                                        <p className="card-text advbox-txt mb-0">Tilak Nagar, Mumbai</p>
                                        <p className="card-text advbox-txt">₹ 25.0 L - 50.0 L</p>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>
                </div>
            </div>
            <div className='container-lg container-fluid mt-4 mt-sm-0'>
                <div className='mb-4'><h4>Projects On High Demand</h4></div>
                <div className='d-flex demand-card' style={{ gap: "1rem" }}>
                    <div className="card" style={{ width: "18rem" }}>
                        <img src={build1} className="card-img-top" alt="img" />
                        <div className="card-body">
                            <h6 className='fw-bold mb-0'>Sidhivinayak City</h6>
                            <div className='shead'>by Sidhivinayak Homes</div>
                            <div className='body1'>1,2 BHK Apatments</div>
                            <div className='body2'>Taloja, Navi Mumbai</div>
                            <div className='fw-bold fs-5 mt-2'>₹ 25.0 L - 50.0 L</div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                        <img src={build2} className="card-img-top h-75" alt="img" />
                        <div className="card-body">
                            <h6 className='fw-bold mb-0'>Sidhivinayak City</h6>
                            <div className='shead'>by Sidhivinayak Homes</div>
                            <div className='body1'>1,2 BHK Apatments</div>
                            <div className='body2'>Taloja, Navi Mumbai</div>
                            <div className='fw-bold fs-5 mt-2'>₹ 25.0 L - 50.0 L</div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                        <img src={build1} className="card-img-top" alt="img" />
                        <div className="card-body">
                            <h6 className='fw-bold mb-0'>Sidhivinayak City</h6>
                            <div className='shead'>by Sidhivinayak Homes</div>
                            <div className='body1'>1,2 BHK Apatments</div>
                            <div className='body2'>Taloja, Navi Mumbai</div>
                            <div className='fw-bold fs-5 mt-2'>₹ 25.0 L - 50.0 L</div>
                        </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                        <img src={build2} className="card-img-top h-75" alt="img" />
                        <div className="card-body">
                            <h6 className='fw-bold mb-0'>Sidhivinayak City</h6>
                            <div className='shead'>by Sidhivinayak Homes</div>
                            <div className='body1'>1,2 BHK Apatments</div>
                            <div className='body2'>Taloja, Navi Mumbai</div>
                            <div className='fw-bold fs-5 mt-2'>₹ 25.0 L - 50.0 L</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer handleSearch={handleSearch} handleabout={handleabout} handleblog={handleblog} handlePrivacy={handlePrivacy}/>
        </>
    )
}

export default Home