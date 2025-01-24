import React from 'react'
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import backcard from "../../assets/backcard.png";
import "./Search.css";

const Rentcard = ({ property }) => {
    const base_url = import.meta.env.VITE_BASE_URL;
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

    return (
        <>
            <Link className="nav-link active small" aria-current="page" to="/rent-product" state={{ property }}>
                <div className='cardsec d-flex bg-white'>
                    <div className='item-box1'>
                        <img src={property.images && property.images[0] ? property.images[0] : backcard} alt="image" className='s-img' />
                    </div>
                    <div className='item-box2 p-4'>
                        <div className='card-head d-flex flex-column'>
                            <div className='d-flex'>
                                <label className='head'>{property.locality}, {property.city}</label>
                                <div className='fs-4 ms-auto'><FaHeart className='heart' /></div>
                            </div>
                            <label className='head2'>{property.bhk} in {property.societyName}</label>
                        </div>
                        <div className='mt-2 d-flex'>
                            <div className='d-flex flex-column m-3 ms-0'>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <label className='fw-bold fs-5 prop-price'>₹ {formatPrice(property.monthlyRent)}</label>&nbsp;
                                    <span>/Month</span>
                                </div>
                                <label className='dep-price'>Deposit ₹ {property.securityDeposit}</label>
                            </div>
                            <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                <label className='fw-bold fs-6'>{property.carpetArea} {property.areaUnit}</label>
                                <label style={{ whiteSpace: "nowrap" }}>Build-up Area</label>
                            </div>
                            <div className='d-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                <label className='fw-bold fs-6'>{property.bhk} ({property.features.bathrooms || ''} Baths)</label>
                                <label style={{ whiteSpace: "nowrap" }}>{property.furnishedType}</label>
                            </div>
                        </div>
                        <div>
                            <button className='btn view-btn me-2'>View Number</button>
                            <button className='btn c-btn'><FaPhoneAlt /> Contact</button>
                        </div>
                        <div className='mt-2'>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                        </div>
                    </div>
                </div></Link>
        </>
    )
}

export default Rentcard