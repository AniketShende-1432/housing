import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Product.css'
import { FaPhoneAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { GiFamilyHouse } from "react-icons/gi";
import proper from "../../assets/property.png";
import earth from "../../assets/earth.png";
import build1 from "../../assets/building1.jpg";
import build2 from "../../assets/building2.webp";
import water from "../../assets/storage.png";
import rain from "../../assets/rain.png";
import vastu from "../../assets/vastu.png";
import waste from "../../assets/waste.png";
import { BiCctv } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { GiPowerGenerator } from "react-icons/gi";
import { FaRoad } from "react-icons/fa";
import { GiElevator } from "react-icons/gi";
import backcard from "../../assets/backcard.jpg";
import Modal from './Modal';
import { useSelector } from 'react-redux';
import { coinActions } from '../../store/Slice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Slider from './Slider';
import { Helmet } from "react-helmet-async";
import Pslider from '../search/Pslider';

const Commpro = () => {
    const location = useLocation();
    const { property } = location.state;
    const dispatch = useDispatch();
    const balance = useSelector((state) => state.coin.balance);
    const base_url = import.meta.env.VITE_BASE_URL;
    const amenimg = {
        'Rain Water Harvesting': rain,
        'Water Storage': water,
        'Waste Disposal': waste,
        'Vaastu Compliant': vastu,
    }
    const amenityIcon = {
        'Lift': <GiElevator className='mb-1 fs-5' />,
        'Shooping Centre': <FaShoppingCart className='mb-1 fs-5' />,
        'Grade A Building': <FaBuilding className='mb-1 fs-5' />,
        'Power Backup': <GiPowerGenerator className='mb-1 fs-5' />,
        'Main Road': <FaRoad className='mb-1 fs-5' />,
        'CCTV': <BiCctv className='mb-1 fs-5' />,
        // Add more icons as needed
    };
    const [owner, setowner] = useState({});
    const [show, setshow] = useState(false);

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(1)} Cr`; // Crores with 2 decimal places
        } else if (price >= 100000) {
            return `${(price / 100000).toFixed(1)} Lac`; // Lacs with 2 decimal places
        } else if (price >= 1000) {
            return `${(price / 1000).toFixed(1)} K`; // Thousands with 2 decimal places
        } else {
            return price.toString(); // Less than 1000, no formatting needed
        }
    };
    const handleOverviewClick = (value) => {
        document.getElementById(value).scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the section
    };

    useEffect(() => {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Scrolling down, hide the navbar
                navbar.classList.remove('show');
            } else {
                // Scrolling up, show the navbar
                navbar.classList.add('show');
            }

            lastScrollY = currentScrollY;
        };

        const handleMouseMove = (e) => {
            if (e.clientY <= 110) {
                // Cursor near the top of the screen, show navbar
                navbar.classList.add('show');
            } else {
                // Cursor away from the top, hide navbar
                navbar.classList.remove('show');
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    const handleViewNumber = async (property) => {
        if (balance < 1) {
            toast.info('Not enough coins to View Number!');
        } else {
            const userId = property.user;
            const base_url = import.meta.env.VITE_BASE_URL;
            try {
                const response = await axios.get(`${base_url}/api/v3/user/${userId}`);
                if (response.status === 200) {
                    await axios.put(`${base_url}/api/v1/update-coins`, { coinsChange: -1 }, { withCredentials: true }).then((response) => {
                        dispatch(coinActions.setBalance(response.data.coins));
                    });
                }
                setowner(response.data);  // Store the fetched user data in state (you need to define this state)
                setshow(true);
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Failed to fetch user data');
            }
        }
    };

    const handleSms = async (property) => {
        if (balance < 1) {
            toast.info('Not enough coins to View Number!');
        } else {
            const base_url = import.meta.env.VITE_BASE_URL;
            const data = {
                type: property.type,
                propertyId: property.propertyId,
                userId: property.user,
            }
            try {
                const response = await axios.post(`${base_url}/api/v3/sendsms`, data);
                if (response.status === 200) {
                    toast.success('Information is send to Owner, Please wait for reply !');
                    const res = await axios.put(`${base_url}/api/v1/update-coins`, { coinsChange: -1 }, { withCredentials: true });
                    dispatch(coinActions.setBalance(res.data.coins));
                }
                else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error sending contact SMS:', error);
                alert('Failed to send SMS');
            }
        }
    }

    return (
        <div style={{ backgroundColor: "aliceblue" }}>
            <Helmet>
                <title>Commercial Property - Office,Shop,Godham,Industry</title>
                <meta name="description" content="Find the best commercial property for sale and rent, including office spaces, shops, and commercial buildings. 
                Explore commercial property for rent near me, office space for rent, business property for sale, and commercial real estate investment opportunities.
                Discover prime locations for commercial property in Mumbai, Thane, and Navi Mumbai." />
            </Helmet>
            <ToastContainer />
            <div className='container-fluid pro-nav-cont' id='navbar'>
                <div className='d-flex p-3 pb-0 text-nowrap'>
                    <div className='me-3 fs-5 fw-bold'>₹ {formatPrice(property.price)}</div>
                    <div className='ps-3 pt-1 pro-head d-none d-sm-block'>{property.carpetArea} {property.areaUnit}  &nbsp;&nbsp;&nbsp;For Sale {property.propertyType} in {property.locality}, {property.city}</div>
                    <div className='ps-3 pt-1 pro-head d-sm-none'>{property.carpetArea} {property.areaUnit}  &nbsp;For Sale {property.propertyType}</div>
                </div>
                <div>
                    <ul class="nav product-nav p-2">
                        <li className="nav-item">
                            <button onClick={() => handleOverviewClick("overid")}>Overview</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => handleOverviewClick("detailid")}>More Details</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => handleOverviewClick("societyid")}>Society</button>
                        </li>
                        <li className="nav-item">
                            <button onClick={() => handleOverviewClick("recommid")}>Recommendation</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='container-lg container-fluid d-flex pro-main'>
                <div>
                    <div className='card1 d-flex flex-column flex-sm-row mt-4 bg-white' id="overid">
                        <div className='item-box1'>
                            {/* <img src={property.images && property.images[0] ? property.images[0] : backcard} alt="image" className='comm-s-img' /> */}
                            <Pslider propimg={property.images && property.images[0] ? property.images : []} propvideo={property.video || null } cardcss="productSwiper"/>
                        </div>
                        <div className='item-box2 p-3'>
                            <div className='d-flex'>
                                <div className='card-head d-flex flex-column'>
                                    <div className='d-flex'>
                                        <label className='head'>{property.locality}, {property.city}</label>
                                    </div>
                                    <label className='head2'> {property.propertyType} in {property.locality}, {property.city}</label>
                                </div>
                                <label className='ms-auto propertyid d-none d-sm-block'>Property ID : {property.propertyId}</label>
                            </div>
                            <div className='mt-2 d-flex'>
                                <div className='d-flex flex-column ms-0 m-2 m-sm-3 ms-sm-0'>
                                    <label className='fw-bold fs-5'>₹ {formatPrice(property.price)}</label>
                                    <label className='price'>₹ {Math.floor(property.price / property.carpetArea)}/{property.areaUnit}</label>
                                </div>
                                <div className='d-flex flex-column ms-0 m-2 m-sm-3 ms-sm-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>{property.carpetArea} {property.areaUnit}</label>
                                    <label>Carpet Area</label>
                                </div>
                                <div className='d-none d-sm-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>Possession Stauts</label>
                                    <label>{property.possessionStatus}</label>
                                </div>
                                <div className='d-flex d-sm-none d-lg-flex flex-column ms-0 m-2 m-sm-3 ms-sm-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>Ownership</label>
                                    <label>{property.ownership}</label>
                                </div>
                            </div>
                            <div className='d-flex pro-status'>
                                <div className='d-none d-sm-flex d-lg-none flex-column'>
                                    <label className='fw-bold fs-6'>Ownership</label>
                                    <label>{property.ownership}</label>
                                </div>
                                <div className='d-flex flex-column d-sm-none'>
                                    <label className='fw-bold fs-6'>Possession Stauts</label>
                                    <label>{property.possessionStatus}</label>
                                </div>
                                <div className='d-flex flex-column'>
                                    <label className='fw-bold fs-6'><img src={proper} alt="img" className='pro-img me-1 pb-1' />Property Type</label>
                                    <label>{property.propertyType}</label>
                                </div>
                                <div className='d-none d-sm-flex flex-column'>
                                    <label className='fw-bold fs-6'>Age of Property</label>
                                    <label>{property.features.ageOfProperty ?? '-'} years</label>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <button className='btn view-btn me-2' onClick={() => handleViewNumber(property)}>Get Phone No.</button>
                                <button className='btn c-btn' onClick={() => handleSms(property)}><FaPhoneAlt /> Contact Agent</button>
                            </div>
                        </div>
                    </div>
                    <div className='pro-detail p-3 mt-3 bg-white' id="detailid">
                        <h4>More Details</h4>
                        <div className='row mt-3'>
                            <div className='col-5 col-sm-4 fw-light fs-5'>Price Breakup</div>
                            <div className='col-7 col-sm-8 fw-bold fs-5'>₹ {formatPrice(property.price)}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-5 col-sm-4 fw-light fs-5'>Address</div>
                            <div className='col-7 col-sm-8 fw-bold fs-5'>{property.locality}, {property.city}, Maharashtra</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-5 col-sm-4 fw-light fs-5'>Ownership</div>
                            <div className='col-7 col-sm-8 fw-bold fs-5'>{property.ownership}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-5 col-sm-4 fw-light fs-5'>Status</div>
                            <div className='col-7 col-sm-8 fw-bold fs-5'>{property.possessionStatus}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-5 col-sm-4 fw-light fs-5'>Age of Property</div>
                            <div className='col-7 col-sm-8 fw-bold fs-5'>{property.features.ageOfProperty ?? '-'} years</div>
                        </div>
                        <button className='btn c-btn mt-3'>Contact Agent</button>
                    </div>
                    <div className='pro-society bg-white mt-3 p-3' id='societyid'>
                        <h4>Society</h4>
                        <ul className='d-flex mt-2 flex-wrap'>
                            <li>
                                <div className='soc-text'>{property.projectName} CHS</div>
                            </li>
                            <li className='ms-auto ms-sm-0'>
                                <div className='d-flex'>
                                    <div className='me-1'><GiFamilyHouse /></div><div className='soc-icon-list'>Project Details</div>
                                </div>
                                <div className='fw-bold'>1 Building</div>
                                <div className='fw-bold'>{property.features.totalFloors || '-'} Floors</div>
                            </li>
                            <li>
                                <div><img src={earth} alt="img" className='pro-img me-1 pb-1' />Configuration</div>
                                <div className='fw-bold'>{property.bhk}</div>
                                <div className='fw-bold'>{property.features.washroom || '-'} Washroom</div>
                                <div className='fw-bold'>Floor no {property.features.floorNumber || '-'}</div>
                            </li>
                            <li className='ms-auto ms-sm-0'>
                                <div className='d-flex'>
                                    <div className='me-1'><FaHouse /></div><div className='soc-icon-list'>Property types</div>
                                </div>
                                <div className='fw-bold'>{property.propertyType}</div>
                            </li>
                        </ul>
                    </div>
                    <div className='pro-amenities bg-white mt-3 p-3 d-none d-sm-block'>
                        <h4>Amenities</h4>
                        {property.amenities && property.amenities.length > 0 ? (
                            <div>
                                {Array.from({ length: Math.ceil(property.amenities.length / 4) }, (_, i) => (
                                    <div className='row mt-3' key={i}>
                                        {property.amenities.slice(i * 4, i * 4 + 4).map((amenity, index) => (
                                            <div className='col-3' key={index}>
                                                {amenimg[amenity] ? (
                                                    <div>
                                                        <img src={amenimg[amenity]} alt={amenity} className='amen-img mb-1' /> {amenity}
                                                    </div>
                                                ) : (
                                                    // Render the fallback React icon if no image is found
                                                    <div>
                                                        {amenityIcon[amenity]} {amenity}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h5>-</h5>
                        )}
                    </div>
                    <div className='pro-amenities bg-white mt-3 p-3 d-sm-none'>
                        <h4>Amenities</h4>
                        {property.amenities && property.amenities.length > 0 ? (
                            <div>
                                {Array.from({ length: Math.ceil(property.amenities.length / 2) }, (_, i) => (
                                    <div className='row mt-3' key={i}>
                                        {property.amenities.slice(i * 2, i * 2 + 2).map((amenity, index) => (
                                            <div className='col-6' key={index}>
                                                {amenimg[amenity] ? (
                                                    <div>
                                                        <img src={amenimg[amenity]} alt={amenity} className='amen-img mb-1' /> {amenity}
                                                    </div>
                                                ) : (
                                                    // Render the fallback React icon if no image is found
                                                    <div>
                                                        {amenityIcon[amenity]} {amenity}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h5>-</h5>
                        )}
                    </div>
                    <div className='mt-4' id='recommid'>
                        <h5>Similar Properties</h5>
                        <Slider />
                        {/* <div id="carouselExample" class="carousel carousel-dark slide">
                            <div class="carousel-inner p-3">
                                <div class="carousel-item active">
                                    <div className='card-wrapper d-flex'>
                                        <div className="card recomm-card" style={{ width: "18rem" }}>
                                            <img src={build1} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                        <div className="card recomm-card" style={{ width: "18rem" }}>
                                            <img src={build2} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn  view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                        <div className="card recomm-card me-0" style={{ width: "18rem" }}>
                                            <img src={build1} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn  view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="carousel-item">
                                    <div className='card-wrapper d-flex'>
                                        <div className="card recomm-card" style={{ width: "18rem" }}>
                                            <img src={build1} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn  view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                        <div className="card recomm-card" style={{ width: "18rem" }}>
                                            <img src={build2} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn  view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                        <div className="card recomm-card me-0" style={{ width: "18rem" }}>
                                            <img src={build1} className="card-img-top h-50" alt="img" />
                                            <div className="card-body">
                                                <h5 className="card-title">₹ 2.5 Cr, 2BHK</h5>
                                                <div className='fw-bold'>Om Palace</div>
                                                <div>Vile Parle East, Mumbai</div>
                                                <a href="#" className="btn  view-btn mt-2">Enquire Now</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div> */}
                    </div>
                </div>
                <div className='pt-2 d-none d-lg-block'>
                    <div className='pro-contact d-flex flex-column p-3 mt-3 bg-white'>
                        <label className='fw-bold fs-5'>Contact Agent</label>
                        <label className='pro-no mt-2'>+91-98XXXXXXXX</label>
                        <button className='btn c-btn mt-2'>Get Phone No.</button>
                    </div>
                    <div className='mt-4 d-flex flex-column align-items-center'>
                        <div><h5>Home Loans Offers</h5></div>
                        <div>
                            <div className="card p-2 m-2 d-flex flex-column align-items-center">
                                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/177_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                                <div className="card-body p-2">
                                    <p className="card-text fw-bold">LIC Housing Finance</p>
                                </div>
                            </div>
                            <div className="card p-2 m-2 d-flex flex-column align-items-center">
                                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/91_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                                <div className="card-body p-2">
                                    <p className="card-text fw-bold">Bank of India</p>
                                </div>
                            </div>
                            <div className="card p-2 m-2 d-flex flex-column align-items-center">
                                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/249_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                                <div className="card-body p-2">
                                    <p className="card-text fw-bold">Yes Bank</p>
                                </div>
                            </div>
                            <div className="card p-2 m-2 d-flex flex-column align-items-center">
                                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/205_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                                <div className="card-body p-2">
                                    <p className="card-text fw-bold">Reliance</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {show && <Modal owner={owner} show={show} setShow={setshow} />}
        </div>
    )
}

export default Commpro