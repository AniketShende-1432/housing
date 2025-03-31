import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/Slice';
import Otpimage from "../../assets/otp.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet-async";

const Otp = () => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const otpData = location.state || {};
    const [otpdata,setotpdata] = useState({...otpData,otp:''});
    console.log(otpdata);
    const [otp, setOtp] = useState(new Array(5).fill(""));

    useEffect(() => {
        if (sessionStorage.getItem("showOtpToast") === "true") {
            toast.success('OTP sent successfully!',{
                onClose: () => {
                    sessionStorage.removeItem("showOtpToast");
                },
            });
        }
    }, []);
    
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return;
    
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        setotpdata((prevData) => ({
            ...prevData,
            otp: newOtp.join(""), // Join the array into a string and store it in otpdata.otp
          }));
        // Focus the next input
        if (element.nextSibling) {
          element.nextSibling.focus();
        }
      };
    
      const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL; // Use your environment variable
            await axios.post(`${base_url}/api/v1/verify-otp`,otpdata, { withCredentials: true }).then((response) => {
            if (response.status === 200 && response.data.message === 'Login successful') {
                dispatch(authActions.login());
                sessionStorage.setItem("showLoginToast", "true");
                navigate('/');
            } else {
                toast.error(response.data.message || 'Invalid or expired OTP');
            }
        });
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error verifying OTP:', error);
        }
      };

    return (
        <div style={{ backgroundColor: "aliceblue" }}>
             <Helmet>
                <title>Housing Owner OTP</title>
                <meta name="description" content="Explore new houses for sale on top house selling websites. Buy or sell property easily with realtor sites, MLS listings, and property selling platforms." />
                <meta name="keywords" content="new houses for sale,house selling websites,sell property,buy property,realtor sites,property selling sites,house sale websites
                ,mls listing,mls properties,mls service" />
            </Helmet>
            <div className='container d-flex justify-content-center align-items-center log-cont pt-2'>
                <div className='log-cont-box bg-white mb-5 p-4 d-flex justify-content-center align-items-center flex-column'>
                    <img src={Otpimage} alt="otp" className='otp-img' />
                    <div className='otp-head fs-4 mt-2'>Enter The OTP Code</div>
                    <form onSubmit={handleSubmit}>
                        <div className="otp-inputs d-flex">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    className="otp-input"
                                />
                            ))}
                        </div>
                        <button type="submit" className="btn c-btn w-100 mt-3">
                            Verify OTP
                        </button>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Otp