import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { IoMailOutline } from "react-icons/io5";
import { FaSquarePhone } from "react-icons/fa6";
import { BiShow } from "react-icons/bi";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from '../../store';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const [clickedButtons, setClickedButtons] = useState({
        button1: false,
        button2: false,
    });
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        usertype: '',
    });
    const [otpData, setotpData] = useState({
        usertype: '',
        phoneNumber: '',
    })
    const [userType, setUserType] = useState('email');
    const [showPassworduser, setShowPassworduser] = useState(false);

    const handleClick = (buttonKey, usert) => {
        setClickedButtons({
            button1: buttonKey === 'button1',
            button2: buttonKey === 'button2',
        });
        setLoginData((prevState) => ({ ...prevState, usertype: usert }));
        setotpData((prevState) => ({ ...prevState, usertype: usert }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLoginData((prevState) => ({ ...prevState, [name]: value }));
    };
    const handleInputotpChange = (e) => {
        const value = e.target.value;
        setotpData((prevState) => ({ ...prevState, phoneNumber: value }));
    }
    const handleChange = () => {
        if (userType == "email") {
            setUserType("phone");
        }
        else {
            setUserType("email");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!loginData.email || !loginData.password || !loginData.usertype) {
            toast.error('All fields are required!');
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(loginData.email)) {
            toast.error('Enter a valid email');
            return;
        }
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            await axios.post(`${base_url}/api/v1/signin`, loginData, { withCredentials: true }).then((response) => {
                dispatch(authActions.login());
                sessionStorage.setItem("showLoginToast", "true");
                if (response.data.message) {
                    toast.error(response.data.message);
                } else {
                    setLoginData({
                        email: '',
                        password: '',
                        usertype: '',
                    });
                    setClickedButtons({
                        button1: false,
                        button2: false,
                    });
                    navigate('/');
                }
            });
        } catch (error) {
            toast.error("Server error");
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassworduser(!showPassworduser);
    };
    const handleotp = async (e) => {
        const phonePattern = /^[0-9]{10}$/;
        if (!otpData.phoneNumber || !otpData.usertype) {
            toast.error('All Fields are Required !!');
            return;
        } else if (!phonePattern.test(otpData.phoneNumber)) {
            toast.error('Please enter a valid phone number (10 digits)');
            return;
        }
        try {
            const base_url = import.meta.env.VITE_BASE_URL; // Use your environment variable
            const response = await axios.post(`${base_url}/api/v1/send-otp`, otpData, { withCredentials: true });
            // Handle response
            if (response.status === 200) {
                sessionStorage.setItem("showOtpToast", "true");
                navigate('/login/otp', { state: otpData });
                setotpData({
                    usertype: '',
                    phoneNumber: '',
                })
            } else {
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (error) {
            toast.error('Server error while sending OTP');
            console.error('Error sending OTP:', error);
        }
    }

    return (
        <div style={{ backgroundColor: "aliceblue" }}>
            <ToastContainer />
            <div className='container d-flex justify-content-center align-items-start log-cont pt-2'>
                <div className='log-cont-box bg-white mt-5 p-4'>
                    <div className='fw-bold fs-4 login-text mb-3 text-center'>Login</div>
                    <div className='d-flex google-cont'>
                        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                            <div className="container text-center">
                                <GoogleLogin text="signin"
                                    theme="filled_blue"
                                    className="google-login-btn"
                                />
                            </div>
                        </GoogleOAuthProvider>
                        <div className='d-flex'>
                            <div className='fs-3 border border-dark px-2 mail-icon d-flex align-items-center'> {userType !== 'phone' ? <FaSquarePhone /> : <IoMailOutline className='text-dark' />}</div>
                            <button type="button" className="otp-btn btn c-btn" onClick={() => handleChange()}>
                                {userType !== 'phone' ? 'Mobile OTP' : 'Email Login'}
                            </button>
                        </div>
                    </div>
                    <div className="d-flex align-items-center my-3">
                        <div className="flex-grow-1 border border-secondary-subtle"></div>
                        <span className="mx-3 text-muted">or</span>
                        <div className="flex-grow-1 border border-secondary-subtle"></div>
                    </div>
                    <div className='mb-3'>
                        <div className='fw-bold'>Are you</div>
                        <div>
                            <button className='btn btn-light log-cont-btn mt-2' onClick={() => handleClick("button1", 'Buyer/Owner/Tenant')}
                                style={clickedButtons.button1 ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Buyer/Owner</button>
                            <button className='btn btn-light log-cont-btn mt-2 ms-2' onClick={() => handleClick("button2", 'Agent/Builder')}
                                style={clickedButtons.button2 ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Agent/Builder</button>
                        </div>
                    </div>
                    <div>
                        <div>
                            {userType === 'email' ? (
                                <div>
                                    <div className='mb-3'>
                                        <div>Enter Email ID</div>
                                        <input type="email" className='log-cont-input' name="email"
                                            value={loginData.email}
                                            onChange={handleInputChange} />
                                    </div>
                                    <div className='mb-3'>
                                        <div>Enter Password</div>
                                        <div className='d-flex log-pass-cont'>
                                            <input type={showPassworduser ? "text" : "password"} className="log-cont-input-pass" name="password"
                                                value={loginData.password}
                                                onChange={handleInputChange} />
                                            <div className='eye-icon' onClick={togglePasswordVisibility}><BiShow className='fs-3 m-1' /></div>
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <button className="btn c-btn w-100" onClick={handleSubmit}>Login</button>
                                    </div>
                                    <div className='d-flex justify-content-center login-text fw-bold mb-2'>Forgot Password ?</div>
                                </div>
                            ) : (
                                <div>
                                    <div className='d-flex phone-cont mt-4 mb-3'>
                                        <div className='w-25'>IND +91</div>
                                        <input type="text" className='phone-input' name="phone" id="phone" placeholder='     Mobile Number'
                                            value={otpData.phoneNumber}
                                            onChange={handleInputotpChange} />
                                    </div>
                                    <button className="btn c-btn w-100 mb-2" onClick={handleotp}>Next</button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='d-flex justify-content-center'>New to Housing ?<Link className="nav-link active small login-text ms-1 fw-bold" aria-current="page" to="/signup">Sign up</Link></div>
                </div>
            </div>
        </div>
    )
}

export default Login