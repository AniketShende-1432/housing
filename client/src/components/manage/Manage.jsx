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
    useEffect(() => {
        const base_url = import.meta.env.VITE_BASE_URL;
        const fetchProperties = async () => {
            try {
                const response = await axios.get(`${base_url}/api/v4/userproperties`, {
                    withCredentials: true, // Include cookies in request
                });
                if(response.data.message){
                    toast.error(response.data.message,{ toastId: "login-err" });
                }
                setPropertiesm(response.data);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError("Unable to fetch properties. Please try again.");
            }
        };

        fetchProperties();
    }, []);
    const handleDeleteproperty = async (propertyId, propertyType) => {
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.delete(`${base_url}/api/v4/deleteproperty/${propertyId}`,{
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
            }else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error('Error deleting property');
        }
    };
    return (
        <div className='main-page'>
            <Navbar back="profile-bg" />
            <div className="container mt-4 d-flex flex-column manage-main">
                {mproperties.sell?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                            <Mancard key={property._id} property={property} path="/product"/>
                        </div>
                        <div className="manage-btn d-flex">
                            <button onClick={() => navigate('/profile/sell', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5"/></button>
                            <button onClick={() => handleDeleteproperty(property._id, property.type)}>
                            <RiDeleteBin6Line className="fs-5" /></button>
                        </div>
                    </div>
                ))}
                {mproperties.rent?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                        <Mancard key={property._id} property={property} path="/rent-product"/>
                        </div>
                        <div className="manage-btn d-flex">
                            <button onClick={() => navigate('/profile/rent', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                            <button onClick={() => handleDeleteproperty(property._id, property.type)}>
                            <RiDeleteBin6Line className="fs-5" /></button>
                        </div>
                    </div>
                ))}
                {mproperties.plot?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                        <Mancard key={property._id} property={property} path="/plot-product"/>
                        </div>
                        <div className="manage-btn d-flex">
                            <button onClick={() => navigate('/profile/plot', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                            <button onClick={() => handleDeleteproperty(property._id, property.type)}><RiDeleteBin6Line className="fs-5" /></button>
                        </div>
                    </div> // Render a card for each property
                ))}
                {mproperties.pg?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                        <Mancard key={property._id} property={property} path="/pg-product"/>
                        </div>
                        <div className="manage-btn d-flex">
                            <button onClick={() => navigate('/profile/pg', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /> </button>
                            <button onClick={() => handleDeleteproperty(property._id, property.type)}>
                            <RiDeleteBin6Line className="fs-5" /></button>
                        </div>
                    </div>
                ))}
                {mproperties.commercial?.map((property) => (
                    <div className="d-flex justify-content-center manage-box">
                        <div className="manage-card">
                        <Mancard key={property._id} property={property} path="/commercial-product"/>
                        </div>
                        <div className="manage-btn d-flex">
                            <button onClick={() => navigate('/profile/commercial', { state: { property, mode: 'edit' } })}><FaRegEdit className="mb-1 fs-5" /></button>
                            <button onClick={() => handleDeleteproperty(property._id, property.type)}>
                            <RiDeleteBin6Line className="fs-5" /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Manage