import React,{ useEffect, useState } from 'react'
import Navbar from "../navbar/Navbar";
import { Link, useNavigate } from 'react-router-dom';

const Profilenav = ({select}) => {

    const navigate = useNavigate();

    useEffect(() => {
        const navbar = document.getElementById('navbar');
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY) {
                // Scrolling down, hide the navbar
                navbar.classList.remove('show');
            } else {
                // Scrolling up, show the navbar
                navbar.classList.add('show');
            }

            lastScrollY = currentScrollY;
        };

        const handleMouseMove = (e) => {
            if (e.clientY <= 110) {
                // Cursor near the top of the screen, show navbar
                navbar.classList.add('show');
            } else {
                // Cursor away from the top, hide navbar
                navbar.classList.remove('show');
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div>
            <div className='sell-cont-nav'>
                <Navbar back="profile-bg" login="login-box2" cname="sell-nav" />
                <div className='sell-cont-box' id='navbar'>
                    <div className='p-cont-box1 d-flex justify-content-around'>
                        <div className={`sell-itm d-none d-sm-block${select === 'Buy' ? 'sell-itmcol' : ''}`} onClick={() => navigate('/', { state: { tab: 'Buy' } })}>Buy</div>
                        <div className={`sell-itm ${select === 'Sell' ? 'sell-itmcol' : ''}`}><Link className="nav-link active small" aria-current="page" to="/profile/sell">Sell</Link></div>
                        <div className={`sell-itm ${select === 'Rent' ? 'sell-itmcol' : ''}`}><Link className="nav-link active small" aria-current="page" to="/profile/rent">Rent</Link></div>
                        <div className={`sell-itm ${select === 'Plot/Land' ? 'sell-itmcol' : ''}`}><Link className="nav-link active small" aria-current="page" to="/profile/plot">Plot/Land</Link></div>
                        <div className={`sell-itm ${select === 'PG' ? 'sell-itmcol' : ''}`}><Link className="nav-link active small" aria-current="page" to="/profile/pg">PG</Link></div>
                        <div className={`sell-itm ${select === 'Commercial' ? 'sell-itmcol' : ''}`}><Link className="nav-link active small" aria-current="page" to="/profile/commercial">Commercial</Link></div>
                        <div className={`sell-itm d-none d-sm-block ${select === 'Home Loan' ? 'sell-itmcol' : ''}`}>Home Loan</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profilenav