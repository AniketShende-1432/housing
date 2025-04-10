import React, { useState } from 'react'
import Profilenav from '../../profilenav/Profilenav';
import axios from "axios";
import Selldrop from '../sell/Selldrop';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
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
import "../sell/Sell.css";
import { Helmet } from "react-helmet-async";

const PG2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { pgData, mode } = location.state || {};
    const [pgdata, setpgdata] = useState(pgData);
    const isLoggedin = useSelector((state) => state.auth.isLoggedIn);
    console.log(pgdata);

    const [imagespg, setImagespg] = useState(pgdata?.images || []); // State to store image previews
    const [selectImage, setselectImage] = useState([]);
    const [simage, setsimage] = useState([]);
    const [videopg, setVideopg] = useState(pgdata?.video || null);
    const [selectVideopg,setselectVideopg] = useState(null);

    const handleFileChangepg = (event) => {
        if (!event.target.files.length) return;
        const files = Array.from(event.target.files); // Convert FileList to an array
        const newFiles = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImagespg((prevImages) => [...prevImages, ...newFiles.map((item) => item.url)]); // Update state with image previews
        setsimage((prevFiles) => [...prevFiles, ...newFiles]);
        setselectImage((prevFiles) => [...prevFiles, ...files]);
        event.target.value = ""; //to have change in value otherwise 
    };
    const handleRemoveImage = (index) => {
        const imageToRemove = imagespg[index]; // This is the image being removed from the preview

        // Case 1: If the image is a Cloudinary URL (from formData.images)
        if (pgdata?.images && pgdata.images.includes(imageToRemove)) {
            // Remove from formData.images
            setpgdata((prevFormData) => ({
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
        setImagespg((prevImages) => prevImages.filter((_, i) => i !== index));
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
        setVideopg(videoUrl);
        setselectVideopg(file);
        event.target.value = ""; // Reset input value
    };

    const handleRemoveVideo = () => {
        if (videopg) {
            URL.revokeObjectURL(videopg);
        }
        if (pgdata?.video && pgdata.video === videopg) {
            // Remove from formData if it's an existing Cloudinary video
            setpgdata((prevFormData) => ({
                ...prevFormData,
                video: null,
            }));
        }
        setVideopg(null);
        setselectVideopg(null);
    };

    const bedroomoptionspg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const balconiesoptionspg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Bathroomoptionspg = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Floornooptionspg = [];
    const Totalflooroptionspg = [];
    const Agepropoptionspg = ['10+'];
    for (let i = 0; i <= 80; i++) {
        Floornooptionspg.push(i);
        Totalflooroptionspg.push(i);
    }
    for (let i = 9; i >= 0; i--) {
        Agepropoptionspg.unshift(i);
    }
    const handleFeaturesChange = (field, value) => {
        setpgdata((prevState) => ({
            ...prevState,
            features: {
                ...prevState.features,
                [field]: field === "ageOfProperty" ? value.toString() : value === '' ? '' : parseInt(value, 10), // Parse as number for all except ageOfProperty
            },
        }));
    };
    const handleflatpg = (amenity) => {
        setpgdata((prevState) => {
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
    const handlesocpg = (amenity) => {
        setpgdata((prevState) => {
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
    const handlepgSubmit = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const pdata = { ...pgdata, type: "PG" };
            const pgrData = new FormData();
            for (let [key, value] of Object.entries(pdata)) {
                if (key === "availableFrom" && value instanceof Date) {
                    value = value.toISOString().split("T")[0]; // Convert to 'yyyy-MM-dd' format
                }
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => pgrData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        pgrData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    pgrData.append(key, value);
                }
            }
            selectImage.forEach((image) => pgrData.append("images", image));
            pgrData.append("video",selectVideopg);
            if (isLoggedin) {
                await axios.post(`${base_url}/api/v2/pgproperty`, pgrData, { withCredentials: true })
                    .then((response) => {
                        if (response.data.message === "Error posting property") {
                            toast.error(response.data.message);
                        } else {
                            toast.success(response.data.message, {
                                onClose: () => {
                                    // Reset form data and navigate after success toast closes
                                    setpgdata({
                                        propertyType: '', city: '', locality: '', societyName: '', roomType: '', capacity: '', furnishedType: '', carpetArea: '',
                                        areaUnit: '', availableFor: '', monthlyRent: '', securityDeposit: '', availableFrom: '', durationOfAgreement: '',
                                        features: {
                                            bedrooms: '',
                                            balconies: '',
                                            bathrooms: '',
                                            ageOfProperty: '',
                                            totalFloors: '',
                                            floorNumber: ''
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
    const handlePgupdate = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const pdata = { ...pgdata, type: "PG" };
            const pgrData = new FormData();
            for (let [key, value] of Object.entries(pdata)) {
                if (key === "availableFrom" && value instanceof Date) {
                    value = value.toISOString().split("T")[0]; // Convert to 'yyyy-MM-dd' format
                }
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => pgrData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        pgrData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    pgrData.append(key, value);
                }
            }
            selectImage.forEach((image) => pgrData.append("newimages", image));
            pgrData.append("newvideo",selectVideopg);
            pgrData.forEach((value, key) => {
                console.log(key, value);
            });
            // Send the update request
            const response = await axios.put(`${base_url}/api/v4/updatepgproperty/${pdata._id}`, pgrData,
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
                <title>PG for Mens/Womens Shared bed</title>
                <meta name="description" content="Find the best PG near me, including PG near me for female, gents PG near me, and unisex PG near me. Explore Zolo PG near me, luxury PG near me, and AC PG near me. Search for PG for ladies near me, single room PG near me, and PG room near me. Discover single sharing PG near me, PG near me ladies, and women PG near me." />
                <meta name="keywords" content="pg near me for female,gents pg near me,zolo pg near me,pg near by me,luxury pg near me,unisex pg near me,
                ac pg near me,pg for ladies near me,single room pg near me,pg near me ladies,pg room near me,single sharing pg near me,women pg near me" />
            </Helmet>
            <Profilenav select="PG" />
            <div className='container main-box w-50'>
                <div className='main2-box bg-white p-4'>
                    <div className='sell-head'><h3>PG Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Features</h5></div>
                        <div className='mt-2 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bedroom"
                                    options={bedroomoptionspg}
                                    value={pgdata.features.bedrooms}
                                    onChange={(value) => handleFeaturesChange("bedrooms", value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Balconies"
                                    options={balconiesoptionspg}
                                    value={pgdata.features.balconies}
                                    onChange={(value) => handleFeaturesChange('balconies', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Bathroom"
                                    options={Bathroomoptionspg}
                                    value={pgdata.features.bathrooms}
                                    onChange={(value) => handleFeaturesChange('bathrooms', value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Age of Property"
                                    options={Agepropoptionspg}
                                    value={pgdata.features.ageOfProperty}
                                    onChange={(value) => handleFeaturesChange('ageOfProperty', value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Total Floor"
                                    options={Totalflooroptionspg}
                                    value={pgdata.features.totalFloors}
                                    onChange={(value) => handleFeaturesChange('totalFloors', value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Floor no"
                                    options={Floornooptionspg}
                                    value={pgdata.features.floorNumber}
                                    onChange={(value) => handleFeaturesChange('floorNumber', value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Add Amenities</h5></div>
                        <div>
                            <div className='text-secondary'>Flat Furnishing</div>
                            <div className='d-flex flex-wrap justify-content-evenly flat-ament mt-2'>
                                <button className='btn btn-light border' onClick={() => handleflatpg("Washing Machine")}
                                    style={pgdata.amenities.includes('Washing Machine') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiWashingMachine className='mb-1 fs-5 me-2' />Washing Machine</button>
                                <button className='btn btn-light border' onClick={() => handleflatpg("Sofa")}
                                    style={pgdata.amenities.includes('Sofa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiSofa className='mb-1 fs-5 me-2' />Sofa</button>
                                <button className='btn btn-light border' onClick={() => handleflatpg("Bed")}
                                    style={pgdata.amenities.includes('Bed') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaBed className='mb-1 fs-5 me-2' />Bed</button>
                                <button className='btn btn-light btn-flatimg border' onClick={() => handleflatpg("Fridge")}
                                    style={pgdata.amenities.includes('Fridge') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={fridge} alt="img" className='h-100 mb-1' />Fridge</button>
                                <button className='btn btn-light border' onClick={() => handleflatpg("AC")}
                                    style={pgdata.amenities.includes('AC') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={aircond} alt="img" className='flat-img' />AC</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatpg("Cupboard")}
                                    style={pgdata.amenities.includes('Cupboard') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={cupboard} alt="img" className='flat-img' />Cupboard</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatpg("Geyser")}
                                    style={pgdata.amenities.includes('Geyser') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={geyser} alt="img" className='flat-img' />Geyser</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleflatpg("TV")}
                                    style={pgdata.amenities.includes('TV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={tv} alt="img" className='flat-img' />TV</button>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-secondary'>Society Amenities</div>
                            <div className='d-flex flex-wrap flat-ament justify-content-evenly mt-2'>
                                <button className='btn btn-light border' onClick={() => handlesocpg("Lift")}
                                    style={pgdata.amenities.includes('Lift') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiElevator className='mb-1 fs-5 me-2' />Lift</button>
                                <button className='btn btn-light border' onClick={() => handlesocpg("CCTV")}
                                    style={pgdata.amenities.includes('CCTV') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><BiCctv className='mb-1 fs-5 me-2' />CCTV</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocpg("Kides Area")}
                                    style={pgdata.amenities.includes('Kides Area') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={kidsarea} alt="img" className='flat-img' /><label>Kides Area</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocpg("Garden")}
                                    style={pgdata.amenities.includes('Garden') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={garden} alt="img" className='flat-img' /><label>Garden</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocpg("Swimming Pool")}
                                    style={pgdata.amenities.includes('Swimming Pool') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={swim} alt="img" className='flat-img' /><label>Swimming Pool</label></button>
                                <button className='btn btn-light border' onClick={() => handlesocpg("Gym")}
                                    style={pgdata.amenities.includes('Gym') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={gym} alt="img" className='flat-img' /><label>Gym</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlesocpg("Regular Water Supply")}
                                    style={pgdata.amenities.includes('Regular Water Supply') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' /><label>Regular Water Supply</label></button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5">
                        <div><h5>Photos Property</h5></div>
                        <div>
                            <div>
                                <label for="formFileMultiplepg" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultiplepg'>Add Photos Now</label>
                                <input className="form-control" type="file" id="formFileMultiplepg" multiple style={{ display: 'none' }}
                                    onChange={handleFileChangepg} />
                            </div>
                            <div className="image-preview-container d-flex flex-wrap">
                                {imagespg.map((src, index) => (
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
                            {videopg && (
                                <div className="mt-1 d-flex">
                                    <video src={videopg} controls className="img-thumbnail" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                                    <button className="close-vbtn" onClick={handleRemoveVideo}>X</button>
                                </div>
                            )}
                        </div>
                    </div>
                    {(mode ?? '') !== 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlepgSubmit}>Submit Property</button>)}
                    {mode === 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlePgupdate}>Save Changes</button>)}
                </div>
            </div>
        </div>
    )
}

export default PG2