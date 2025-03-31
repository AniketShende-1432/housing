import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Footer from '../home/Footer';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './About.css';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const filter = location.state;
    console.log(filter);
    const handleSearch = () => {
        navigate('/search', { state: filter });
    }
    const handleabout= ()=>{
        navigate('/about-us');
    }
    const handleblog =()=>{
        navigate('/about-us/blogs');
    }
    const handlePrivacy = ()=>{
        navigate('/about-us/privacy-policy');
    }
    return (
        <div>
            <Navbar back="profile-bg" />
            <main>
                <Outlet />  {/* This renders the child route components dynamically */}
            </main>
            <Footer handleSearch={handleSearch} handleabout={handleabout} handleblog={handleblog} handlePrivacy={handlePrivacy}/>
        </div>
    )
}

export default Layout