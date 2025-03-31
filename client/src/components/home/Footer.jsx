import React from 'react';
import { Link } from 'react-router-dom';
import face from '../../assets/facebook.png';
import twit from '../../assets/twitter.png';
import insta from '../../assets/instagram.png';
import linkd from '../../assets/linkedin.png';
import './Home.css';

const Footer = ({handleSearch,handleabout,handleblog, handlePrivacy}) => {
    return (
        <>
            <footer className='footer mt-4'>
                <div className='row w-100 p-1 p-sm-3'>
                    <section className='d-flex flex-column col-sm-8 ps-sm-4'>
                        <div className='company-n fw-bold fs-2 ps-1 ps-sm-0'>ShelterBIG</div>
                        <section className='container text-white ms-sm-2'>
                            <div className='row'>
                                <div className='col-6 col-sm-4'>
                                    <div className='fw-bold fs-5 foot-head'>Our Services</div>
                                    <div className='service-btn' onClick={handleSearch}>Search Property</div>
                                    <div><Link className="nav-link active small" aria-current="page" to="/profile">Post Property</Link></div>
                                    <div>Buy Property</div>
                                    <div>Rent Property</div>
                                </div>
                                <div className='col-6 col-sm-4'>
                                    <div className='fw-bold fs-5 foot-head'>Company</div>
                                    <div className='service-btn' onClick={handleabout}>About Us</div>
                                    <div>Contact Us</div>
                                    <div className='service-btn' onClick={handleblog}>Blogs</div>
                                </div>
                                <div className='col-6 col-sm-4 mt-2 mt-sm-0'>
                                    <div className='fw-bold fs-5 foot-head'>Help</div>
                                    <div>Support</div>
                                    <div>FAQs</div>
                                    <div className='service-btn' onClick={handlePrivacy}>Privacy Policy</div>
                                </div>
                                <div className='text-white col-6 mt-sm-2 d-sm-none'>
                                    <div className='fw-bold fs-5'>Contact Us</div>
                                    <div className='text-nowrap'>+91 1234567890</div>
                                    <div className='text-nowrap'>ShelterBIG@gmail.com</div>
                                    <div className='fw-bold fs-5 mt-2'>Follow Us</div>
                                    <div className='row'>
                                        <div className='col-3 col-sm-2 col-lg-2'><img src={face} alt="img" className='follow-icon' /></div>
                                        <div className='col-3 col-sm-2 col-lg-2'><img src={twit} alt="img" className='follow-icon border' /></div>
                                        <div className='col-3 col-sm-2 col-lg-2'><img src={insta} alt="img" className='follow-icon' /></div>
                                        <div className='col-3 col-sm-2 col-lg-2'><img src={linkd} alt="img" className='follow-icon' /></div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </section>
                    <div className='text-white col-sm-4 mt-sm-2 d-none d-sm-block'>
                        <div className='fw-bold fs-5'>Contact Us</div>
                        <div>Toll Free - 1800 41 99099</div>
                        <div>Email : ShelterBIG@gmail.com</div>
                        <div className='fw-bold fs-5 mt-2'>Follow Us</div>
                        <div className='row'>
                            <div className='col-3 col-sm-2 col-lg-1'><img src={face} alt="img" className='follow-icon' /></div>
                            <div className='col-3 col-sm-2 col-lg-1 ms-lg-3'><img src={twit} alt="img" className='follow-icon border' /></div>
                            <div className='col-3 col-sm-2 col-lg-1 ms-lg-3'><img src={insta} alt="img" className='follow-icon' /></div>
                            <div className='col-3 col-sm-2 col-lg-1 ms-lg-3'><img src={linkd} alt="img" className='follow-icon' /></div>
                        </div>
                    </div>
                </div>
                <section className='text-white text-align-center pb-2 pt-2 border-top mt-2'>
                    <div className='text-center'>Copyright © 2025 ShelterBIG. All Rights Reserved</div>
                </section>
            </footer>
        </>
    )
}

export default Footer