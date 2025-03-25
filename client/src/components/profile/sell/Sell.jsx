import React, { useEffect, useState } from 'react';
import Navbar from '../../navbar/Navbar';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { FaRupeeSign } from "react-icons/fa";
import Sell2 from "./Sell2";
import "./Sell.css";
import { Helmet } from "react-helmet-async";

const Sell = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { property, mode } = location.state || {};

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

    const [formData, setFormData] = useState({
        price: '', propertyType: '', city: '', locality: '', society: '', bhk: '', furnishedType: '',
        carpetArea: '', carpetAreaUnit: '', superArea: '', superAreaUnit: '', possessionStatus: '',
        developer: '', societyArea: '', societyAreaUnit: '', reraApproved:'',reraNumber:'', amenities: [],
        features:
        {
            bedrooms: '',
            bathrooms: '',
            balconies: '',
            floorNumber: '',
            totalFloors: '',
            ageOfProperty: '',
        },
        ...property,
    });

    const [clickedBhk, setClickedBhk] = useState({
        bhk1: false,
        bhk2: false,
        bhk3: false,
        bhk4: false,
    });
    const [clickedfurni, setClickedfurni] = useState({
        furni1: false,
        furni2: false,
        furni3: false,
    });
    const [Inputarea, setInputarea] = useState("");
    const [Inputsarea, setInputsarea] = useState("");
    const [price, setPrice] = useState(""); // State for input value
    const [formattedPrice, setFormattedPrice] = useState(""); // State for formatted display value
    const [possessionStatus, setPossessionStatus] = useState("");
    const [errors, setErrors] = useState({
        type: '',
        city: '',
        location: '',
        society: '',
        bhk: '',
        furni: '',
        carea: '',
        cunit: '',
        sarea: '',
        sunit: '',
        poss: '',
        price: '',
    });

    useEffect(() => {
        if (mode === 'edit' && property) {
            setFormData({
                ...formData, // Spread initial form data to maintain structure
                ...property, // Override with property-specific data
            });
        }
    }, [mode, property]);

    const handleBhk = (buttonKey) => {
        setClickedBhk((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const bhkValue = buttonKey === 'bhk1' ? '1RK' :
            buttonKey === 'bhk2' ? '1BHK' :
                buttonKey === 'bhk3' ? '2BHK' :
                    '3BHK'; // Default to '3BHK' if 'bhk4' is clicked

        setFormData({ ...formData, bhk: bhkValue });
    };
    const handleCarpetAreaInput = (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            carpetArea: value === '' ? '' : parseInt(value, 10),
        }));
    };
    const changearea = (e, value) => {
        e.preventDefault();
        setInputarea(value);
        setFormData((prevState) => ({
            ...prevState,
            carpetAreaUnit: value, // Update formData with the selected unit
        }));
    }
    const handleSuperAreaInput = (event) => {
        const value = event.target.value;
        setFormData((prevState) => ({
            ...prevState,
            superArea: value === '' ? '' : parseInt(value, 10),
        }));
    };
    const changesarea = (e, value) => {
        e.preventDefault();
        setInputsarea(value);
        setFormData((prevState) => ({
            ...prevState,
            superAreaUnit: value, // Update formData with the selected unit
        }));
    }
    const handlefurni = (buttonKey) => {
        setClickedfurni((prevState) => ({
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const furniValue = buttonKey === 'furni1' ? 'Fully furnished' :
            buttonKey === 'furni2' ? 'Semi Furnished' : "Unfurnished"
        setFormData({ ...formData, furnishedType: furniValue });
    }
    const handlepossChange = (event) => {
        const poss = event.target.value;
        setPossessionStatus(poss);
        setFormData({ ...formData, possessionStatus: poss }); // Update state with selected value
    };
    const handlepage = () => {
        let formErrors = {};
        if (!formData.propertyType) {
            formErrors.type = 'Select Property Type';
        }
        const namepattern = /^[A-Za-z\s]+$/;
        if (!formData.city) {
            formErrors.city = 'City is required';
        } else if (!namepattern.test(formData.city)) {
            formErrors.city = 'Please enter a valid city';
        }
        if (!formData.locality) {
            formErrors.location = 'Location is required';
        } else if (!namepattern.test(formData.locality)) {
            formErrors.location = 'Please enter a valid Location';
        }
        if (!formData.society) {
            formErrors.society = 'Name of Society/Project is required';
        } else if (!namepattern.test(formData.society)) {
            formErrors.society = 'Please enter a Name';
        }
        if (!formData.bhk) {
            formErrors.bhk = 'Select BHK';
        }
        if (!formData.furnishedType) {
            formErrors.furni = 'Select furnished Type';
        }
        const areapattern = /^\d+(\.\d{1,2})?$/;
        if (!formData.carpetArea) {
            formErrors.carea = 'Carpet Area is required';
        } else if (!areapattern.test(formData.carpetArea)) {
            formErrors.carea = 'Please enter a valid numbers';
        }
        if (!formData.superArea) {
            formErrors.sarea = 'Super Area is required';
        } else if (!areapattern.test(formData.superArea)) {
            formErrors.sarea = 'Please enter a valid numbers';
        }
        if (!formData.carpetAreaUnit) {
            formErrors.cunit = 'Select Carpet Area Unit';
        }
        if (!formData.superAreaUnit) {
            formErrors.sunit = 'Select Super Area Unit';
        }
        if (!formData.possessionStatus) {
            formErrors.poss = 'Select Possession Status';
        }
        if (!formData.price) {
            formErrors.price = 'Price is required';
        }
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Stop the form submission if there are errors
        }
        navigate('/profile/sell-property', { state: { formData,mode} });
    }
    const formatPrice = (value) => {
        if (!value) return ""; // Handle empty input
        const num = parseFloat(value);

        if (isNaN(num)) return value; // Handle invalid number input

        if (num >= 10000000) {
            return `${(num / 10000000).toFixed(1)} Cr`; // Format as Crore
        } else if (num >= 100000) {
            return `${(num / 100000).toFixed(1)} Lacs`; // Format as Lacs
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(1)} K`; // Format as Thousand
        } else {
            return num.toString(); // Return as is for smaller values
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
        setPrice(value);
        setFormData({ ...formData, price: value === '' ? '' : parseInt(value, 10) });
        setFormattedPrice(formatPrice(value));
    };
    const handleformInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Handle the change based on input type
        if (type === 'checkbox') {
            // For checkboxes like amenities
            setFormData(prevState => ({
                ...prevState,
                [name]: checked,
            }));
        } else {
            // For other inputs like text, radio buttons, etc.
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <div className="parent-cont" style={{ backgroundColor: "#FFF5EE" }}>
            <Helmet>
                <title>Sell Property</title>
                <meta name="description" content="Buy or rent commercial property near you! Explore office spaces for rent, commercial real estate for sale, shops for purchase, office spaces for lease, and top-rated commercial property listings. Find the best deals on commercial spaces, offices, and more!" />
                <meta name="keywords" content="buy shop near me,office buy,commercial property,office space for rent,commercial property for sale,commercial real estate,commercial real estate for sale,commercial space for rent,commercial property for sale near me,office space for lease" />
            </Helmet>
            <div className='sell-cont-nav'>
                <Navbar back="profile-bg" login="login-box2" cname="sell-nav" />
                <div className='sell-cont-box' id='navbar'>
                    <div className='p-cont-box1 d-flex justify-content-around'>
                        <div className='sell-itm d-none d-sm-block' onClick={() => navigate('/', { state: { tab: 'buy' } })}>Buy</div>
                        <div className="sell-itm sell-itmcol"><Link className="nav-link active small" aria-current="page" to="/profile/sell">Sell</Link></div>
                        <div className="sell-itm"><Link className="nav-link active small" aria-current="page" to="/profile/Rent">Rent</Link></div>
                        <div className="sell-itm"><Link className="nav-link active small" aria-current="page" to="/profile/plot">Plot/Land</Link></div>
                        <div className="sell-itm"><Link className="nav-link active small" aria-current="page" to="/profile/pg">PG</Link></div>
                        <div className="sell-itm"><Link className="nav-link active small" aria-current="page" to="/profile/commercial">Commercial</Link></div>
                        <div className="sell-itm d-none d-sm-block">Home Loan</div>
                    </div>
                </div>
            </div>
            <div className='container main-box w-50'>
                <div className='main2-box bg-white p-4'>
                    <div className='sell-head'><h3>Sell Of Property</h3></div>
                    <div className='mt-5'>
                        <div className='mb-2'>Property Type</div>
                        <div class="dropdown d-flex sell-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{formData.propertyType || 'Select Property Type'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu sell-drop-menu">
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Flat" })} href="#">Flat</a></li>
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Residential House" })} href="#">Residential House</a></li>
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Villa" })} href="#">Villa</a></li>
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Penthouse" })} href="#">Penthouse</a></li>
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Builder Floor Ready to Move" })} href="#">Builder Floor Ready to Move</a></li>
                                <li><a role="button" class="dropdown-item" onClick={() => setFormData({ ...formData, propertyType: "Builder Under Construction" })} href="#">Builder Under Construction</a></li>
                            </ul>
                        </div>
                        {errors.type && <div className="text-danger error-txt">{errors.type}</div>}
                    </div>
                    <div className={errors.type ? 'mt-4' : 'mt-5'}>
                        <div><h5>Property Location</h5></div>
                        <div>
                            <div>City</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='city' id='city'
                                value={formData.city} onChange={handleformInputChange} />
                            {errors.city && <div className="text-danger error-txt">{errors.city}</div>}
                            <div className={errors.city ? 'mt-2' : 'mt-3'}>Locality</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='locality' id='plocality'
                                value={formData.locality} onChange={handleformInputChange} />
                            {errors.location && <div className="text-danger error-txt">{errors.location}</div>}
                            <div className={errors.location ? 'mt-2' : 'mt-3'}>Name of Society/Project</div>
                            <input type="text" className="property-inp p-2 pt-1 w-100" name='society' id='project'
                                value={formData.society} onChange={handleformInputChange} />
                            {errors.society && <div className="text-danger error-txt">{errors.society}</div>}
                        </div>
                    </div>
                    <div className={errors.society ? 'mt-4' : 'mt-5'}>
                        <div><h5>BHK</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handleBhk("bhk1")}
                                style={clickedBhk.bhk1 || formData.bhk.includes('1RK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >1RK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleBhk("bhk2")}
                                style={clickedBhk.bhk2 || formData.bhk.includes('1BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>1BHK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleBhk("bhk3")}
                                style={clickedBhk.bhk3 || formData.bhk.includes('2BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >2BHK</button>
                            <button className='btn btn-light border ms-3' onClick={() => handleBhk("bhk4")}
                                style={clickedBhk.bhk4 || formData.bhk.includes('3BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>3BHK</button>
                        </div>
                        {errors.bhk && <div className="text-danger error-txt">{errors.bhk}</div>}
                    </div>
                    <div className={errors.bhk ? 'mt-4' : 'mt-5'}>
                        <div className='mb-2'><h5>Furnished Type</h5></div>
                        <div className='d-flex'>
                            <button className='btn btn-light border' onClick={() => handlefurni("furni1")}
                                style={clickedfurni.furni1 || formData.furnishedType.includes('Fully furnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Fully furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlefurni("furni2")}
                                style={clickedfurni.furni2 || formData.furnishedType.includes('Semi Furnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Semi Furnished</button>
                            <button className='btn btn-light border ms-3' onClick={() => handlefurni("furni3")}
                                style={clickedfurni.furni3 || formData.furnishedType.includes('Unfurnished') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Unfurnished</button>
                        </div>
                        {errors.furni && <div className="text-danger error-txt">{errors.furni}</div>}
                    </div>
                    <div className={errors.furni ? 'mt-4' : 'mt-5'}>
                        <div><h5>Area</h5></div>
                        <span>Provide Super Area</span>
                        <div className='mt-2 mb-2'>Carpet Area</div>
                        <div className={`input-group ${errors.carea || errors.cunit ? 'mb-0' : 'mb-3'}`}>
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={formData.carpetArea}
                                onChange={handleCarpetAreaInput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"> {Inputarea || formData.carpetAreaUnit || "Select Unit"}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a role="button" className="dropdown-item" onClick={(e) => changearea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changearea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changearea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changearea(e, "Acre")} href="#">Acre</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changearea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {errors.carea && <div className="text-danger error-txt">{errors.carea}</div>}
                        {errors.cunit && <div className="text-danger error-txt">{errors.cunit}</div>}
                        <div className='mb-2'>Super Area</div>
                        <div className={`input-group ${errors.sarea || errors.sunit ? 'mb-0' : 'mb-3'}`}>
                            <input type="text" className="form-control" aria-label="Text input with dropdown button"
                                value={formData.superArea}
                                onChange={handleSuperAreaInput} />
                            <button className="btn btn-secondary bg-white text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{Inputsarea || formData.superAreaUnit || "Select Unit"}</button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a role="button" className="dropdown-item" onClick={(e) => changesarea(e, "Sq-ft")} href="#">Sq-ft</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changesarea(e, "Sq-yrd")} href="#">Sq-yrd</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changesarea(e, "Sq-m")} href="#">Sq-m</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changesarea(e, "Acre")} href="#">Acre</a></li>
                                <li><a role="button" className="dropdown-item" onClick={(e) => changesarea(e, "Bigha")} href="#">Bigha</a></li>
                            </ul>
                        </div>
                        {errors.sarea && <div className="text-danger error-txt">{errors.sarea}</div>}
                        {errors.sunit && <div className="text-danger error-txt">{errors.sunit}</div>}
                    </div>
                    <div className={errors.sarea || errors.sunit ? 'mt-4' : 'mt-5'}>
                        <div><h5>Possession Status</h5></div>
                        <div className='d-flex'>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="construct1"
                                    value="Under Construction"
                                    checked={formData.possessionStatus ==="Under Construction"}
                                    onChange={handlepossChange} />
                                <label className="form-check-label" for="construct1">
                                    Under Construction
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="ready2"
                                    value="Ready to Move New"
                                    checked={formData.possessionStatus === "Ready to Move New"}
                                    onChange={handlepossChange} />
                                <label className="form-check-label" for="ready2">
                                    Ready to Move New
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" id="resell"
                                    value="Resell"
                                    checked={formData.possessionStatus === "Resell"}
                                    onChange={handlepossChange} />
                                <label className="form-check-label" for="resell">
                                    Resell
                                </label>
                            </div>
                        </div>
                        {errors.poss && <div className="text-danger error-txt">{errors.poss}</div>}
                    </div>
                    <div className={errors.poss ? 'mt-4' : 'mt-5'}>
                        <div><h5>Price Details</h5></div>
                        <div>
                            <div>Cost</div>
                            <div className='d-flex'>
                                <FaRupeeSign className='rupee-icon' /><input type="text" className='property-inp p-2 w-100' name='price' value={formData.price}
                                    onChange={handleInputChange} id='price' />
                            </div>
                        </div>
                        <span className='fw-bold ms-3 price-format'>{formattedPrice}</span>
                    </div>
                    {errors.price && <div className="text-danger error-txt">{errors.price}</div>}
                    <button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlepage}>Post Property</button>
                </div>
            </div>
        </div>
    )
}

export default Sell
