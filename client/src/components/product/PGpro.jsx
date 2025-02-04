import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Product.css'
import { FaPhoneAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { GiFamilyHouse } from "react-icons/gi";
import furni from "../../assets/furniture.png";
import earth from "../../assets/earth.png";
import build1 from "../../assets/building1.jpg";
import build2 from "../../assets/building2.webp";
import Sofa from "../../assets/sofa.png";
import Washing from "../../assets/wash.png";
import lift from "../../assets/lift.png";
import cctv from "../../assets/cctv.png";
import bed from "../../assets/bed.png";
import fridge from "../../assets/fridge.png";
import aircond from "../../assets/air-conditioner.png";
import gym from "../../assets/gym.png";
import garden from "../../assets/garden.png";
import kidsarea from "../../assets/kidsarea.png";
import cupboard from "../../assets/cupboard.png";
import tv from "../../assets/tv.png";
import geyser from "../../assets/geyser.png";
import swim from "../../assets/swim.png";
import water from "../../assets/water.png";
import backcard from "../../assets/backcard.png";
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PGpro = () => {
    const location = useLocation();
    const { property } = location.state;
    const base_url = import.meta.env.VITE_BASE_URL;
    const amenimg = {
        'Sofa': Sofa,
        'Washing Machine': Washing,
        'Lift': lift,
        'CCTV': cctv,
        'Bed': bed,
        'Fridge': fridge,
        'AC': aircond,
        'Gym': gym,
        'Garden': garden,
        'Kides Area': kidsarea,
        'Cupboard': cupboard,
        'TV': tv,
        'Geyser': geyser,
        'Swimming Pool': swim,
        'Regular Water Supply': water,
    }
    const [owner, setowner] = useState({});
    const [show,setshow] = useState(false);

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
        const userId = property.user;
        const base_url = import.meta.env.VITE_BASE_URL;
        try {
            const response = await axios.get(`${base_url}/api/v3/user/${userId}`);
            setowner(response.data);  // Store the fetched user data in state (you need to define this state)
            setshow(true);
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to fetch user data');
        }
    };
    const handleSms = async (property) => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const data = {
            type: property.type,
            propertyId: property.propertyId,
            userId: property.user,
        }
        try {
            await axios.post(`${base_url}/api/v3/sendsms`, data).then((response) => {
                if (response.status === 200) {
                    toast.success('Information is send to Owner, Please wait for reply !');
                }
                else {
                    toast.error(response.data.message);
                }
            })
        } catch (error) {
            console.error('Error sending contact SMS:', error);
            alert('Failed to send SMS');
        }
    }

    return (
        <div style={{ backgroundColor: "aliceblue" }}>
            <ToastContainer />
            <div className='container-fluid pro-nav-cont' id='navbar'>
                <div className='d-flex p-3 pb-0'>
                    <div className='me-3 d-flex justify-content-center align-items-center'>
                        <label className='fs-5 fw-bold'>₹ {formatPrice(property.monthlyRent)}</label>&nbsp;
                        <span>/Bed</span>
                    </div>
                    <div className='ps-3 pt-1 pro-head'>{property.features.bedrooms === '' ? '-' : property.features.bedrooms} BHK {property.propertyType} in {property.locality}, {property.city}  &nbsp;&nbsp;&nbsp; {property.roomType} Rooms for {property.availableFor}</div>
                </div>
                <div>
                    <nav class="navbar navbar-expand-lg bg-wite">
                        <div class="container-fluid pro-cont">
                            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span class="navbar-toggler-icon"></span>
                            </button>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav product-nav">
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
                    </nav>
                </div>
            </div>
            <div className='container d-flex pro-main'>
                <div>
                    <div className='card1 d-flex mt-4 bg-white' id="overid">
                        <div className='item-box1'>
                            <img src={property.images && property.images[0] ? property.images[0] : backcard} alt="image" className='rent-s-img' />
                        </div>
                        <div className='item-box2 p-3 ps-4'>
                            <div className='d-flex'>
                                <div className='card-head d-flex flex-column'>
                                    <div className='d-flex'>
                                        <label className='head'>{property.locality}, {property.city}</label>
                                    </div>
                                    <label className='head2'>PG in {property.locality}, {property.city}</label>
                                </div>
                                <label className='ms-auto propertyid'>Property ID : {property.propertyId}</label>
                            </div>
                            <div className='mt-2 d-flex'>
                                <div className='d-flex flex-column m-3 ms-0'>
                                    <div className='d-flex justify-content-center align-items-center'>
                                        <label className='fw-bold fs-5'>₹ {formatPrice(property.monthlyRent)}</label>&nbsp;
                                        <span>/Bed</span>
                                    </div>
                                    <label className='deposit-price'>Deposit ₹ {property.securityDeposit}</label>
                                </div>
                                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>{property.carpetArea} {property.areaUnit}</label>
                                    <label className='mt-1'>Carpet Area</label>
                                </div>
                                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>Room Type</label>
                                    <label className='mt-1'>{property.roomType}</label>
                                </div>
                                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                    <label className='fw-bold fs-6'>Available From</label>
                                    <label className='mt-1'>{new Date(property.availableFrom).toLocaleDateString()}</label>
                                </div>
                            </div>
                            <div className='d-flex pro-status'>
                                <div className='d-flex flex-column'>
                                    <label className='fw-bold fs-6'><img src={furni} alt="img" className='pro-img me-1 pb-1' />Furnished Status</label>
                                    <label>{property.furnishedType}</label>
                                </div>
                                <div className='d-flex flex-column'>
                                    <label className='fw-bold fs-6'>Age of Property</label>
                                    <label>{property.features.ageOfProperty?.trim() === '' ? '-' : property.features.ageOfProperty} years</label>
                                </div>
                                <div className='d-flex flex-column'>
                                    <label className='fw-bold fs-6'>Available For</label>
                                    <label> {property.availableFor}</label>
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
                            <div className='col-4 fw-light fs-5'>Rent Value</div>
                            <div className='col-8 d-flex align-items-center'>
                                <label className='fw-bold fs-5'>₹ {formatPrice(property.monthlyRent)}</label>&nbsp;
                                <span>/Bed</span>
                            </div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Security Deposit</div>
                            <div className='col-8 fw-bold fs-5'>₹ {formatPrice(property.securityDeposit)}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Address</div>
                            <div className='col-8 fw-bold fs-5'>{property.locality}, {property.city}, Maharashtra</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Capacity (No Of Beds)</div>
                            <div className='col-8 fw-bold fs-5'>{property.capacity}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Duration of Agreement</div>
                            <div className='col-8 fw-bold fs-5'>{property.durationOfAgreement?.trim() === '' ? '-' : property.durationOfAgreement}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Available For</div>
                            <div className='col-8 fw-bold fs-5'>{property.availableFor}</div>
                        </div>
                        <div className='row mt-3'>
                            <div className='col-4 fw-light fs-5'>Age of Property</div>
                            <div className='col-8 fw-bold fs-5'>{property.features.ageOfProperty?.trim() === '' ? '-' : property.features.ageOfProperty} years</div>
                        </div>
                        <button className='btn c-btn mt-3'>Contact Agent</button>
                    </div>
                    <div className='pro-society bg-white mt-3 p-3' id='societyid'>
                        <h4>Society</h4>
                        <ul className='d-flex mt-2'>
                            <li>
                                <div className='soc-text'>{property.societyName} CHS</div>
                            </li>
                            <li>
                                <div className='d-flex'>
                                    <div className='me-1'><GiFamilyHouse /></div><div className='soc-icon-list'>Project Details</div>
                                </div>
                                <div className='fw-bold'>1 Building</div>
                                <div className='fw-bold'>{property.features.totalFloors || '-'} Floors</div>
                            </li>
                            <li>
                                <div><img src={earth} alt="img" className='pro-img me-1 pb-1' />Configuration</div>
                                <div className='fw-bold'>{property.features.bedrooms || '-'} BHK</div>
                                <div className='fw-bold'>{property.features.bathrooms || '-'} Bathroom</div>
                                <div className='fw-bold'>{property.features.balconies || '-'} Balcony</div>
                            </li>
                            <li>
                                <div className='d-flex'>
                                    <div className='me-1'><FaHouse /></div><div className='soc-icon-list'>Property types</div>
                                </div>
                                <div className='fw-bold'>{property.propertyType}</div>
                            </li>
                        </ul>
                    </div>
                    <div className='pro-amenities bg-white mt-3 p-3'>
                        <h4>Amenities</h4>
                        {property.amenities && property.amenities.length > 0 ? (
                            <div>
                                {Array.from({ length: Math.ceil(property.amenities.length / 4) }, (_, i) => (
                                    <div className='row mt-3' key={i}>
                                        {property.amenities.slice(i * 4, i * 4 + 4).map((amenity, index) => (
                                            <div className='col-3' key={index}>
                                                <img src={amenimg[amenity]} alt="img" className='amen-img mb-1' /> {amenity}
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
                        <div id="carouselExample" class="carousel carousel-dark slide">
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
                        </div>
                    </div>
                </div>
                <div className='pt-2'>
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
            {show &&  <Modal owner={owner} show={show} setShow={setshow}/>}
        </div>
    )
}

export default PGpro