import React, { useState } from 'react'
import "./Signup.css";
import axios from "axios";
import { Link } from 'react-router-dom';
import { BiShow } from "react-icons/bi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet-async";

const Signup = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [userInputs, setuserInputs] = useState({
        name: "",
        email: "",
        usertype: "",
        phone: "",
        agreement: false,
        password: "",
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        usertype: '',
        phone: '',
        agreement: '',
        password: '',
    });
    const base_url = import.meta.env.VITE_BASE_URL;

    const userChange = (e) => {
        const { name, value, type, checked } = e.target;
        setuserInputs((prevState) => ({
            ...prevState,
            [name]: type === "checkbox" ? checked : value, // Handle checkbox
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        let formErrors = {};
        if (!userInputs.name) {
            formErrors.name = 'Name is required';
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!userInputs.email) {
            formErrors.email = 'Email is required';
        } else if (!emailPattern.test(userInputs.email)) {
            formErrors.email = 'Please enter a valid email';
        }
        const phonePattern = /^[0-9]{10}$/;
        if (!userInputs.phone) {
            formErrors.phone = 'Phone number is required';
        } else if (!phonePattern.test(userInputs.phone)) {
            formErrors.phone = 'Please enter a valid phone number (10 digits)';
        }
        if (!userInputs.password) {
            formErrors.password = 'Password is required';
        } else if (userInputs.password.length < 6) {
            formErrors.password = 'Password must be at least 6 characters';
        }
        if (!userInputs.agreement) {
            formErrors.agreement = 'You must agree to the terms and conditions';
        }
        if (!userInputs.usertype) {
            formErrors.usertype = 'Please select a user type';
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        try {
            await axios.post(`${base_url}/api/v1/register`, userInputs)
                .then((response) => {
                    if (response.data.message === "User Already Exists") {
                        toast.error(response.data.message);
                    }
                    else {
                        toast.success(response.data.message);
                        setuserInputs({
                            name: "",
                            email: "",
                            usertype: "",
                            phone: "",
                            agreement: false,
                            password: "",
                        });
                    }
                });
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ backgroundColor: "aliceblue" }}>
             <Helmet>
                <title>Register Agent/Builder</title>
                <meta name="description" content="Find your dream home with Multiple Listings Service (MLS). Explore ready-to-move flats, under-construction projects near you, and top properties like Rahul Arcus, Godrej Aria, and Tata Primanti Gurgaon. Discover 2 BHK in Airoli and more!" />
                <meta name="keywords" content="multiple listings service,mls company,rahul arcus,godrej aria,2 bhk in airoli,tata primanti gurgaon,
                under construction projects near me,ready to move flat,under constructions" />
            </Helmet>
            <ToastContainer />
            <div className='container d-flex justify-content-center align-items-center signup-cont'>
                <div className='signup-box p-4 bg-white'>
                    <form onSubmit={handleSubmit}>
                        <div className='fw-bold fs-4 signup-text mb-3'>Sign Up</div>
                        <div>
                            <div className='mb-2'>I am</div>
                            <div className='d-flex signup-radio'>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="buyer"
                                        value="Buyer/Owner/Tenant"
                                        checked={userInputs.usertype === "Buyer/Owner/Tenant"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="buyer">
                                        Buyer/Owner/Tenant
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="Agent"
                                        value="Agent"
                                        checked={userInputs.usertype === "Agent"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="Agent">
                                        Agent
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className={`form-check-input ${errors.usertype ? 'border-danger' : ''}`} type="radio" name="usertype" id="builder"
                                        value="Builder"
                                        checked={userInputs.usertype === "Builder"}
                                        onChange={userChange} />
                                    <label className="form-check-label" for="builder">
                                        Builder
                                    </label>
                                </div>
                            </div>
                            {errors.usertype && <div className="text-danger error-txt">{errors.usertype}</div>}
                        </div>
                        <div className='mb-3 mt-3'>
                            <div>Name</div>
                            <input type="text" className="signup-input" name="name"
                                value={userInputs.name}
                                onChange={userChange} />
                             {errors.name && <div className="text-danger error-txt">{errors.name}</div>}
                        </div>
                        <div className='mb-3'>
                            <div>Email</div>
                            <input type="email" className="signup-input" name="email"
                                value={userInputs.email}
                                onChange={userChange} />
                            {errors.email && <div className="text-danger error-txt">{errors.email}</div>}
                        </div>
                        <div className='phone-cont'>
                            <div>Password</div>
                            <div className='d-flex'>
                                <input type={showPassword ? "text" : "password"} className="signup-input border-bottom-0"  name="password"
                                    value={userInputs.password}
                                    onChange={userChange} />
                                <div className='eye-icon' onClick={togglePasswordVisibility}><BiShow className='fs-3 m-1' /></div>
                            </div>
                        </div>
                        {errors.password && <div className="text-danger error-txt">{errors.password}</div>} 
                        <div className='d-flex phone-cont mt-4'>
                            <div className='w-25'>IND +91</div>
                            <input type="text" className={`phone-input ${errors.phone ? 'border-danger' : ''}`} name="phone" id="phone" placeholder='     Mobile Number'
                                value={userInputs.phone}
                                onChange={userChange} />
                        </div>
                        {errors.phone && <div className="text-danger error-txt">{errors.phone}</div>}
                        <div className="form-check mb-3 mt-3">
                            <input className={`form-check-input ${errors.agreement ? 'border-danger' : ''}`}  type="checkbox" id="flexCheckDefault"
                                name="agreement"
                                checked={userInputs.agreement}
                                onChange={userChange} />
                            <label className="form-check-label check-label" for="flexCheckDefault">
                                I agree to Housing T&C, Privacy Policy, & Cookie Policy
                            </label>
                            {errors.agreement && <div className="text-danger error-txt">{errors.agreement}</div>}
                        </div>
                        <div className='mb-3'>
                            <button className="btn signup-btn w-100" type="submit">Sign Up</button>
                        </div>
                        <div className='d-flex justify-content-center'>Already Registered ?<Link className="nav-link active small signup-text ms-1 fw-bold" aria-current="page" to="/login">Login Now</Link></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup