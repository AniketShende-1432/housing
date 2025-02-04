import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaPhoneAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { GiFamilyHouse } from "react-icons/gi";
import furni from "../../assets/furniture.png";
import earth from "../../assets/earth.png";
import build1 from "../../assets/building1.jpg";
import build2 from "../../assets/building2.webp";
import water from "../../assets/water.png";
import storage from "../../assets/storage.png";
import rain from "../../assets/rain.png";
import electric from "../../assets/electric.png";
import vastu from "../../assets/vastu.png";
import gym from "../../assets/gym.png";
import park from "../../assets/garden.png";
import pool from "../../assets/swim.png";
import club from "../../assets/club.png";
import road from "../../assets/road.png"
import backcard from "../../assets/backcard.png";
import { FaBuilding } from "react-icons/fa";
import Modal from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Product.css'

const Plotpro = () => {
  const location = useLocation();
  const { property } = location.state;
  const base_url = import.meta.env.VITE_BASE_URL;
  const amenimg = {
    'Water Storage': storage,
    'Water Supply': water,
    'Vastu Compliant': vastu,
    'Rain Water Harvesting': rain,
    'Electricity Supply': electric,
    'Pool': pool,
    'Gym': gym,
    'Park/Garden': park,
    'Club': club,
    'Main Road': road,
  }
  const overlookimg ={
    'Pool':pool,
    'Park/Garden':park,
    'Main Road':road,
    'Club':club,
    'Gym':gym
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
          <div className='me-3 fs-5 fw-bold'>₹ {formatPrice(property.price)}</div>
          <div className='ps-3 pt-1 pro-head'> {property.plotArea} {property.areaUnit} Plot/Land  &nbsp;&nbsp;&nbsp;For Sale in {property.locality}, {property.city}</div>
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
            <div className='item-box2 p-3'>
              <div className='d-flex'>
                <div className='card-head d-flex flex-column'>
                  <div className='d-flex'>
                    <label className='head'>{property.locality}, {property.city}</label>
                  </div>
                  <label className='head2'>Plot/Land in {property.locality}, {property.city}</label>
                </div>
                <label className='ms-auto propertyid'>Property ID : {property.propertyId}</label>
              </div>
              <div className='mt-2 d-flex'>
                <div className='d-flex flex-column m-3 ms-0'>
                  <div className='d-flex fw-bold fs-5'>₹ {formatPrice(property.price)}</div>
                  <label className='deposit-price'>{Math.floor(property.price / property.plotArea)}/{property.areaUnit}</label>
                </div>
                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                  <label className='fw-bold fs-6'>{property.plotArea} {property.areaUnit}</label>
                  <label className='mt-1'>Plot Area</label>
                </div>
                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                  <label className='fw-bold fs-6'>Approved By</label>
                  <label className='mt-1'>{property.approvedBy}</label>
                </div>
                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                  <label className='fw-bold fs-6'>Ownership</label>
                  <label className='mt-1'>{property.ownershipType}</label>
                </div>
              </div>
              <div className='d-flex pro-status'>
                <div className='d-flex flex-column'>
                  <label className='fw-bold fs-6'><FaBuilding className='pb-1 fs-5' /> Floors Allowed</label>
                  <label>{property.features.floorAllowed} Floors</label>
                </div>
                <div className='d-flex flex-column'>
                  <label className='fw-bold fs-6'>No Of Open Sides</label>
                  <label>{property.features.openSides}</label>
                </div>
                <div className='d-flex flex-column'>
                  <label className='fw-bold fs-6'>Boundary Wall</label>
                  <label>{property.features.boundaryWall ? 'YES' : "NO"}</label>
                </div>
              </div>
              <div className='mt-3'>
              <button className='btn view-btn me-2' onClick={() => handleViewNumber(property)}>Get Phone No.</button>
              <button className='btn c-btn' onClick={()=>handleSms(property)}><FaPhoneAlt /> Contact Agent</button>
              </div>
            </div>
          </div>
          <div className='pro-detail p-3 mt-3 bg-white' id="detailid">
            <h4>More Details</h4>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Price Breakup</div>
              <div className='col-8 fw-bold fs-5'>₹ {formatPrice(property.price)}</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Address</div>
              <div className='col-8 fw-bold fs-5'>{property.locality}, {property.city}, Maharashtra</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Dimensions</div>
              <div className='col-8 fw-bold fs-5'>({property.dimensions.length} ft) x ({property.dimensions.breadth} ft)</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Floors Allowed for Construction</div>
              <div className='col-8 fw-bold fs-5'>{property.features.floorAllowed} Floors</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>No Of Open Sides</div>
              <div className='col-8 fw-bold fs-5'>{property.features.openSides}</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Ownership</div>
              <div className='col-8 fw-bold fs-5'>{property.ownershipType}</div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 fw-light fs-5'>Approved By</div>
              <div className='col-8 fw-bold fs-5'>{property.approvedBy}</div>
            </div>
            <button className='btn c-btn mt-3'>Contact Agent</button>
          </div>
          <div className='pro-society bg-white mt-3 p-3' id='societyid'>
            <h4>Society</h4>
            <ul className='d-flex mt-2'>
              <li>
                <div className='soc-text'>{property.societyName} CHS</div>
              </li>
            </ul>
            <h4>Amenities</h4>
            {property.amenities && property.amenities.length > 0 ? (
              <div className='mb-3'>
                {Array.from({ length: Math.ceil(property.amenities.length / 4) }, (_, i) => (
                  <div className='row mt-3' key={i}>
                    {property.amenities.slice(i * 4, i * 4 + 4).map((amenity, index) => (
                      <div className='col-3' key={index}>
                        <img src={amenimg[amenity]} alt="img" className='amen-img mb-2' /> {amenity}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <h5>-</h5>
            )}
            <h4>Overlooking</h4>
            {property.overlooking && property.overlooking.length > 0 ? (
              <div>
                {Array.from({ length: Math.ceil(property.overlooking.length / 4) }, (_, i) => (
                  <div className='row mt-3' key={i}>
                    {property.overlooking.slice(i * 4, i * 4 + 4).map((amenity, index) => (
                      <div className='col-3' key={index}>
                        <img src={overlookimg[amenity]} alt="img" className='amen-img mb-2' /> &nbsp;{amenity}
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

export default Plotpro