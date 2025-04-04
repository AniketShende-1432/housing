import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/Slice';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet-async";
import free from '../../assets/free.gif';

const Navbar = (props) => {
    const [visibleSection, setVisibleSection] = useState('');
    const handleSectionClick = (section) => {
        setVisibleSection(prev => prev === section ? '' : section); // Toggle visibility
    };
    const isLoggedin = useSelector((state) => state.auth.isLoggedIn);
    const dispatch = useDispatch();
    const logout = async () => {
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.post(`${base_url}/api/v1/logout`, {}, { withCredentials: true });
            if (response.status === 200) {
                dispatch(authActions.logout());
                toast.success("Log Out Successfully");
            }
        } catch (error) {
            toast.error("Failed to log out. Please try again.");
            console.error("Logout error:", error); // Log error for debugging
        }
    }
    console.log(props);
    useEffect(() => {
        // Check if login toast should be shown
        if (sessionStorage.getItem("showLoginToast") === "true") {
            toast.success("Login successful!", {
                onClose: () => {
                    sessionStorage.removeItem("showLoginToast");
                },
            });
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Housing</title>
                <meta name="description" content="Find your dream home with the top real estate sites! Explore online flat sales, popular property platforms, and top-rated real estate websites for buying and selling properties with ease." />
                <meta name="keywords" content="online flat sale,site for buying house,top real estate sites,top property sites,top rated real estate websites,good property sites
                ,popular real estate sites" />
            </Helmet>
            <nav className={`navbar navbar-expand-lg ${props.back} ${props.cname} border cont`}>
                <div className="container-lg d-flex justify-content-lg-around justify-content-between">
                    <a role="button" className="navbar-brand logo ms-md-4 ms-lg-0 ms-2">ShelterBIG</a>
                    <button className="navbar-toggler me-md-4 me-lg-0 me-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item ms-1">
                                <Link className="nav-link nav-nlink text-sm-dark active text-white small" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item ms-2">
                                <a role="button" className="nav-link nav-nlink text-white" onClick={() => handleSectionClick('buy-box')}>ForBuyers</a>
                            </li>
                            <li className="nav-item ms-2">
                                <a role="button" className="nav-link nav-nlink text-white" onClick={() => handleSectionClick('own-box')}>ForOwners</a>
                            </li>
                            <li className='nav-item'>
                                <a role="button" className="nav-link nav-nlink text-white ms-2" onClick={() => handleSectionClick('login-box')} style={{ cursor: "pointer" }}>Login</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            {visibleSection === 'login-box' && (<div className={`${props.login === 'login-box2' ? 'login-box2' : 'login-box'} p-2`}>
                <div className='login-link'>
                    <div className='text-secondary q-link'>Quick Links</div>
                    <div className='fw-bold p-1 log-links'>My Activity</div>
                    <div className='fw-bold p-1 log-links'><Link className="nav-link active small" aria-current="page" to="/v-response">View Response</Link></div>
                    <div className='fw-bold p-1 log-links'><Link className="nav-link active small" aria-current="page" to="/manage">Manage Properties</Link></div>
                    <div className='fw-bold p-1 log-links'><Link className="nav-link active small" aria-current="page" to="/profile">My Profile</Link></div>
                </div>
                {!isLoggedin && (
                    <div className='p-2 mt-3 log-box'>
                        <button type="button" class="btn text-white w-100 log-btn mt-2"><Link className="nav-link active small" aria-current="page" to="/login">Login</Link></button>
                        <div className='sign-txt d-flex justify-content-around ms-1 me-1 mt-3'>New to Housing ?<Link className="nav-link active small signcol fw-bold" aria-current="page" to="/signup"> Sign up</Link></div>
                    </div>
                )}
                {isLoggedin && (
                    <div className='p-2 mt-3 log-box'>
                        <button type="button" class="btn text-white w-100 log-btn mt-2" onClick={logout}>Log Out</button>
                    </div>
                )}
            </div>
            )}
            {visibleSection === 'buy-box' && (
                <div className='buy-box p-2'>
                    <div className='fw-bold buy-bhead'>Buy Section</div>
                    <ul className='buy-ul'>
                        <li>Buy Flat</li>
                        <li>Plot/Land</li>
                        <li>Commercial</li>
                    </ul>
                    <div className='fw-bold buy-bhead'>Popular Searches</div>
                    <ul className='buy-ul'>
                        <li>Property in Mumbai</li>
                    </ul>
                </div>
            )}
            {visibleSection === 'own-box' && (
                <div className='own-box p-2'>
                    <div className='fw-bold buy-bhead'>Owner Offerings</div>
                    <ul className='buy-ul'>
                        <li><Link className="nav-link active small" aria-current="page" to="/profile">Post Property<img src={free} className='free-gif' alt="free" /></Link></li>
                        <li>Owner Services</li>
                        <li><Link className="nav-link active small" aria-current="page" to="/v-response">View Responses</Link></li>
                    </ul>
                </div>
            )}
            <ToastContainer />
        </>
    )
}

export default Navbar