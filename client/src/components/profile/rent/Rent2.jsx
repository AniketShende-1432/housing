import React, { useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector,useDispatch } from 'react-redux';
import Profilenav from '../../profilenav/Profilenav';
import Selldrop from '../sell/Selldrop';
import { GiWashingMachine } from "react-icons/gi";
import { GiSofa } from "react-icons/gi";
import { FaBed } from "react-icons/fa";
import { GiElevator } from "react-icons/gi";
import { BiCctv } from "react-icons/bi";
import fridge from "../../../assets/fridge.png";
import aircond from "../../../assets/air-conditioner.png";
import gym from "../../../assets/gym.png";
import garden from "../../../assets/garden.png";
import kidsarea from "../../../assets/kidsarea.png";
import cupboard from "../../../assets/cupboard.png";
import tv from "../../../assets/tv.png";
import geyser from "../../../assets/geyser.png";
import swim from "../../../assets/swim.png";
import water from "../../../assets/water.png";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Rent.css";
import { Helmet } from "react-helmet-async";

const Rent2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {rentData , mode} = location.state || {};
    const [rentdata, setrentdata] = useState(rentData);
    const isLoggedin = useSelector((state) => state.auth.isLoggedIn);

    const [clickedrentperson, setClickedrentperson] = useState({
        family: false,
        men: false,
        women: false,
    });
    const [Duration, setDuration] = useState('select');
    const [clickedflatrent, setClickedflatrent] = useState({
        wash: false,
        sofa: false,
        fridge: false,
        ac: false,
        bed: false,
        cupboard: false,
        geyser: false,
        tv: false,
    });
    const [clickedsocrent, setClickedsocrent] = useState({
        lift: false,
        cctv: false,
        garden: false,
        gym: false,
        karea: false,
        swim: false,
        water: false,
    });
    const [imagesrent, setImagesrent] = useState(rentdata?.images || []); // State to store image previews
    const [selectImage, setselectImage] = useState([]);
    const [simage,setsimage] = useState([]);
    const [videor, setVideor] = useState(rentdata?.video || null);
    const [selectVideor,setselectVideor] = useState(null);

    const handleFileChangerent = (event) => {
        if (!event.target.files.length) return;
        const files = Array.from(event.target.files); // Convert FileList to an array
        const newFiles = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImagesrent((prevImages) => [...prevImages, ...newFiles.map((item) => item.url)]); // Update state with image previews
        setsimage((prevFiles) => [...prevFiles, ...newFiles]);
        setselectImage((prevFiles) => [...prevFiles, ...files]);
        event.target.value = "";
    };
    const handleRemoveImage = (index) => {
        const imageToRemove = imagesrent[index]; // This is the image being removed from the preview

        // Case 1: If the image is a Cloudinary URL (from formData.images)
        if (rentdata?.images && rentdata.images.includes(imageToRemove)) {
            // Remove from formData.images
            setrentdata((prevFormData) => ({
                ...prevFormData,
                images: prevFormData.images.filter((img) => img !== imageToRemove),
            }));
        }
        // Case 2: If the image is a temporary URL (from selectImage)
        else {
            // Find the file corresponding to the temporary URL in selectImage
            const fileIndex = simage.findIndex((file) => file.url === imageToRemove);
            // Remove from selectImage (newly uploaded files)
            if (fileIndex !== -1) {
                URL.revokeObjectURL(simage[fileIndex].url);
                setsimage((prevFiles) => prevFiles.filter((_, i) => i !== fileIndex));
                setselectImage((prevFiles) => prevFiles.filter((_, i) => i !== fileIndex));
            }
        }
    
        // Remove from the image preview array (this is common for both cases)
        setImagesrent((prevImages) => prevImages.filter((_, i) => i !== index));
    };
    const handleVideoChange = (event) => {
        if (!event.target.files.length) return;

        const file = event.target.files[0];

        // Check if the uploaded file is a video
        if (!file.type.startsWith("video/")) {
            alert("Please upload a valid video file.");
            return;
        }

        const videoUrl = URL.createObjectURL(file);
        setVideor(videoUrl);
        setselectVideor(file);
        event.target.value = ""; // Reset input value
    };

    const handleRemoveVideo = () => {
        if (videor) {
            URL.revokeObjectURL(videor);
        }
        if (rentdata?.video && rentdata.video === videor) {
            // Remove from formData if it's an existing Cloudinary video
            setrentdata((prevFormData) => ({
                ...prevFormData,
                video: null,
            }));
        }
        setVideor(null);
        setselectVideor(null);
    };

    const bedroomoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const balconiesoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Bathroomoptionsrent = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Floornooptionsrent = [];
    const Totalflooroptionsrent = [];
    const Agepropoptionsrent = ['10+'];
    const Durationoptions = ['0 month', '1 month'];
    for (let i = 0; i <= 80; i++) {
        Floornooptionsrent.push(i);
        Totalflooroptionsrent.push(i);
    }
    for (let i = 9; i >= 0; i--) {
        Agepropoptionsrent.unshift(i);
    }
    for (let i = 2; i <= 36; i++) {
        Durationoptions.push(`${i} months`);
    }
    const handlerentperson = (buttonKey) => {
        setClickedrentperson((prevState) => ({
            ...prevState,
            [buttonKey]: !prevState[buttonKey], // Toggle the clicked button's style
        }));
        const person = buttonKey === 'family' ? 'Family' :
            buttonKey === 'men' ? 'Single Men' : "Single Women"
        setrentdata({ ...rentdata, willingToRent: person });
    }
    const changeduardrop = (value) => {
        setrentdata({ ...rentdata, durationOfAgreement: value });
    }
    const handleflatrent = (amenity) => {
        setrentdata((prevState) => {
            const amenities = [...prevState.amenities];

            // If the amenity is not in the array, add it
            if (!amenities.includes(amenity)) {
                amenities.push(amenity);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = amenities.indexOf(amenity);
                amenities.splice(index, 1);
            }

            return { ...prevState, amenities };
        });
    };
    const handlesocrent = (amenity) => {
        setrentdata((prevState) => {
            const amenities = [...prevState.amenities];

            // If the amenity is not in the array, add it
            if (!amenities.includes(amenity)) {
                amenities.push(amenity);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = amenities.indexOf(amenity);
                amenities.splice(index, 1);
            }

            return { ...prevState, amenities };
        });
    };
    const handleFeaturesChange = (field, value) => {
        setrentdata((prevState) => ({
            ...prevState,
            features: {
                ...prevState.features,
                [field]: field === "ageOfProperty" ? value : value === '' ? '' : parseInt(value, 10), // Parse as number for all except ageOfProperty
            },
        }));
    };
    const handleRsubmit = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const rdata = { ...rentdata, type: "Rent" };
            const rntData = new FormData();
            for (let [key, value] of Object.entries(rdata)) {
                if (key === "availableFrom" && value instanceof Date) {
                    value = value.toISOString().split("T")[0]; // Convert to 'yyyy-MM-dd' format
                }
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => rntData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        rntData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    rntData.append(key, value);
                }
            }
            selectImage.forEach((image) => rntData.append("images", image));
            rntData.append("video",selectVideor);
            if (isLoggedin) {
                await axios.post(`${base_url}/api/v2/rentproperty`, rntData,{withCredentials:true})
                    .then((response) => {
                        if (response.data.message === "Error posting property") {
                            toast.error(response.data.message);
                        } else {
                            toast.success(response.data.message,{
                                onClose: () => {
                                    // Reset form data and navigate after success toast closes
                                    setrentdata({
                                        propertyType: '', city: '', locality: '', society: '', bhk: '', furnishedType: '', carpetArea: '', areaUnit: '',
                                        monthlyRent: '', willingToRent: '', durationOfAgreement: '', securityDeposit: '', availableFrom: '',
                                        features: {
                                            bedrooms: '', // Number of bedrooms
                                            bathrooms: '', // Number of bathrooms
                                            balconies: '', // Number of balconies
                                            floorNumber: '', // Floor number
                                            totalFloors: '', // Total floors in the building
                                            ageOfProperty: '', // Age of the property in years
                                        },
                                        amenities: []
                                    });
                                    navigate('/manage');
                                }
                            });
                        }
                    });
                    
            }
            else {
                toast.error("Please Login First !!");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            console.log(error);
        }
    };
    const handleRentupdate = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const rdata = { ...rentdata, type: "Rent" };
            const rntData = new FormData();
            for (let [key, value] of Object.entries(rdata)) {
                if (key === "availableFrom" && value instanceof Date) {
                    value = value.toISOString().split("T")[0]; // Convert to 'yyyy-MM-dd' format
                }
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => rntData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        rntData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    rntData.append(key, value);
                }
            }
            selectImage.forEach((image) => rntData.append("newimages", image));
            rntData.append("newvideo",selectVideor);
            rntData.forEach((value, key) => {
                console.log(key, value);
              });
            // Send the update request
            const response = await axios.put(`${base_url}/api/v4/updaterentproperty/${rdata._id}`, rntData,
                { withCredentials: true }
            );

            // Handle response
            const message = response.data.message;
            if (message === "Property updated successfully") {
                toast.success(message, {
                    onClose: () => {
                        navigate('/manage');
                    }
                });
            } else {
                toast.error(message);
            }
        } catch (error) {
            console.error("Error updating property:", error);
            toast.error("Error updating property");
        }
    };

    return (
        <div className="parent-cont" style={{ backgroundColor: "#FFF5EE" }}>
            <Helmet>
                <title>Rent Flat/studio/office/shop</title>
                <meta name="description" content="Find rental properties, apartment complexes near me, and furnished apartments for rent. Explore monthly rentals near me, apartments for lease near me, 4 bedroom apartments, 4 bedroom house for rent, cheap apartments for rent near me, 2 bedroom house for rent, and service apartments near me. Discover fully furnished apartments and one-bedroom apartments for rent near me." />
                <meta name="keywords" content="rental properties,apartment complexes near me,furnished apartments for rent,
                monthly rentals near me,apartments for lease near me,4 bedroom apartments,4 bedroom house for rent,cheap apartments for rent near me,2 bedroom house for rent,service apartments near me,
                fully furnished apartments,one bedroom apartment for rent near me" />
            </Helmet>
            <Profilenav select="Rent" />
            <div className='container main-box w-50'>
                <div className='main2-box bg-white p-4'>
                    <div className='sell-head'><h3>Rent Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Features</h5></div>
                        <div className='mt-2 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bedroom"
                                    options={bedroomoptionsrent}
                                    value={rentdata.features.bedrooms}
                                    onChange={(value) => handleFeaturesChange("bedrooms", value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Balconies"
                                    options={balconiesoptionsrent}
                                    value={rentdata.features.balconies}  // Bind to formData.features.balconies
                                    onChange={(value) => handleFeaturesChange('balconies', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bathroom"
                                    options={Bathroomoptionsrent}
                                    value={rentdata.features.bathrooms}  // Bind to formData.features.bathrooms
                                    onChange={(value) => handleFeaturesChange('bathrooms', value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Age of Property"
                                    options={Agepropoptionsrent}
                                    value={rentdata.features.ageOfProperty}  // Bind to formData.features.ageOfProperty
                                    onChange={(value) => handleFeaturesChange('ageOfProperty', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Total Floor"
                                    options={Totalflooroptionsrent}
                                    value={rentdata.features.totalFloors}  // Bind to formData.features.totalFloors
                                    onChange={(value) => handleFeaturesChange('totalFloors', value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Floor no"
                                    options={Floornooptionsrent}
                                    value={rentdata.features.floorNumber}  // Bind to formData.features.floorNumber
                                    onChange={(value) => handleFeaturesChange('floorNumber', value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Willing to Rent out to</h5></div>
                        <div>
                            <button className='btn btn-light border' onClick={() => handlerentperson("family")}
                                style={clickedrentperson.family || rentdata.willingToRent.includes('Family') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Family</button>
                            <button className='btn btn-light border ms-1 ms-sm-3' onClick={() => handlerentperson("men")}
                                style={clickedrentperson.men || rentdata.willingToRent.includes('Single Men') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Single Men</button>
                            <button className='btn btn-light border ms-1 ms-sm-3' onClick={() => handlerentperson("women")}
                                style={clickedrentperson.women || rentdata.willingToRent.includes('Single Women') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Single Women</button>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Duration of Agreement</h5></div>
                        <div class="dropdown d-flex rent-drop">
                            <button class="btn btn-secondary dropdown-toggle bg-white text-dark d-flex justify-content-between align-items-center" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>{rentdata.durationOfAgreement || 'Select'}</span>
                                <span className="dropdown-arrow"></span>
                            </button>
                            <ul class="dropdown-menu rent-drop-menu">
                                {Durationoptions.map((option, index) => (
                                    <li key={index}>
                                        <a role="button" class="dropdown-item" onClick={() => changeduardrop(option)}>{option}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Add Amenities</h5></div>
                        <div>
                            <div className='text-secondary'>Flat Furnishing</div>
                            <div className='d-flex flex-wrap justify-content-evenly flat-ament mt-2'>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Washing Machine")}
                                    style={rentdata.amenities.includes('Washing Machine') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiWashingMachine className='mb-1 fs-5 me-2' />Washing Machine</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Sofa")}
                                    style={rentdata.amenities.includes('Sofa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiSofa className='mb-1 fs-5 me-2' />Sofa</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("Bed")}
                                    style={rentdata.amenities.includes('Bed') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaBed className='mb-1 fs-5 me-2' />Bed</button>
                                <button className='btn btn-light btn-flatimg border' onClick={() => handleflatrent("Fridge")}
                                    style={rentdata.amenities.includes('Fridge') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={fridge} alt="img" className='h-100 mb-1' />Fridge</button>
                                <button className='btn btn-light border' onClick={() => handleflatrent("AC")}
                                    style={rentdata.amenities.includes('AC') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={aircond} alt="img" className='flat-img' />AC</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("Cupboard")}
                                    style={rentdata.amenities.includes('Cupboard') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={cupboard} alt="img" className='flat-img' />Cupboard</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("Geyser")}
                                    style={rentdata.amenities.includes('Geyser') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={geyser} alt="img" className='flat-img' />Geyser</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatrent("TV")}
                                    style={rentdata.amenities.includes('TV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={tv} alt="img" className='flat-img' />TV</button>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-secondary'>Society Amenities</div>
                            <div className='d-flex flex-wrap flat-ament justify-content-evenly mt-2'>
                                <button className='btn btn-light border' onClick={() => handlesocrent("Lift")}
                                    style={rentdata.amenities.includes('Lift') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiElevator className='mb-1 fs-5 me-2' />Lift</button>
                                <button className='btn btn-light border' onClick={() => handlesocrent("CCTV")}
                                    style={rentdata.amenities.includes('CCTV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><BiCctv className='mb-1 fs-5 me-2' />CCTV</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Kides Area")}
                                    style={rentdata.amenities.includes('Kides Area') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={kidsarea} alt="img" className='flat-img' /><label>Kides Area</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Garden")}
                                    style={rentdata.amenities.includes('Garden') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={garden} alt="img" className='flat-img' /><label>Garden</label></button>
                                <button className='btn btn-light border' onClick={() => handlesocrent("Gym")}
                                    style={rentdata.amenities.includes('Gym') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={gym} alt="img" className='flat-img' /><label>Gym</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Swimming Pool")}
                                    style={rentdata.amenities.includes('Swimming Pool') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={swim} alt="img" className='flat-img' /><label>Swimming Pool</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocrent("Regular Water Supply")}
                                    style={rentdata.amenities.includes('Regular Water Supply') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' /><label>Regular Water Supply</label></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div><h5>Photos Property</h5></div>
                        <div>
                            <div>
                                <label for="formFileMultiplerent" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultiplerent'>Add Photos Now</label>
                                <input className="form-control" type="file" id="formFileMultiplerent" multiple style={{ display: 'none' }}
                                    onChange={handleFileChangerent} />
                            </div>
                            <div className="image-preview-container d-flex flex-wrap">
                                {imagesrent.map((src, index) => (
                                    <div key={index} className="m-2">
                                        <img
                                            src={src}
                                            alt={`Preview ${index}`}
                                            className="img-thumbnail"
                                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                                        />
                                         <button className="close-btn" onClick={() => handleRemoveImage(index)}
                                        >X</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='mt-2'>
                        <div><h5>Video Property</h5></div>
                        <div>
                            <label htmlFor="videoUpload" className="photo-btn text-white fw-bold text-center mt-2 p-2 w-100">Upload Video</label>
                            <input
                                type="file"
                                id="videoUpload"
                                accept="video/*"
                                style={{ display: "none" }}
                                onChange={handleVideoChange}
                            />
                            {/* Video Preview */}
                            {videor && (
                                <div className="mt-1 d-flex">
                                    <video src={videor} controls className="img-thumbnail" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                                    <button className="close-vbtn" onClick={handleRemoveVideo}>X</button>
                                </div>
                            )}
                        </div>
                    </div>
                    {(mode ?? '') !== 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handleRsubmit}>Submit Property</button>)}
                    {mode === 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handleRentupdate}>Save Changes</button>)}
                </div>
            </div>
        </div>
    )
}

export default Rent2