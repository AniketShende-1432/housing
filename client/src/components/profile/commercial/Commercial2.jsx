import React, { useState } from 'react'
import Profilenav from '../../profilenav/Profilenav';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Selldrop from '../sell/Selldrop';
import { GiElevator } from "react-icons/gi";
import water from "../../../assets/storage.png";
import rain from "../../../assets/rain.png";
import vastu from "../../../assets/vastu.png";
import waste from "../../../assets/waste.png";
import { BiCctv } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa";
import { GiPowerGenerator } from "react-icons/gi";
import { FaRoad } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Commercial2 = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { CommData, mode } = location.state || {};
    const [commdata, setcommdata] = useState(CommData);
    console.log(commdata);
    const [imagescomm, setImagescomm] = useState(commdata?.images || []); // State to store image previews
    const [selectcommImage, setselectcommImage] = useState([]);
    const isLoggedin = useSelector((state) => state.auth.isLoggedIn);
    const [simage, setsimage] = useState([]);
    const [videoc, setVideoc] = useState(commdata?.video || null);
    const [selectVideoc, setselectVideoc] = useState(null);

    const Bathroomoptionscomm = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const Floornooptionscomm = [];
    const Totalflooroptionscomm = [];
    const Agepropoptionscomm = ['10+'];
    for (let i = 0; i <= 80; i++) {
        Floornooptionscomm.push(i);
        Totalflooroptionscomm.push(i);
    }
    for (let i = 9; i >= 0; i--) {
        Agepropoptionscomm.unshift(i);
    }
    const handlecommFeaturesChange = (field, value) => {
        setcommdata((prevState) => ({
            ...prevState,
            features: {
                ...prevState.features,
                [field]: field === "ageOfProperty" ? value.toString() : value === '' ? '' : parseInt(value, 10), // Parse as number for all except ageOfProperty
            },
        }));
    };
    const handleamenitycomm = (amenity) => {
        setcommdata((prevState) => {
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
    const handlecomm = (amenity) => {
        setcommdata((prevState) => {
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
    const handleFileChangecomm = (event) => {
        if (!event.target.files.length) return;
        const files = Array.from(event.target.files); // Convert FileList to an array
        const newFiles = files.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImagescomm((prevImages) => [...prevImages, ...newFiles.map((item) => item.url)]); // Update state with image previews
        setsimage((prevFiles) => [...prevFiles, ...newFiles]);
        setselectcommImage((prevFiles) => [...prevFiles, ...files]);
        event.target.value = "";
    };
    const handleRemoveImage = (index) => {
        const imageToRemove = imagescomm[index]; // This is the image being removed from the preview
        // Case 1: If the image is a Cloudinary URL (from formData.images)
        if (commdata?.images && commdata.images.includes(imageToRemove)) {
            // Remove from formData.images
            setcommdata((prevFormData) => ({
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
                setselectcommImage((prevFiles) => prevFiles.filter((_, i) => i !== fileIndex));
            }
        }

        // Remove from the image preview array (this is common for both cases)
        setImagescomm((prevImages) => prevImages.filter((_, i) => i !== index));
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
        setVideoc(videoUrl);
        setselectVideoc(file);
        event.target.value = ""; // Reset input value
    };

    const handleRemoveVideo = () => {
        if (videoc) {
            URL.revokeObjectURL(videoc);
        }
        if (commdata?.video && commdata.video === videoc) {
            // Remove from formData if it's an existing Cloudinary video
            setcommdata((prevFormData) => ({
                ...prevFormData,
                video: null,
            }));
        }
        setVideoc(null);
        setselectVideoc(null);
    };
    const handlerera = (e) => {
        const {name, value} = e.target;
        setcommdata((prevState)=>({
            ...prevState,
            [name]:value
        }))
    }
    const handlecommSubmit = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const cdata = { ...commdata, type: "Commercial" };
            const commData = new FormData();
            for (let [key, value] of Object.entries(cdata)) {
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => commData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        commData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    commData.append(key, value);
                }
            }
            selectcommImage.forEach((image) => commData.append("images", image));
            commData.append("video", selectVideoc);
            if (isLoggedin) {
                await axios.post(`${base_url}/api/v2/commercialproperty`, commData, { withCredentials: true })
                    .then((response) => {
                        if (response.data.message === "Error posting property") {
                            toast.error(response.data.message);
                        } else {
                            toast.success(response.data.message, {
                                onClose: () => {
                                    // Reset form data and navigate after success toast closes
                                    setcommdata({
                                        type: "", propertyType: "", city: "", locality: "", projectName: "", possessionStatus: "", carpetArea: "", areaUnit: "",
                                        ownership: "", price: '',
                                        features: {
                                            washroom: '',
                                            ageOfProperty: "",
                                            totalFloors: '',
                                            floorNumber: ''
                                        },
                                        amenities: [],
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
    const handleCommupdate = async (e) => {
        e.preventDefault();
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const cdata = { ...commdata, type: "Commercial" };
            const commData = new FormData();
            for (let [key, value] of Object.entries(cdata)) {
                if (Array.isArray(value)) {
                    // If the value is an array (like amenities or images), append each item
                    value.forEach((item) => commData.append(key, item));
                } else if (typeof value === "object" && value !== null) {
                    // If the value is an object (like features), append each property of the object
                    for (const [subKey, subValue] of Object.entries(value)) {
                        commData.append(`${key}[${subKey}]`, subValue);
                    }
                } else {
                    // For other simple data types, append directly
                    commData.append(key, value);
                }
            }
            selectcommImage.forEach((image) => commData.append("newimages", image));
            commData.append("newvideo", selectVideoc);
            //Send the update request
            const response = await axios.put(`${base_url}/api/v4/updatecommproperty/${cdata._id}`, commData,
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
        <div className="rent-cont" style={{ backgroundColor: "#FFF5EE" }}>
            <Profilenav select="Commercial" />
            <div className='container rent-main-box w-50'>
                <div className='rent-main2-box bg-white p-4'>
                    <div className='rent-head'><h3>Commercial Property</h3></div>
                    <div className='mt-4'>
                        <div><h5>Property Features</h5></div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Washroom"
                                    options={Bathroomoptionscomm}
                                    value={commdata.features.washroom}
                                    onChange={(value) => handlecommFeaturesChange("washroom", value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Age of Property"
                                    options={Agepropoptionscomm}
                                    value={commdata.features.ageOfProperty}
                                    onChange={(value) => handlecommFeaturesChange("ageOfProperty", value)}
                                />
                            </div>
                        </div>
                        <div className='mt-3 d-flex justify-content-around'>
                            <div>
                                <Selldrop
                                    label="Total Floor"
                                    options={Totalflooroptionscomm}
                                    value={commdata.features.totalFloors}
                                    onChange={(value) => handlecommFeaturesChange("totalFloors", value)}
                                />
                            </div>
                            <div className='drop2-div'>
                                <Selldrop
                                    label="Floor no/ Room no"
                                    options={Floornooptionscomm}
                                    value={commdata.features.floorNumber}
                                    onChange={(value) => handlecommFeaturesChange("floorNumber", value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <h5>RERA Approved</h5>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle rera-drop" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {commdata.reraApproved || 'Select'}
                            </button>
                            <ul className="dropdown-menu">
                                <li><button className="dropdown-item" type="button" name='reraApproved' onClick={handlerera} value="Yes">Yes</button></li>
                                <li><button className="dropdown-item" type="button" name='reraApproved' onClick={handlerera} value="No">No</button></li>
                                <li><button className="dropdown-item" type="button" name='reraApproved' onClick={handlerera} value="I have Applied">I have Applied</button></li>
                                <li><button className="dropdown-item" type="button" name='reraApproved' onClick={handlerera} value="Not Applicable">Not Applicable</button></li>
                            </ul>
                        </div>
                        <div className='mt-3'>
                            {commdata.reraApproved === 'Yes' ? 
                            <input type="text" name="reraNumber" className='rera-inp' placeholder='Enter RERA Number' value={commdata.reraNumber} 
                            onChange={handlerera}/>
                        :''}
                        </div>
                    </div>
                    <div className='mt-5'>
                        <div><h5>Add Amenities</h5></div>
                        <div>
                            <div className='text-secondary'>Amenities</div>
                            <div className='d-flex flex-wrap justify-content-center justify-content-sm-start flat-ament mt-2'>
                                <button className='btn btn-light btn-flatimg border' onClick={() => handleamenitycomm("Rain Water Harvesting")}
                                    style={commdata.amenities.includes("Rain Water Harvesting") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={rain} alt="img" className='flat-img' />Rain Water Harvesting</button>
                                <button className='btn btn-light border' onClick={() => handleamenitycomm("Lift")}
                                    style={commdata.amenities.includes("Lift") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiElevator className='mb-1 fs-5 me-2' />Lift</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleamenitycomm("Water Storage")}
                                    style={commdata.amenities.includes("Water Storage") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={water} alt="img" className='flat-img' />Water Storage</button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handleamenitycomm("Waste Disposal")}
                                    style={commdata.amenities.includes("Waste Disposal") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={waste} alt="img" className='flat-img' />Waste Disposal</button>
                                <button className='btn btn-light border' onClick={() => handleamenitycomm("Vaastu Compliant")}
                                    style={commdata.amenities.includes("Vaastu Compliant") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><img src={vastu} alt="img" className='flat-img' />Vaastu Compliant</button>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <div className='text-secondary'>Building/Society Feature</div>
                            <div className='d-flex flex-wrap flat-ament justify-content-center justify-content-lg-start mt-2'>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlecomm("Shooping Centre")}
                                    style={commdata.amenities.includes("Shooping Centre") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaShoppingCart className='fs-5 me-2' /><label>Shooping Centre</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlecomm("Grade A Building")}
                                    style={commdata.amenities.includes("Grade A Building") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaBuilding className='fs-5 me-2' /><label>Grade A Building</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlecomm("Main Road")}
                                    style={commdata.amenities.includes("Main Road") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><FaRoad className='fs-5 me-2 mt-1' /><label>Main Road</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlecomm("Power Backup")}
                                    style={commdata.amenities.includes("Power Backup") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><GiPowerGenerator className='fs-5 me-2' /><label>Power Backup</label></button>
                                <button className='btn btn-light border d-flex justify-content-center align-items-center' onClick={() => handlecomm("CCTV")}
                                    style={commdata.amenities.includes("CCTV") ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} ><BiCctv className='fs-5 me-2' /><label>CCTV</label></button>
                            </div>
                        </div>
                        <div className="mt-5">
                            <div><h5>Photos Property</h5></div>
                            <div>
                                <div>
                                    <label for="formFileMultiplecomm" class="form-label photo-btn text-white fw-bold text-center mt-2 p-2 w-100" htmlFor='formFileMultiplecomm'>Add Photos Now</label>
                                    <input className="form-control" type="file" id="formFileMultiplecomm" multiple style={{ display: 'none' }}
                                        onChange={handleFileChangecomm} />
                                </div>
                                <div className="image-preview-container d-flex flex-wrap">
                                    {imagescomm.map((src, index) => (
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
                                {videoc && (
                                    <div className="mt-1 d-flex">
                                        <video src={videoc} controls className="img-thumbnail" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                                        <button className="close-vbtn" onClick={handleRemoveVideo}>X</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {(mode ?? '') !== 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handlecommSubmit}>Submit Property</button>)}
                        {mode === 'edit' && (<button className='sell-btn p-2 w-100 text-white fw-bold mt-3' onClick={handleCommupdate}>Save Changes</button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Commercial2