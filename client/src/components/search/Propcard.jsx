import React from 'react';
import { Link } from 'react-router-dom';
import { FaPhoneAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import backcard from "../../assets/backcard.jpg";
import "./Search.css";
import Pslider from './Pslider';

const Propcard = ({ property, onViewNumber, handleSendsms, handlevisits }) => {
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
            <Link className="nav-link active small" aria-current="page" to="/product" state={{ property }} onClick={() => { handlevisits(property._id, property.type) }} >
                <div className='cardsec d-flex flex-column flex-sm-row bg-white'>
                    <div className='item-box1'>
                        <Pslider propimg={property.images && property.images[0] ? property.images : []} propvideo={property.video || null } cardcss="searchSwiper"/>
                    </div>
                    <div className='item-box2 p-3 pt-2 p-sm-4'>
                        <div className='card-head d-flex flex-column'>
                            <div className='d-flex'>
                                <label className='head d-none d-sm-block'>{property.locality}, {property.city}</label>
                                <label className='head d-sm-none'>{property.bhk} in {property.locality}, {property.city}</label>
                                <div className='fs-4 ms-auto'><FaHeart className='heart' /></div>
                            </div>
                            <label className='head2 d-none d-sm-block'>{property.bhk} in {property.society}</label>
                        </div>
                        <div className='mt-0 mt-sm-2 d-flex'>
                            <div className='d-flex flex-column m-3 mt-0 m-sm-3 ms-0 ms-sm-0'>
                                <label className='fw-bold fs-5 prop-price'>₹ {formatPrice(property.price)}</label>
                                <label className='price'>₹ {Math.floor(property.price / property.carpetArea)}/{property.carpetAreaUnit}</label>
                            </div>
                            <div className='d-flex flex-column m-3 mt-0 m-sm-3 ms-0 ms-sm-0 ps-3 item-bd'>
                                <label className='fw-bold fs-6'>{property.carpetArea} {property.carpetAreaUnit}</label>
                                <label style={{ whiteSpace: "nowrap" }}>Super Build-up Area</label>
                            </div>
                            <div className='d-none d-sm-flex flex-column m-3 ms-0 ps-3 item-bd'>
                                <label className='fw-bold fs-6'>{property.bhk} ({property.features.bathrooms || ''} Baths)</label>
                                <label style={{ whiteSpace: "nowrap" }}>{property.possessionStatus}</label>
                            </div>
                        </div>
                        <div className='d-flex d-sm-none mb-2 ms-0'>
                            <label className='fw-bold fs-6'>{property.bhk} ({property.features.bathrooms || ''} Baths)</label>
                            <label style={{ whiteSpace: "nowrap" }}>&nbsp;| {property.possessionStatus}</label>
                        </div>
                        <div>
                            <button className='btn view-btn me-2' onClick={
                                (e) => {
                                    e.stopPropagation(); // Prevents navigation
                                    e.preventDefault();
                                    onViewNumber(property)
                                }
                            }>View Number</button>
                            <button className='btn c-btn' onClick={
                                (e) => {
                                    e.stopPropagation(); // Prevents navigation
                                    e.preventDefault();
                                    handleSendsms(property)
                                }
                            }><FaPhoneAlt /> Contact</button>
                        </div>
                        <div className='d-none d-sm-flex'>
                            <div className='mt-2'>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star"></span>
                            </div>
                        </div>
                    </div>
                </div></Link>
        </>
    )
}

export default Propcard