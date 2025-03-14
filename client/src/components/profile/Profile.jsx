import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from '../navbar/Navbar';
import { BiShow } from "react-icons/bi";
import coin from '../../assets/coin.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Profile.css"
import { Helmet } from "react-helmet-async";

const Profile = () => {

    const navigate = useNavigate();
    const [Choice, setChoice] = useState(true);
    const location = useLocation();
    const [selectTab, setSelectTab] = useState('buy');
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phone: "",
        usertype: "",
        coins:"",
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const [showPassword3, setShowPassword3] = useState(false);
    const [perrors, setPerrors] = useState({
        name: '',
        email: '',
        usertype: '',
        phone: '',
    });
    const [passerrors, setPasserrors] = useState({
        cpassword: '',
        npassword: '',
        conpassword: '',
    });
    useEffect(() => {
        if (location.state?.tab) {
            setSelectTab(location.state.tab);
        }
    }, [location]);

    useEffect(() => {
        const userd = async () => {
            try {
                const base_url = import.meta.env.VITE_BASE_URL;
                await axios.get(`${base_url}/api/v1/profile`, { withCredentials: true, }).then((response) => {
                    setUserData(response.data);
                    if (response.data.message) {
                        toast.error(response.data.message, { toastId: "login-error" });
                    }
                })

            } catch (error) {
                toast.error("Server error", { toastId: "server-error" });
            }
        }
        userd();
    }, [])

    const userchange = (value) => {
        setUserData((prevState) => ({
            ...prevState,
            usertype: value,
        }));
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        let formErrors = {};
        const namePattern = /^[A-Za-z\s]+$/;
        if (!userData.name) {
            formErrors.name = 'Name is required';
        } else if (!namePattern.test(userData.name)) {
            formErrors.name = 'Enter Valid Name';
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!userData.email) {
            formErrors.email = 'Email is required';
        } else if (!emailPattern.test(userData.email)) {
            formErrors.email = 'Please enter a valid email';
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!userData.phone) {
            formErrors.phone = 'Phone number is required';
        } else if (!phonePattern.test(userData.phone)) {
            formErrors.phone = 'Please enter a valid phone number';
        }
        if (!userData.usertype) {
            formErrors.usertype = "Please Select Usertype !";
        };
        if (Object.keys(formErrors).length > 0) {
            setPerrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        const user_upd = async () => {
            const base_url = import.meta.env.VITE_BASE_URL;
            await axios.put(`${base_url}/api/v1/profile`, userData, { withCredentials: true })
                .then((response) => {
                    toast.success("Profile updated successfully");
                    setUserData(response.data); // Update state with the latest data
                })
        }
        user_upd();
    };
    const handlePasswordInputChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword) {
            formErrors.cpassword = 'Current Password is required';
        } else if (currentPassword.length < 6) {
            formErrors.cpassword = 'Password must be at least 6 characters';
        }
        if (!newPassword) {
            formErrors.npassword = 'New Password is required';
        } else if (newPassword.length < 6) {
            formErrors.npassword = 'Password must be at least 6 characters';
        }
        if (!confirmPassword) {
            formErrors.conpassword = 'Confirm Password is required';
        } else if (confirmPassword.length < 6) {
            formErrors.conpassword = 'Password must be at least 6 characters';
        }
        if (Object.keys(formErrors).length > 0) {
            setPasserrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        if (newPassword != confirmPassword) {
            toast.error("Confirm Password is not Matching");
            return;
        }

        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.put(`${base_url}/api/v1/profile/password`, {
                currentPassword,
                newPassword,
            }, { withCredentials: true });

            toast.success(response.data.message);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error) {
            if (error.response && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred. Please try again.");
            }
        }
    };
    const togglePasswordVisibility1 = () => {
        setShowPassword1(!showPassword1);
    };
    const togglePasswordVisibility2 = () => {
        setShowPassword2(!showPassword2);
    };
    const togglePasswordVisibility3 = () => {
        setShowPassword3(!showPassword3);
    };

    return (
        <>
             <Helmet>
                <title>Profile Property User</title>
                <meta name="description" content="Find 1BHK flats for rent or sale near you! Explore MLS real estate listings, top property sites, and the best apartment deals. Buy or rent your perfect home today." />
                <meta name="keywords" content="1bhk flat near me,apartment for sale,mls real estate,1bhk for rent near me,
                1bhk near me,1bhk flat for rent near me," />
            </Helmet>
            <Navbar back="profile-bg" />
            <div className='p-cont-box'>
                <div className='p-cont-box1 d-flex justify-content-around'>
                    <div className='p-itm d-none d-sm-block' onClick={() => navigate('/', { state: { tab: 'Buy' } })}>Buy</div>
                    <div className={`p-itm ${selectTab === 'Sell' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('Sell')}><Link className="nav-link active small" aria-current="page" to="/profile/sell">Sell</Link></div>
                    <div className={`p-itm ${selectTab === 'Rent' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('Rent')}><Link className="nav-link active small" aria-current="page" to="/profile/rent">Rent</Link></div>
                    <div className={`p-itm ${selectTab === 'Plot/Land' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('Plot/Land')}><Link className="nav-link active small" aria-current="page" to="/profile/plot">Plot/Land</Link></div>
                    <div className={`p-itm ${selectTab === 'PG' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('PG')}><Link className="nav-link active small" aria-current="page" to="/profile/pg">PG</Link></div>
                    <div className={`p-itm ${selectTab === 'Commercial' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('Commercial')}><Link className="nav-link active small" aria-current="page" to="/profile/commercial">Commercial</Link></div>
                    <div className={`p-itm d-none d-sm-block ${selectTab === 'Home Loan' ? 'p-itmcol' : ''}`}
                        onClick={() => setSelectTab('Home Loan')}>Home Loan</div>
                </div>
            </div>
            <div className='d-flex flex-column flex-sm-row'>
                <div className='coin-div d-flex justify-content-center align-items-center'>
                    <div className='h-50 d-flex flex-column justify-content-center align-items-center coin-box ms-auto'>
                        <img src={coin} alt="coin" className='coin-img' />
                        <div className='mt-2 mt-sm-4 fs-5'>Balance coins</div>
                        <div className='fs-5'>{userData.coins}</div>
                    </div>
                </div>
                <div className='d-flex flex-column pt-4 pr-main-box ms-sm-4 justify-content-center align-items-center align-items-sm-start'>
                    <div className='d-flex justify-content-center tab-div'>
                        <div className={`choice-btn1 fw-bold p-2 px-4 ${Choice ? "profile-bg text-white" : ""}`} onClick={() => setChoice(true)}>My Profile</div>
                        <div className={`choice-btn2 fw-bold p-2 ${!Choice ? "profile-bg text-white" : ""}`} onClick={() => setChoice(false)}>Change Password</div>
                    </div>
                    <div className='pr-cont p-3 pe-3'>
                        <div className='container'>
                            {Choice ? (<div>
                                <div className={`row ${perrors.name ? 'mb-2' : "mb-3"}`}>
                                    <div className='col-3 col-sm-5 me-2 text-end my-2'>Name</div>
                                    <div className='col'>
                                        <input type="text" className="form-control ms-2" name='name' id='username'
                                            value={userData.name}
                                            onChange={handleInputChange} />
                                        {perrors.name && <div className="text-danger perror-txt ms-2">{perrors.name}</div>}
                                    </div>
                                </div>
                                <div className={`row ${perrors.name ? 'mb-2' : "mb-3"}`}>
                                    <div className='col-3 col-sm-5 me-sm-2 text-end my-sm-2 text-nowrap'>User Type</div>
                                    <div className='col'>
                                        <div className="dropdown d-flex w-75 p-0 ms-3 ms-sm-2">
                                            <button className="btn btn-secondary border dropdown-toggle w-100 bg-white text-dark d-flex justify-content-between align-items-center border-secondary-subtle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <span>{userData.usertype || 'Select UserType'}</span>
                                                <span className="dropdown-arrow"></span>
                                            </button>
                                            <ul className="dropdown-menu w-75">
                                                <li><a role="button" className="dropdown-item" onClick={() => userchange("Buyer/Owner/Tenant")} href="#">Buyer/Owner/Tenant</a></li>
                                                <li><a role="button" className="dropdown-item" onClick={() => userchange("Agent")} href="#">Agent</a></li>
                                                <li><a role="button" className="dropdown-item" onClick={() => userchange("Builder")} href="#">Builder</a></li>
                                            </ul>
                                        </div>
                                        {perrors.usertype && <div className="text-danger perror-txt ms-2">{perrors.usertype}</div>}
                                    </div>
                                </div>
                                <div className={`row ${perrors.name ? 'mb-2' : "mb-3"}`}>
                                    <div className='col-3 col-sm-5 me-2 text-end my-2'>Email</div>
                                    <div className='col'>
                                        <input type="email" className="form-control ms-2" name='email' id='useremail'
                                            value={userData.email}
                                            onChange={handleInputChange} />
                                        {perrors.email && <div className="text-danger perror-txt ms-2">{perrors.email}</div>}
                                    </div>
                                </div>
                                <div className={`row ${perrors.name ? 'mb-2' : "mb-3"}`}>
                                    <div className='col-3 col-sm-5 me-2 text-end my-2'>Mobile</div>
                                    <div className='col d-flex'>
                                        <div className='pr-pcode my-2 ms-2'>IND +91</div>
                                        <div className='col'>
                                            <input type="text" className="form-control ms-2" name='phone' id='userphone'
                                                value={userData.phone}
                                                onChange={handleInputChange} />
                                            {perrors.phone && <div className="text-danger perror-txt ms-2">{perrors.phone}</div>}
                                        </div>
                                    </div>
                                </div>
                                <button className="btn profile-btn fw-bold w-100" onClick={handleSubmit}>Save Profile</button>
                            </div>) : (
                                <div>
                                    <div className={`row ${passerrors.cpassword ? 'mb-2' : "mb-3"}`}>
                                        <div className='col-4 me-2 text-start text-sm-end my-0 my-sm-2'>Current Password</div>
                                        <div className='col'>
                                            <div className='row'>
                                                <input type={showPassword1 ? "text" : "password"} className="form-control pass-inp col ms-2" name='currentPassword' id='usercpass'
                                                    value={passwordData.currentPassword}
                                                    onChange={handlePasswordInputChange} />
                                                <div className='eye-icon-pass col-2 p-1 d-flex justify-content-center align-items-center' onClick={togglePasswordVisibility1}><BiShow className='fs-3' /></div>
                                            </div>
                                            {passerrors.cpassword && <div className="text-danger perror-txt">{passerrors.cpassword}</div>}
                                        </div>
                                    </div>
                                    <div className={`row ${passerrors.npassword ? 'mb-2' : "mb-3"}`}>
                                        <div className='col-4 me-2 text-start text-sm-end my-0 my-sm-2'>New Password</div>
                                        <div className='col'>
                                            <div className='row'>
                                                <input type={showPassword2 ? "text" : "password"} className="form-control pass-inp col ms-2" name='newPassword' id='usernpass'
                                                    value={passwordData.newPassword}
                                                    onChange={handlePasswordInputChange} />
                                                <div className='eye-icon-pass col-2 p-1 d-flex justify-content-center align-items-center' onClick={togglePasswordVisibility2}><BiShow className='fs-3' /></div>
                                            </div>
                                            {passerrors.npassword && <div className="text-danger perror-txt">{passerrors.npassword}</div>}
                                        </div>
                                    </div>
                                    <div className={`row ${passerrors.name ? 'mb-2' : "mb-3"}`}>
                                        <div className='col-4 me-2 text-start text-sm-end my-0 my-sm-2'>Confirm Password</div>
                                        <div className='col'>
                                            <div className='row'>
                                                <input type={showPassword3 ? "text" : "password"} className="form-control pass-inp col ms-2" name='confirmPassword' id='userconpass'
                                                    value={passwordData.confirmPassword}
                                                    onChange={handlePasswordInputChange} />
                                                <div className='eye-icon-pass col-2 p-1 d-flex justify-content-center align-items-center' onClick={togglePasswordVisibility3}><BiShow className='fs-3' /></div>
                                            </div>
                                            {passerrors.conpassword && <div className="text-danger perror-txt">{passerrors.conpassword}</div>}
                                        </div>
                                    </div>
                                    <button className="btn profile-btn fw-bold w-100" type="submit" onClick={handlePasswordSubmit}>Save Password</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile