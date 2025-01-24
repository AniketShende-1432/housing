import React from 'react'
import { Link } from 'react-router-dom';
import './Manage.css';

const Mancard = ({ property,path }) => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `${(price / 10000000).toFixed(1)} Cr`; // Crores with 2 decimal places
        } else if (price >= 100000) {
            return `${(price / 100000).toFixed(1)} Lac`; // Lacs with 2 decimal places
        } else if (price >= 1000) {
            return `${(price / 1000).toFixed(1)} K`; // Thousands with 2 decimal places
        } else {
            return price.toString(); // Less than 1000, no formatting needed
        }
    };
    return (
        <>
            <Link className="nav-link active small" aria-current="page" to={path} state={{ property }}>
                <div className='cardsecm bg-white'>
                    <div className='d-flex'>
                        <div><label className='fw-bold'>{property.locality}, {property.city}</label>
                            <label className='ms-4'>₹ {formatPrice(property.type === 'sell' || property.type === 'Plot' || property.type==='Commercial' ? property.price : property.monthlyRent)} &nbsp;&nbsp;in {property.type==='sell' ? property.society : property.type==='Commercial' ? property.projectName : property.societyName}</label>
                        </div>
                        <div className='ms-auto pt-1 prop-id'>Property ID : {property.propertyId}</div>
                    </div>
                </div></Link>
        </>
    )
}

export default Mancard