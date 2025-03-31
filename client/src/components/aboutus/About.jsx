import React from 'react'
import { Link } from 'react-router-dom';
import about from '../../assets/about.jpg';

const About = () => {
    return (
        <div>
            <div className='d-flex row justify-content-center align-items-center w-100'>
                <div className='d-flex flex-column align-items-center col-sm-6 col-lg-7 pe-0 ps-4 p-sm-5 pe-sm-0 p-lg-0'>
                    <div className='h-text fs-4 fw-bold mt-4 mt-sm-0'>Welcome to ShelterBIG.com !!</div>
                    <div className='fw-bold fs-5'>About Us</div>
                    <p className='parag'>At ShelterBig, we understand the importance of finding the perfect place to call home. Whether you're searching for a cozy apartment, a spacious house, or a commercial property, our mission is to connect you with the right property that meets your needs. With a user-friendly platform, comprehensive listings, and a commitment to transparency, we make the property search process smooth and stress-free. Trust ShelterBig to help you discover your next big shelter – because your dream property is just a click away.</p>
                    <Link className='me-auto get-btn p-2 rounded text-white' to='/'>Get Started</Link>
                </div>
                <div className='col-sm-6 col-lg-4'>
                    <img src={about} className='about-img d-none d-sm-block' alt="about" />
                </div>
            </div>
        </div>
    )
}

export default About