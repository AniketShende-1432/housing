import React, { useEffect } from 'react'
import Navbar from './components/navbar/Navbar'
import './App.css'
import Home from './components/home/Home'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Response from './components/response/Response';
import Otp from './components/login/Otp';
import About from './components/aboutus/About';
import Layout from './components/aboutus/Layout';
import Blog from './components/aboutus/Blog';
import Privacy from './components/aboutus/Privacy';
import FAQs from './components/aboutus/FAQs';
import axios from "axios";
import { useDispatch } from 'react-redux';
import { authActions } from './store/Slice';
import { coinActions } from './store/Slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const fetchcoins = async () => {
      try {
        const base_url = import.meta.env.VITE_BASE_URL;
        await axios.get(`${base_url}/api/v1/get-coin`, { withCredentials: true }).then((response) => {
          dispatch(coinActions.setBalance(response.data.coins));
        })
      } catch (error) {
        console.log("Coin error", { toastId: "server-error" });
      }
    }
    checkAuthStatus();
    fetchcoins();
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
          <Route path="/v-response" element={<Response />} />
          <Route path="/about-us" element={<Layout />}>  {/* Wrap Layout here */}
            <Route index element={<About />} />  {/* Default path */}
            <Route path="blogs" element={<Blog />} />
            <Route path="privacy-policy" element={<Privacy />} />
            <Route path="faqs" element={<FAQs />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
