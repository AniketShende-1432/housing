import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar'
import axios from "axios";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Mancard from "./Mancard";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Manage.css';
const Manage = () => {

    const navigate = useNavigate();
    const [mproperties, setPropertiesm] = useState({});
    console.log(mproperties);
    const [refbtn, setrefbtn] = useState({});

    useEffect(() => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${base_url}/api/v4/userproperties`, {
                    withCredentials: true, // Include cookies in request
                });
                if (response.data.message) {
                    toast.error(response.data.message, { toastId: "login-err" });
                }
                setPropertiesm(response.data);
                const updatedButtons = {};
                Object.keys(response.data).forEach((category) => {
                    response.data[category].forEach((property) => {
                        if (property.lastVisitTime) {
                            const lastVisitTime = new Date(property.lastVisitTime).getTime();
                            const timeDiff = Date.now() - lastVisitTime;
                            updatedButtons[property.propertyId] = timeDiff < 5 * 60 * 1000; // true = red, false = green
                        }
                    });
                });
                setrefbtn(updatedButtons);
            } catch (err) {
                console.error("Error fetching properties:", err);
            }
        };

        fetchProperties();
    }, []);
    const handleDeleteproperty = async (propertyId, propertyType) => {
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.delete(`${base_url}/api/v4/deleteproperty/${propertyId}`, {
                data: { propertyType }, // Include propertyType in the body
                withCredentials: true,
            });

            if (response.data.message === 'Property deleted successfully') {
                toast.success(response.data.message);
                // Refresh or update the state to reflect the deletion
                let lowerCaseType = propertyType.toLowerCase();
                setPropertiesm(prevProperties => ({
                    ...prevProperties, // Spread the existing properties
                    [lowerCaseType]: prevProperties[lowerCaseType].filter(property => property._id !== propertyId) // Filter out the deleted property
                }));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting property');
        }
    };
    const handlevisit = async (propertyId, propertyType, propertyID) => {
        try {
            if (refbtn[propertyID]) {
                toast.info('Try After Sometime');
                return;
            }
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.put(`${base_url}/api/v4/property-visit/${propertyType}/${propertyId}`, { withCredentials: true, });

            if (!response.data.success) {
                toast.error('Property is not Refreshed');
            }
            else {
                setrefbtn((prev) => ({ ...prev, [propertyID]: true }));
                setTimeout(() => {
                    setrefbtn((prev) => ({ ...prev, [propertyID]: false }));
                }, 5 * 60 * 1000);
            }
        } catch (error) {
            toast.error('Error refreshing property');
        }
    };
    const handleStatusActive = async (propertyId, type) => {
        const newStatus = "Active";
        const data = { status: newStatus, propertyType: type };
        const proptype = type.toLowerCase();
        const base_url = import.meta.env.VITE_BASE_URL;
        try {
            // Make the API call to delete the property by ID and type
            const response = await axios.put(`${base_url}/api/v4/property-status/${propertyId}`, data, { withCredentials: true, });

            if (response.data.message) {
                setPropertiesm(prevPropertiesm => ({
                    ...prevPropertiesm, // Keep all other property types unchanged
                    [proptype]: prevPropertiesm[proptype].map(property =>
                        property._id === propertyId ? { ...property, status: newStatus } : property
                    ),
                }));
            }
        } catch (error) {
            toast.error('Error changing property status');
        }
    }

    return (
        <div className='main-page'>
            <Navbar back="profile-bg" />
            <div className="container-lg container-fluid mt-4 d-flex flex-column manage-main">
                {mproperties.sell?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/product" />
                        </div>
                        <div className="manage-btn d-flex">
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="edt-btn" onClick={() => navigate('/profile/sell', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                                <button className='mt-2 mt-sm-0 del-btn' onClick={() => handleDeleteproperty(property._id, property.type)}>
                                    <RiDeleteBin6Line className="fs-5" /></button>
                            </div>
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="btn btn-info p-0 h-75 px-1 border ms-1 repost-btn" onClick={() => handleStatusActive(property._id, property.type)} >Repost</button>
                                <button className={`ref-btn rounded border px-1 ms-1 mt-2 mt-sm-0 ${refbtn[property.propertyId] && 'bg-danger'}`} onClick={() => handlevisit(property._id, property.type, property.propertyId)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                ))}
                {mproperties.rent?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/rent-product" />
                        </div>
                        <div className="manage-btn d-flex">
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="edt-btn" onClick={() => navigate('/profile/rent', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                                <button className='mt-2 mt-sm-0 del-btn' onClick={() => handleDeleteproperty(property._id, property.type)}>
                                    <RiDeleteBin6Line className="fs-5" /></button>
                            </div>
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="btn btn-info p-0 h-75 px-1 border ms-1 repost-btn" onClick={() => handleStatusActive(property._id, property.type)} >Repost</button>
                                <button className={`ref-btn rounded border px-1 ms-1 mt-2 mt-sm-0 ${refbtn[property.propertyId] && 'bg-danger'}`} onClick={() => handlevisit(property._id, property.type, property.propertyId)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                ))}
                {mproperties.plot?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/plot-product" />
                        </div>
                        <div className="manage-btn d-flex">
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="edt-btn" onClick={() => navigate('/profile/plot', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                                <button className='mt-2 mt-sm-0 del-btn' onClick={() => handleDeleteproperty(property._id, property.type)}><RiDeleteBin6Line className="fs-5" /></button>
                            </div>
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="btn btn-info p-0 h-75 px-1 border ms-1 repost-btn" onClick={() => handleStatusActive(property._id, property.type)} >Repost</button>
                                <button className={`ref-btn rounded border px-1 ms-1 mt-2 mt-sm-0 ${refbtn[property.propertyId] && 'bg-danger'}`} onClick={() => handlevisit(property._id, property.type, property.propertyId)}>Refresh</button>
                            </div>
                        </div>
                    </div> // Render a card for each property
                ))}
                {mproperties.pg?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/pg-product" />
                        </div>
                        <div className="manage-btn d-flex">
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="edt-btn" onClick={() => navigate('/profile/pg', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /> </button>
                                <button className='mt-2 mt-sm-0 del-btn' onClick={() => handleDeleteproperty(property._id, property.type)}>
                                    <RiDeleteBin6Line className="fs-5" /></button>
                            </div>
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="btn btn-info p-0 h-75 px-1 border ms-1 repost-btn" onClick={() => handleStatusActive(property._id, property.type)} >Repost</button>
                                <button className={`ref-btn rounded border px-1 ms-1 mt-2 mt-sm-0 ${refbtn[property.propertyId] && 'bg-danger'}`} onClick={() => handlevisit(property._id, property.type, property.propertyId)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                ))}
                {mproperties.commercial?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/commercial-product" />
                        </div>
                        <div className="manage-btn d-flex">
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="edt-btn" onClick={() => navigate('/profile/commercial', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                                <button className='mt-2 mt-sm-0 del-btn' onClick={() => handleDeleteproperty(property._id, property.type)}>
                                    <RiDeleteBin6Line className="fs-5" /></button>
                            </div>
                            <div className="d-flex flex-column flex-sm-row">
                                <button className="btn btn-info p-0 h-75 px-1 border ms-1 repost-btn" onClick={() => handleStatusActive(property._id, property.type)} >Repost</button>
                                <button className={`ref-btn rounded border px-1 ms-1 mt-2 mt-sm-0 ${refbtn[property.propertyId] && 'bg-danger'}`} onClick={() => handlevisit(property._id, property.type, property.propertyId)}>Refresh</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Manage