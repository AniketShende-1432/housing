import React, { useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import './App.css'
import Home from './components/home/Home'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Search from './components/search/Search';
import Product from './components/product/Product';
import Login from './components/login/Login';
import Signup from './components/login/Signup';
import Profile from './components/profile/Profile';
import Sell from './components/profile/sell/Sell';
import Sell2 from './components/profile/sell/Sell2';
import Rent from './components/profile/rent/Rent';
import Rent2 from './components/profile/rent/Rent2';
import Plot from './components/profile/plot/Plot';
import Plot2 from './components/profile/plot/Plot2';
import PG from "./components/profile/pg/PG";
import PG2 from './components/profile/pg/PG2';
import Commercial from './components/profile/commercial/Commercial';
import Commercial2 from './components/profile/commercial/Commercial2';
import Rentpro from './components/product/Rentpro';
import Plotpro from './components/product/Plotpro';
import PGpro from './components/product/PGpro';
import Commpro from './components/product/Commpro';
import Manage from './components/manage/Manage';
import Otp from './components/login/Otp';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from './store';

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const base_url = import.meta.env.VITE_BASE_URL;
        const response = await axios.get(`${base_url}/api/v1/checkAuth`, { withCredentials: true });
        if (response.data && response.data.authenticated) {
          dispatch(authActions.login()); // Dispatch login action if authenticated
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
      }
    };
    checkAuthStatus();
  }, [])
  

  return (
    <>
      <Router>
        <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/otp" element={<Otp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/sell" element={<Sell />} />
        <Route path="/profile/sell-property" element={<Sell2 />} />
        <Route path="/profile/rent" element={<Rent />} />
        <Route path="/profile/rent-property" element={<Rent2 />} />
        <Route path="/profile/plot" element={<Plot />} />
        <Route path="/profile/plot-property" element={<Plot2 />} />
        <Route path="/profile/pg" element={<PG />} />
        <Route path="/profile/pg-property" element={<PG2 />} />
        <Route path="/profile/commercial" element={<Commercial />} />
        <Route path="/profile/commercial-property" element={<Commercial2 />} />
        <Route path="/rent-product" element={<Rentpro />} />
        <Route path="/plot-product" element={<Plotpro />} />
        <Route path="/pg-product" element={<PGpro />} />
        <Route path="/commercial-product" element={<Commpro />} />
        <Route path="/manage" element={<Manage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
