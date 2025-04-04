import React from 'react';
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import './Response.css';

const Viewcard = ({ property, view }) => {
  return (
    <>
      {/* <div className='view-card p-2 border border-dark row mt-1'>
            <div className='col-3'><FaUser className='fs-6 view-icon mb-1'/>&nbsp;&nbsp;{view[0].userId.name}</div>
            <div className='col-3'><MdEmail className='fs-5 view-icon mb-1'/>&nbsp;&nbsp;{view[0].userId.email}</div>
            <div className='col-3'><FaPhoneAlt className='fs-6 view-icon mb-1'/>&nbsp;&nbsp;{view[0].userId.phone}</div>
            <div className='col-3'>PropertyID: {property.propertyId}</div>
        </div> */}
      <div className="view-card p-2 border border-dark mt-2">
        <div className="fw-bold">Property ID: {property.propertyId}</div>
        <div className='table-responsive'>
        <table className="table table-bordered table-sm mt-2 mb-0">
          <thead className="table-warning">
            <tr>
              <th className='d-none d-sm-block'>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {view.map((user, index) => (
              <tr key={user.userId._id}>
                <td className='d-none d-sm-block'>{index + 1}</td>
                <td className='text-nowrap'>{user.userId.name}</td>
                <td>{user.userId.email}</td>
                <td>{user.userId.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </>
  )
}

export default Viewcard