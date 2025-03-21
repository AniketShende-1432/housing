import React, { useEffect, useState, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from "axios";
import './Product.css'
import { FaPhoneAlt } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { GiFamilyHouse } from "react-icons/gi";
import furni from "../../assets/furniture.png";
import area from "../../assets/area.png";
import earth from "../../assets/earth.png";
// import build1 from "../../assets/building1.jpg";
// import build2 from "../../assets/building2.webp";
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
import backcard from "../../assets/backcard.jpg";
import { useSelector } from 'react-redux';
import { coinActions } from '../../store/Slice';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';
import Slider from './Slider';
import { Helmet } from "react-helmet-async";
import Pslider from '../search/Pslider';

const Product = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const balance = useSelector((state) => state.coin.balance);
  const { property } = location.state;
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
  // const modalRef = useRef(null);
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
        <title>Buy Flat,apartment Property</title>
        <meta name="description" content="Find top real estate agents near you for buying a new home. 
        Hire a licensed Realtor and explore affordable 2 BHK apartments in Mumbai suburbs. 
        Discover real estate agent fees, Realtor services, and top real estate agents in Mumbai. 
        Check out affordable housing schemes in Thane under 60 lakhs today!" />
      </Helmet>
      <ToastContainer />
      <div className='container-fluid pro-nav-cont text-nowrap' id='navbar'>
        <div className='d-flex p-1 ps-2 p-sm-3 pb-sm-0'>
          <div className='me-3 fs-5 fw-bold'>₹ {formatPrice(property.price)}</div>
          <div className='ps-3 pt-1 pro-head d-none d-sm-block'>{property.bhk} ({property.features.bathrooms || "-"} Baths) {property.carpetArea} {property.carpetAreaUnit}  &nbsp;&nbsp;&nbsp;For Sale {property.locality}, {property.city}</div>
          <div className='ps-3 pt-1 pro-head d-sm-none'>{property.bhk} {property.carpetArea} {property.carpetAreaUnit}  &nbsp;, {property.locality}, {property.city}</div>
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
          {/* <nav className="navbar navbar-expand-lg">
            <div className="container-fluid pro-cont">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
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
          </nav> */}
        </div>
      </div>
      <div className='container-lg container-fluid d-flex pro-main'>
        <div>
          <div className='card1 d-flex flex-column flex-sm-row mt-4 bg-white' id="overid">
            <div className='item-box1'>
              <Pslider propimg={property.images && property.images[0] ? property.images : []} propvideo={property.video || null } cardcss="productSwiper"/>
            </div>
            <div className='item-box2 p-3'>
              <div className='d-flex'>
                <div className='card-head d-flex flex-column'>
                  <div className='d-flex'>
                    <label className='head'>{property.locality}, {property.city}</label>
                  </div>
                  <label className='head2'>{property.bhk} Flat in {property.locality}, {property.city}</label>
                </div>
                <label className='ms-auto propertyid d-none d-sm-block'>Property ID : {property.propertyId}</label>
              </div>
              <div className='mt-2 d-flex'>
                <div className='d-flex flex-column m-3 ms-0 text-nowrap'>
                  <label className='fw-bold fs-5'>₹ {formatPrice(property.price)}</label>
                  <label className='price'>₹ {Math.floor(property.price / property.carpetArea)}/{property.carpetAreaUnit}</label>
                </div>
                <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd text-nowrap'>
                  <label className='fw-bold fs-6'>{property.carpetArea} {property.carpetAreaUnit}</label>
                  <label>Super Build-up Area</label>
                </div>
                <div className='d-none d-sm-flex flex-column m-3 ms-0 ps-3 item-bd'>
                  <label className='fw-bold fs-6'>{property.bhk} ({property.features.bathrooms || '-'} Baths)</label>
                  <label className='text-nowrap'>{property.possessionStatus}</label>
                </div>
                <div className='d-none d-lg-flex flex-column m-3 ms-0 ps-3 item-bd'>
                  <label className='fw-bold fs-6'>Developer</label>
                  <label className='text-nowrap'>{property.developer || '-'}</label>
                </div>
              </div>
              <div className='d-flex pro-status'>
                <div className='d-flex flex-column d-sm-none'>
                  <label className='fw-bold fs-6'>{property.bhk} ({property.features.bathrooms || '-'} Baths)</label>
                  <label>{property.possessionStatus}</label>
                </div>
                <div className='d-flex flex-column d-lg-none'>
                  <label className='fw-bold fs-6'>Developer</label>
                  <label>{property.developer || '-'}</label>
                </div>
                <div className='d-none d-sm-flex flex-column'>
                  <label className='fw-bold fs-6'><img src={furni} alt="img" className='pro-img me-1 pb-1' />Furnished Status</label>
                  <label>{property.furnishedType}</label>
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
              <div className='col-5 col-sm-4 fw-light fs-5'>Furnishing</div>
              <div className='col-7 col-sm-8 fw-bold fs-5'>{property.furnishedType}</div>
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
            <div className='soc-text'>{property.society} CHS</div>
            <ul className='d-flex mt-2 flex-wrap'>
              <li>
                <div><img src={area} alt="img" className='pro-img me-1 pb-1' />Total Occupied Area</div>
                <div className='fw-bold'>{property.societyArea || '-'} {property.societyAreaUnit}</div>
              </li>
              <li className='li-soc'>
                <div className='d-flex'>
                  <div className='me-1'><GiFamilyHouse /></div><div className='soc-icon-list'>Project Details</div>
                </div>
                <div className='fw-bold'>1 Building</div>
                <div className='fw-bold'>{property.features.totalFloors || '-'} Floors</div>
              </li>
              <li>
                <div><img src={earth} alt="img" className='pro-img me-1 pb-1' />Configuration</div>
                <div className='fw-bold'>{property.bhk}</div>
                <div className='fw-bold'>{property.features.bathrooms || '-'} Bathroom</div>
                <div className='fw-bold'>{property.features.balconies} Balcony</div>
              </li>
              <li className='li-soc'>
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
          <div className='pro-amenities bg-white mt-3 p-3 d-sm-none'>
            <h4>Amenities</h4>
            {property.amenities && property.amenities.length > 0 ? (
              <div>
                {Array.from({ length: Math.ceil(property.amenities.length / 2) }, (_, i) => (
                  <div className='row mt-3' key={i}>
                    {property.amenities.slice(i * 2, i * 2 + 2).map((amenity, index) => (
                      <div className='col-6 text-nowrap' key={index}>
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
            <Slider />
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
              <div className="card p-2 m-2 d-flex flex-column align-items-center loan-card">
                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/177_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                <div className="card-body p-2">
                  <p className="card-text fw-bold">LIC Housing Finance</p>
                </div>
              </div>
              <div className="card p-2 m-2 d-flex flex-column align-items-center loan-card">
                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/91_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                <div className="card-body p-2">
                  <p className="card-text fw-bold">Bank of India</p>
                </div>
              </div>
              <div className="card p-2 m-2 d-flex flex-column align-items-center loan-card">
                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/249_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                <div className="card-body p-2">
                  <p className="card-text fw-bold">Yes Bank</p>
                </div>
              </div>
              <div className="card p-2 m-2 d-flex flex-column align-items-center loan-card">
                <img src="https://mbprodimages.s3.ap-south-1.amazonaws.com/images/homeloanData/bankLogo/205_Logo.png" className="card-img-top w-50 h-50" alt="img" />
                <div className="card-body p-2">
                  <p className="card-text fw-bold">Reliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="modal owner-info" ref={modalRef} tabindex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Owner Information</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p className='mb-0'><strong>Name:</strong> {owner.name}</p>
              <p className='mb-0'><strong>Phone:</strong> +91 {owner.phone}</p>
              <p className='mb-0'><strong>Email:</strong> {owner.email}</p>
            </div>
          </div>
        </div>
      </div> */}
      {show && <Modal owner={owner} show={show} setShow={setshow} />}
    </div>
  )
}

export default Product