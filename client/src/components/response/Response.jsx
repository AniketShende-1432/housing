import { React, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import Viewcard from './Viewcard';
import Selldrop from '../profile/sell/Selldrop';
import { toast } from 'react-toastify';
import './Response.css';

const Response = () => {
  const [propertyViews, setPropertyViews] = useState(null);
  const [Idoptions, setIdoptions] = useState([]);
  const [selectid, setselectid] = useState('');
  let proprtyIdopt = [];
  if (Idoptions.length > 0) {
    proprtyIdopt = Idoptions.map(item => item.propertyId)
  }
  console.log(propertyViews);

  useEffect(() => {
    const fetchPropertyId = async () => {
      const base_url = import.meta.env.VITE_BASE_URL;
      try {
        const response = await axios.get(`${base_url}/api/v7/userpropertiesId`, {
          withCredentials: true, // Include cookies in request
        });
        if (response.data.message) {
          toast.error(response.data.message, { toastId: "login-err" });
        }
        let data = response.data;
        const allIds = [
          ...data.sell,
          ...data.rent,
          ...data.plot,
          ...data.pg,
          ...data.commercial
        ];
        setIdoptions(allIds);
      } catch (error) {
        console.error("Error fetching property views:", error);
      }
    };
    fetchPropertyId();
  }, []);

  const fetchPropertyViews = async () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    if (!selectid) {
      toast.error("No propertyId selected.");
      return;
    }
    const found = Idoptions.find(item => item.propertyId === selectid);
    try {
      const response = await axios.get(`${base_url}/api/v7/my-property-views/${found._id}`, {
        withCredentials: true, // Include cookies in request
      });
      setPropertyViews(response.data.propertyViews);
    } catch (error) {
      console.error("Error fetching property views:", error);
    }
  };

  return (
    <div className='response-main'>
      <Navbar back="profile-bg" />
      <div className='container-lg container-fluid'>
        <div className='mt-3 fw-bold fs-4 view-head'>View Response</div>
        <div className='d-flex'>
          <div className='flex-grow-1'>
            {Idoptions.length > 0 ? (
              <Selldrop
                label=""
                options={proprtyIdopt}
                value={selectid}
                onChange={(value) => setselectid(value)}
                placeholder="Enter ID"
              />
            ) : (
              <p>Loading property IDs...</p> // Show a message while fetching data
            )}
          </div>
          <button type="submit" className='btn btn-warning text-white view-src-btn ms-2' onClick={fetchPropertyViews}>Search</button>
        </div>
        <div>
          {propertyViews === null ? null : // Show nothing initially
            propertyViews.length > 0 ? (
              propertyViews.map((view) => (
                <Viewcard key={view._id} property={view.propertyId} view={view.views} />
              ))
            ) : (
              <p className='mt-2 fs-5 fw-bold ms-2'>No View response yet.</p>
            )}
        </div>
      </div>
    </div>
  )
}

export default Response