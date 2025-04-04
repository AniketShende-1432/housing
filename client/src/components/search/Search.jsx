import React, { useState, useEffect, useRef } from 'react'
import { IoIosArrowDown } from "react-icons/io";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import "./Search.css"
import build from "../../assets/building.jpg";
import { FaPhoneAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Propcard from "./Propcard";
import Rentcard from './Rentcard';
import Plotcard from './Plotcard';
import PGcard from './PGcard';
import Commcard from './Commcard';
import coin from '../../assets/coin.png';
import { CiFilter } from "react-icons/ci";
import { FcFilledFilter } from "react-icons/fc";
import { coinActions } from '../../store/Slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet-async";
import MultiRangeSlider from "multi-range-slider-react";

const Search = () => {

    const location = useLocation();
    const dispatch = useDispatch();
    const initialFilter = {
        ...location.state, // Prioritize location.state for other properties
        tab: localStorage.getItem('filterTab') || location.state?.tab, // Use localStorage or fallback to location.state or default
    };
    const [Filter, setFilter] = useState(initialFilter);
    const balance = useSelector((state) => state.coin.balance);
    const [coins, setcoins] = useState(balance);
    const [filterdata, setfilterdata] = useState({
        minbudget: 0, maxbudget: 1000000000, minrent: 0, maxrent: 1000000, propertyType: [Filter.property], bedrooms: [], minarea: 0, maxarea: 4000, roomtype: [],
        photos: false, videos: false, Availablefor: [],
        ownership: [],
        approvedby: [],
        commproper: [],
        city: Filter.city!=='' ?  Filter.city : Filter.location,
        localities: [Filter.location],
        reraApproved: [],
    });
    useEffect(() => {
        localStorage.setItem('filterTab', Filter.tab);
        setfilterdata({
            minbudget: 0, maxbudget: 1000000000, minrent: 0, maxrent: 1000000, propertyType: [Filter.property], bedrooms: [], minarea: 0, maxarea: 4000, roomtype: [],
            photos: false, videos: false, Availablefor: [],
            ownership: [],
            approvedby: [],
            commproper: [],
            city: Filter.city!=='' ?  Filter.city : Filter.location,
            localities: [Filter.location],
            reraApproved: [],
        })
    }, [Filter.tab]);

    const [properties, setProperties] = useState({
        sell: [],
        rent: [],
        plot: [],
        pg: [],
        commercial: [],
    });
    const [visibility, setVisibility] = useState({
        budget: true,
        type: false,
        Nbed: false,
        area: false,
        locate: false,
        rera: false,
    });

    const [searchTrigger, setSearchTrigger] = useState(false);
    console.log(filterdata);
    const modalRef = useRef(null);
    const [owner, setowner] = useState({});

    useEffect(() => {
        const fetchProperties = async () => {
            const base_url = import.meta.env.VITE_BASE_URL;
            try {
                const propertyType = {
                    Buy: 'sell',
                    Rent: 'rent',
                    'Plot/Land': 'plot',
                    PG: 'pg',
                    Commercial: 'commercial',
                }[Filter.tab];
                let url = `${base_url}/api/v3/properties/${propertyType}`;
                const queryParams = Object.keys(filterdata)
                    .filter((key) => {
                        const value = filterdata[key];
                        return Array.isArray(value) ? value.length > 0 : (typeof value === 'string' ? value.trim().length > 0 : typeof value === 'boolean'
                            ? value === true
                            : value >= 0);
                    })
                    .map((key) => {
                        const value = filterdata[key];
                        return `${key}=${encodeURIComponent(
                            Array.isArray(value) ? value.join(',') : value
                        )}`;
                    })
                    .join('&');

                if (queryParams) {
                    url += `?${queryParams}`; // Append the filters to the URL
                }
                if (propertyType) {
                    await axios.get(url).then((response) => {
                        updateProperties(propertyType, response.data);
                    })
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };

        fetchProperties();
    }, [searchTrigger]);

    const handlecity = (e) => {
        const value = e.target.value;
        setfilterdata((prevState) => ({
            ...prevState,
            city: value, // Update filterdata.city on input change
        }));
    }
    const updateProperties = (key, data) => {
        setProperties((prev) => ({
            ...prev,
            rent: [],
            plot: [],
            pg: [],
            commercial: [],
            sell: [],
            [key]: data,
        }));
    };
    // const mchange = (e) => {
    //     const newValue = e.target.value * 10000000;
    //     setfilterdata((prevData) => ({
    //         ...prevData,
    //         budget: newValue, // Update the budget field
    //     }));
    // }
    const mchange = (e) => {
        const newMinBudget = e.minValue * 10000000;  // Convert slider value to rupees
        const newMaxBudget = e.maxValue * 10000000;

        if (newMinBudget !== filterdata.minbudget || newMaxBudget !== filterdata.maxbudget) {
            setfilterdata((prevData) => ({
                ...prevData,
                minbudget: newMinBudget,
                maxbudget: newMaxBudget,
            }));
        }
    }
    const rentchange = (e) => {
        const newMinRent = e.minValue * 100000;  // Convert slider value to rupees
        const newMaxRent = e.maxValue * 100000;

        if (newMinRent !== filterdata.minrent || newMaxRent !== filterdata.maxrent) {
            setfilterdata((prevData) => ({
                ...prevData,
                minrent: newMinRent,
                maxrent: newMaxRent,
            }));
        }
    }
    const formatBudget = (budget) => {
        if (budget >= 10000000) {
            return `${(budget / 10000000).toFixed(2)} Cr`; // Show in Crores
        } else {
            return `${(budget / 100000).toFixed(0)} Lacs`;  // Show in Lacs
        }
    };
    const formatrent = (budget) => {
        if (budget >= 100000) {
            return `${(budget / 100000).toFixed(2)} Lacs`;
        } else {
            return `${(budget / 1000).toFixed(0)} K`;
        }
    }
    const toggleVisibilitys = (section) => {
        setVisibility((prevVisibility) => ({
            ...prevVisibility,
            [section]: !prevVisibility[section], // Toggle the visibility of the clicked section
        }));
    };
    const handleClick = (proper) => {
        setfilterdata((prevState) => {
            const propertyType = [...prevState.propertyType];

            // If the amenity is not in the array, add it
            if (!propertyType.includes(proper)) {
                propertyType.push(proper);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = propertyType.indexOf(proper);
                propertyType.splice(index, 1);
            }

            return { ...prevState, propertyType };
        });
    }
    const bedClick = (bedid) => {
        setfilterdata((prevState) => {
            const bedrooms = [...prevState.bedrooms];

            // If the amenity is not in the array, add it
            if (!bedrooms.includes(bedid)) {
                bedrooms.push(bedid);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = bedrooms.indexOf(bedid);
                bedrooms.splice(index, 1);
            }

            return { ...prevState, bedrooms };
        });
    };
    const handleavailable = (avail) => {
        setfilterdata((prevState) => {
            const Availablefor = [...prevState.Availablefor];

            // If the amenity is not in the array, add it
            if (!Availablefor.includes(avail)) {
                Availablefor.push(avail);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = Availablefor.indexOf(avail);
                Availablefor.splice(index, 1);
            }

            return { ...prevState, Availablefor };
        });
    }
    const handleapprove = (approve) => {
        setfilterdata((prevState) => {
            const approvedby = [...prevState.approvedby];

            // If the amenity is not in the array, add it
            if (!approvedby.includes(approve)) {
                approvedby.push(approve);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = approvedby.indexOf(approve);
                approvedby.splice(index, 1);
            }

            return { ...prevState, approvedby };
        });
    }
    const achange = (e) => {
        if (e.minValue !== filterdata.minarea || e.maxValue !== filterdata.maxarea) {
            setfilterdata((prevData) => ({
                ...prevData,
                minarea: e.minValue,
                maxarea: e.maxValue,
            }));
        }
    }
    const handleroomtype = (room) => {
        setfilterdata((prevState) => {
            const roomtype = [...prevState.roomtype];

            // If the amenity is not in the array, add it
            if (!roomtype.includes(room)) {
                roomtype.push(room);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = roomtype.indexOf(room);
                roomtype.splice(index, 1);
            }

            return { ...prevState, roomtype };
        });
    }
    const handleowner = (owner) => {
        setfilterdata((prevState) => {
            const ownership = [...prevState.ownership];

            // If the amenity is not in the array, add it
            if (!ownership.includes(owner)) {
                ownership.push(owner);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = ownership.indexOf(owner);
                ownership.splice(index, 1);
            }

            return { ...prevState, ownership };
        });
    }
    const handlecommproperty = (propr) => {
        setfilterdata((prevState) => {
            const commproper = [...prevState.commproper];

            // If the amenity is not in the array, add it
            if (!commproper.includes(propr)) {
                commproper.push(propr);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = commproper.indexOf(propr);
                commproper.splice(index, 1);
            }

            return { ...prevState, commproper };
        });
    }
    const handleLocationChange = (e) => {
        const location = e.target.value;
        const isChecked = e.target.checked;

        setfilterdata((prevFilterData) => {
            let newLocalities;
            if (isChecked) {
                // If the checkbox is checked, add the location to the localities array
                newLocalities = [...prevFilterData.localities, location];
            } else {
                // If the checkbox is unchecked, remove the location from the localities array
                newLocalities = prevFilterData.localities.filter((loc) => loc !== location);
            }

            return {
                ...prevFilterData,
                localities: newLocalities, // Update the localities array
            };
        });
    };
    const handlerera = (rerastate) => {
        setfilterdata((prevState) => {
            const reraApproved = [...prevState.reraApproved];

            // If the amenity is not in the array, add it
            if (!reraApproved.includes(rerastate)) {
                reraApproved.push(rerastate);
            } else {
                // If it's already in the array, remove it (toggle effect)
                const index = reraApproved.indexOf(rerastate);
                reraApproved.splice(index, 1);
            }

            return { ...prevState, reraApproved };
        });
    };
    const handlecheckpv = (switchname) => {
        setfilterdata((prevData) => ({
            ...prevData,
            [switchname]: !prevData[switchname],
        }));
    }
    const handleViewNumber = async (property) => {
        if (coins < 2) {
            toast.info('Not enough coins to View Number! Atleast 2 coins required');
        } else {
            const userId = property.user;
            const base_url = import.meta.env.VITE_BASE_URL;
            const propinfo = {p_id:property._id,type:property.type};
            try {
                const response = await axios.get(`${base_url}/api/v3/user/${userId}`);
                setowner(response.data);  // Store the fetched user data in state (you need to define this state)
                // Show the modal after fetching the data
                const modal = new window.bootstrap.Modal(modalRef.current);
                modal.show();
                if (response.status === 200) {
                    await axios.put(`${base_url}/api/v1/update-coins`, { coinsChange: -2 }, { withCredentials: true }).then((response) => {
                        setcoins(response.data.coins);
                        dispatch(coinActions.setBalance(response.data.coins));
                    });
                    await axios.post(`${base_url}/api/v3/add-viewdata`,propinfo, { withCredentials: true }).then((response) => {
                        console.log(response.data.message);
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert('Failed to fetch user data');
            }
        }
    };
    const handleSms = async (property) => {
        if (coins < 2) {
            toast.info('Not enough coins to Contact! Atleast 2 coins required');
        } else {
            const base_url = import.meta.env.VITE_BASE_URL;
            const propinfo = {p_id:property._id,type:property.type};
            const data = {
                type: property.type,
                propertyId: property.propertyId,
                userId: property.user,
            }
            try {
                const response = await axios.post(`${base_url}/api/v3/sendsms`, data);
                if (response.status === 200) {
                    toast.success('Information is send to Owner, Please wait for reply !');
                    const res = await axios.put(`${base_url}/api/v1/update-coins`, { coinsChange: -2 }, { withCredentials: true });
                    setcoins(res.data.coins);
                    dispatch(coinActions.setBalance(res.data.coins));
                    await axios.post(`${base_url}/api/v3/add-viewdata`,propinfo, { withCredentials: true }).then((response) => {
                        console.log(response.data.message);
                    });
                }
                else {
                    toast.error(response.data.message);
                }
            } catch (error) {
                console.error('Error sending contact SMS:', error);
                alert('Failed to send SMS');
            }
        }
    };
    const handlevisit = async (propertyId, propertyType) => {
        try {
            const base_url = import.meta.env.VITE_BASE_URL;
            const response = await axios.put(`${base_url}/api/v4/increment-visit/${propertyType}/${propertyId}`, { withCredentials: true, });

            if (!response.data.success) {
                console.log('Property is not Refreshed');
            }
        } catch (error) {
            toast.error('Error refreshing property');
        }
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg border search-nav">
                <Helmet>
                    <title>Search Best property to Buy</title>
                    <meta name="description" content="Explore new construction homes and learn how to buy a house, whether it's a duplex, vacation home, or foreclosed property. Compare renting vs buying a house and buying vs building a house. Get insights into multiple listing services, how often contingent offers fall through, and how to get preapproved for a home loan." />
                    <meta name="keywords" content="New construction homes ,How to buy a house ,Buying a duplex ,Buying a vacation home ,Buy realestate ,Buy home,Multiple listing services,Renting vs buying a house
                Buying a foreclosed home,Buying vs building a house,How often do contingent offers fall through,How to get preapproved for a home loan" />
                </Helmet>
                <ToastContainer />
                <div className="container-fluid justify-content-lg-evenly search-cont">
                    <a role="button" className="navbar-brand text-white s-logo fs-3" href="#">ShelterBIG</a>
                    <div className="dropdown d-flex w-50 resp-drop">
                        <button className="btn btn-secondary dropdown-toggle bg-white text-dark search-drop" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            {Filter.tab}
                        </button>
                        <ul className="dropdown-menu" style={{ cursor: "pointer" }}>
                            <li><a role="button" className="dropdown-item" onClick={() => setFilter({ ...Filter, tab: "Buy" })}>Buy</a></li>
                            <li><a role="button" className="dropdown-item" onClick={() => setFilter({ ...Filter, tab: "Rent" })} >Rent</a></li>
                            <li><a role="button" className="dropdown-item" onClick={() => setFilter({ ...Filter, tab: "PG" })} >PG</a></li>
                            <li><a role="button" className="dropdown-item" onClick={() => setFilter({ ...Filter, tab: "Plot/Land" })} >Plot/Land</a></li>
                            <li><a role="button" className="dropdown-item" onClick={() => setFilter({ ...Filter, tab: "Commercial" })} >Commercial</a></li>
                        </ul>
                        <input type="text" className="form-control search-input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" placeholder='Enter City'
                            value={filterdata.city}
                            onChange={handlecity} />
                        <button className='btn s-nav-btn bg-white ms-2'
                            onClick={() => setSearchTrigger((prev) => !prev)}>Search</button>
                        <div className='d-flex align-items-center ms-1 ms-sm-4'>
                            <img src={coin} alt="coin" className='search-coin' />
                            <div className='ms-1'>{coins || '0'}</div>
                        </div>
                    </div>
                </div>
            </nav>
            <div className='apply-divbtn mt-2 ms-4 d-lg-none'>
                <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <FcFilledFilter className='fs-4 mb-1 applyf-icon' />Apply Filters
                </button>
                <div className="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasExampleLabel"></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <div className='filters bg-white p-3'>
                            <h3 className='filter-h3'>Apply Filters</h3>
                            <div className='budg mt-3'>
                                <div className='bdg-box1 p-2 d-flex justify-content-between align-items-center'
                                    onClick={() => toggleVisibilitys("budget")}>
                                    <div className='fw-bold'>Budget</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.budget && (
                                    <div className="bdg-box2 mt-3">
                                        {Filter.tab === "Buy" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial" ? (
                                            //Buy Budget Slider
                                            <MultiRangeSlider
                                                min={0}
                                                max={20}
                                                step={0.05}
                                                minValue={filterdata.minbudget / 10000000}
                                                maxValue={filterdata.maxbudget / 10000000}
                                                onInput={(e) => {
                                                    mchange(e);
                                                }}
                                                minCaption={formatBudget(filterdata.minbudget)}  // Proper formatting
                                                maxCaption={formatBudget(filterdata.maxbudget)}  // Proper formatting
                                            />
                                        ) : Filter.tab === "Rent" || Filter.tab === "PG" ? (
                                            // Rent Budget Slider
                                            <div>
                                                <div className="range d-flex justify-content-between">
                                                    <div className="minrange">0</div>
                                                    <div className="maxrange">{filterdata.rentBudget / 1000}&nbsp;K</div>
                                                </div>
                                                <input
                                                    type="range" className="form-range" min="0" max="100000" step="1000" id="rentBudgetRange"
                                                    value={filterdata.rentBudget} // Default value if not set
                                                    onChange={(e) => setfilterdata({ ...filterdata, rentBudget: e.target.value })}
                                                />
                                            </div>
                                        ) : null}
                                    </div>

                                )}
                            </div>
                            <div className='type'>
                                <div className='type-box pt-4 p-2 d-flex justify-content-between align-items-center'
                                    onClick={() => toggleVisibilitys("type")}>
                                    <div className='fw-bold'>{Filter.tab === "Plot/Land" ? 'Ownership' : 'Type of Property'}</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.type && (
                                    <div className={`container type-box1 pb-2 ${Filter.tab === "Commercial" ? 'ps-0' : ''}`}>
                                        {Filter.tab === "Buy" || Filter.tab === "Rent" || Filter.tab === "PG" ? (
                                            <>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("1 RK/Studio Apartment")}
                                                    style={filterdata.propertyType.includes('1 RK/Studio Apartment') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 RK/Studio Apartment</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Residental Apartment")}
                                                    style={filterdata.propertyType.includes('Residental Apartment') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Residental Apartment</button>
                                                <button className='btn btn-light type-btn ms-1 mt-2 me-1' onClick={() => handleClick("House Villa")}
                                                    style={filterdata.propertyType.includes('House Villa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ House Villa</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Flat")}
                                                    style={filterdata.propertyType.includes('Flat') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Flat</button>
                                            </>
                                        ) : Filter.tab === "Plot/Land" ? (
                                            <div className='ms-1'>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Freehold')}
                                                    style={filterdata.ownership.includes('Freehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Freehold</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Leasehold')}
                                                    style={filterdata.ownership.includes('Leasehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Leasehold</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Co-operative Society')}
                                                    style={filterdata.ownership.includes('Co-operative Society') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Co-operative Society</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Power of Attorney')}
                                                    style={filterdata.ownership.includes('Power of Attorney') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Power of Attorney</button>
                                            </div>
                                        ) : Filter.tab === "Commercial" ? (
                                            <div className=''>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Office')}
                                                    style={filterdata.commproper.includes('Office') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Office</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Retail')}
                                                    style={filterdata.commproper.includes('Retail') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Retail</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => handlecommproperty('Shop')}
                                                    style={filterdata.commproper.includes('Shop') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Shop</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Godam')}
                                                    style={filterdata.commproper.includes('Godam') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Godam</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Industry')}
                                                    style={filterdata.commproper.includes('Industry') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Industry</button>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            <div className='Nbed'>
                                <div className='type-box pt-4 p-2 d-flex justify-content-between align-items-center'
                                    onClick={() => toggleVisibilitys("Nbed")}>
                                    <div className='fw-bold'>{Filter.tab === "PG" ? 'Available For' : Filter.tab === "Plot/Land" ? "Approved By" : Filter.tab === "Commercial" ? "Ownership" : 'No. of Bedrooms'}</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.Nbed && (
                                    <div className='container type-box1 pb-2'>
                                        {Filter.tab === "Buy" || Filter.tab === "Rent" ? (
                                            <>
                                                <button className='btn btn-light type-btn mt-2 me-1' onClick={() => bedClick("1RK")}
                                                    style={filterdata.bedrooms.includes('1RK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 RK</button>
                                                <button className='btn btn-light type-btn mt-2 me-1' onClick={() => bedClick("1BHK")}
                                                    style={filterdata.bedrooms.includes('1BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 BHK</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => bedClick("2BHK")}
                                                    style={filterdata.bedrooms.includes('2BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 2BHK</button>
                                                <button className='btn btn-light type-btn ms-1 mt-2 me-1' onClick={() => bedClick("3BHK")}
                                                    style={filterdata.bedrooms.includes('3BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 3BHK</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => bedClick("4BHK")}
                                                    style={filterdata.bedrooms.includes('4BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 4BHK</button>
                                            </>
                                        ) : Filter.tab === "PG" ? (
                                            <div>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Girls')}
                                                    style={filterdata.Availablefor.includes('Girls') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Girls</button>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Boys')}
                                                    style={filterdata.Availablefor.includes('Boys') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Boys</button>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Any')}
                                                    style={filterdata.Availablefor.includes('Any') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Any</button>
                                            </div>
                                        ) : Filter.tab === "Plot/Land" ? (
                                            <div>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('N.A(Non-Agricultural)')}
                                                    style={filterdata.approvedby.includes('N.A(Non-Agricultural)') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ N.A(Non-Agricultural)</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('N.A(in-process)')}
                                                    style={filterdata.approvedby.includes('N.A(in-process)') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ N.A(in-process)</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('Collector Approved')}
                                                    style={filterdata.approvedby.includes('Collector Approved') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Collector Approved</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('Corporation Approved')}
                                                    style={filterdata.approvedby.includes('Corporation Approved') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Corporation Approved</button>
                                            </div>
                                        ) : Filter.tab === "Commercial" ? (
                                            <div className='ms-1'>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Freehold')}
                                                    style={filterdata.ownership.includes('Freehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Freehold</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Leasehold')}
                                                    style={filterdata.ownership.includes('Leasehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Leasehold</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Co-operative Society')}
                                                    style={filterdata.ownership.includes('Co-operative Society') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Co-operative Society</button>
                                                <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Power of Attorney')}
                                                    style={filterdata.ownership.includes('Power of Attorney') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Power of Attorney</button>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            <div className='area'>
                                <div className='bdg-box1 pt-4 type-box p-2 d-flex justify-content-between align-items-center'
                                    onClick={() => toggleVisibilitys("area")}>
                                    <div className='fw-bold'>{Filter.tab === 'PG' ? 'Room Type' : 'Area'}</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.area && (
                                    <div className='bdg-box2 mt-2 pb-2'>
                                        {Filter.tab === "Buy" || Filter.tab === "Rent" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial" ? (
                                            <>
                                                <MultiRangeSlider
                                                    min={0}
                                                    max={4000}
                                                    step={100}
                                                    minValue={filterdata.minarea}
                                                    maxValue={filterdata.maxarea}
                                                    onInput={(e) => {
                                                        achange(e);
                                                    }}
                                                    className='area-slider'
                                                    minCaption={`${filterdata.minarea} Sq-ft`}  // Proper formatting
                                                    maxCaption={`${filterdata.maxarea} Sq-ft`}  // Proper formatting
                                                />
                                            </>
                                        ) : Filter.tab === "PG" ? (
                                            <div className='ms-1'>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handleroomtype('Shared')}
                                                    style={filterdata.roomtype.includes('Shared') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Shared</button>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handleroomtype('Private')}
                                                    style={filterdata.roomtype.includes('Private') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Private</button>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                            <div className='locate'>
                                <div className='type-box pt-4 p-2 d-flex justify-content-between align-items-center'
                                    onClick={() => toggleVisibilitys("locate")}>
                                    <div className='fw-bold'>Localities</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.locate && (<div className='container d-flex flex-column mt-2 mb-2'>
                                    <div>
                                        <input className="form-check-input me-2" type="checkbox" value="Nerul" id="Check1" onChange={handleLocationChange} />
                                        <label className="form-check-label" for="Check1">
                                            Nerul
                                        </label>
                                    </div>
                                    <div>
                                        <input className="form-check-input me-2" type="checkbox" value="Sion" id="Check2" onChange={handleLocationChange} />
                                        <label className="form-check-label" for="Check2">
                                            Sion
                                        </label>
                                    </div>
                                    <div>
                                        <input className="form-check-input me-2" type="checkbox" value="Thane" id="Check3" onChange={handleLocationChange} />
                                        <label className="form-check-label" for="Check3">
                                            Thane
                                        </label>
                                    </div>
                                    <div>
                                        <input className="form-check-input me-2" type="checkbox" value="Bandra" id="Check4" onChange={handleLocationChange} />
                                        <label className="form-check-label" for="Check4">
                                            Bandra
                                        </label>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div className='rera'>
                                {(Filter.tab === "Buy" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial") && (
                                    <>
                                        <div className='type-box p-2 pb-3 pt-4 d-flex justify-content-between align-items-center' onClick={() => toggleVisibilitys("rera")}>
                                            <div className='fw-bold'>RERA Approved</div>
                                            <IoIosArrowDown />
                                        </div>
                                        {visibility.rera && (
                                            <div className='container d-flex flex-wrap mb-2'>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handlerera("I have Applied")}
                                                    style={filterdata.reraApproved.includes('I have Applied') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>I have Applied</button>
                                                <button className='btn btn-light type-btn me-1' onClick={() => handlerera("Not Applicable")}
                                                    style={filterdata.reraApproved.includes('Not Applicable') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Not Applicable</button>
                                                <button className='btn btn-light type-btn' onClick={() => handlerera("Yes")}
                                                    style={filterdata.reraApproved.includes('Yes') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Yes</button>
                                                <button className='btn btn-light type-btn mt-2' onClick={() => handlerera("No")}
                                                    style={filterdata.reraApproved.includes('No') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >No</button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className='photos type-box p-2 pt-3 d-flex justify-content-between'>
                                <div className='fw-bold text-nowrap'>Properties with Photos</div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="photos" checked={filterdata.photos} onChange={() => handlecheckpv('photos')} />
                                </div>
                            </div>
                            <div className='photos type-box p-2 pt-3 d-flex justify-content-between mb-1'>
                                <div className='fw-bold text-nowrap'>Properties with Videos</div>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" role="switch" id="videos" checked={filterdata.videos} onChange={() => handlecheckpv('videos')} />
                                </div>
                            </div>
                            <div className='mt-2'>
                                <button className='btn apply-btn' onClick={() => setSearchTrigger((prev) => !prev)}>Apply Filter</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='item-cont pt-1 pb-4 px-2 px-lg-4'>
                {/* large screen */}
                <div className='filter bg-white p-3'>
                    <h3 className='filter-h3'>Apply Filters</h3>
                    <div className='budg'>
                        <div className='bdg-box1 p-2 d-flex justify-content-between align-items-center'
                            onClick={() => toggleVisibilitys("budget")}>
                            <div className='fw-bold'>Budget</div>
                            <IoIosArrowDown />
                        </div>
                        {visibility.budget && (
                            <div className="bdg-box2 mt-3">
                                {Filter.tab === "Buy" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial" ? (
                                    //Buy Budget Slider
                                    // <div>
                                    //     <div className="range d-flex justify-content-between">
                                    //         <div className="minrange">0</div>
                                    //         <div className="maxrange">{formatBudget(filterdata.budget)}</div>
                                    //     </div>
                                    //     <input
                                    //         type="range" className="form-range" min="0" max="5" step="0.05" id="buyBudgetRange"
                                    //         value={filterdata.budget / 10000000}
                                    //         onChange={mchange}
                                    //     />
                                    // // </div>
                                    <MultiRangeSlider
                                        min={0}
                                        max={20}
                                        step={0.05}
                                        minValue={filterdata.minbudget / 10000000}
                                        maxValue={filterdata.maxbudget / 10000000}
                                        onInput={(e) => {
                                            mchange(e);
                                        }}
                                        minCaption={formatBudget(filterdata.minbudget)}  // Proper formatting
                                        maxCaption={formatBudget(filterdata.maxbudget)}  // Proper formatting
                                    />
                                ) : Filter.tab === "Rent" || Filter.tab === "PG" ? (
                                    // Rent Budget Slider
                                    <MultiRangeSlider
                                        min={0}
                                        max={10}
                                        step={0.05}
                                        minValue={filterdata.minrent / 100000}
                                        maxValue={filterdata.maxrent / 100000}
                                        onInput={(e) => {
                                            rentchange(e);
                                        }}
                                        minCaption={formatrent(filterdata.minrent)}  // Proper formatting
                                        maxCaption={formatrent(filterdata.maxrent)}  // Proper formatting
                                    />
                                ) : null}
                            </div>

                        )}
                    </div>
                    <div className='type'>
                        <div className='type-box p-2 d-flex justify-content-between align-items-center'
                            onClick={() => toggleVisibilitys("type")}>
                            <div className='fw-bold'>{Filter.tab === "Plot/Land" ? 'Ownership' : 'Type of Property'}</div>
                            <IoIosArrowDown />
                        </div>
                        {visibility.type && (
                            <div className={`container type-box1 pb-2 ${Filter.tab === "Commercial" ? 'ps-0' : ''}`}>
                                {Filter.tab === "Buy" || Filter.tab === "Rent" || Filter.tab === "PG" ? (
                                    <>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("1 RK/Studio Apartment")}
                                            style={filterdata.propertyType.includes('1 RK/Studio Apartment') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 RK/Studio Apartment</button>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Residental Apartment")}
                                            style={filterdata.propertyType.includes('Residental Apartment') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Residental Apartment</button>
                                        <button className='btn btn-light type-btn mt-2 me-1' onClick={() => handleClick("House Villa")}
                                            style={filterdata.propertyType.includes('House Villa') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ House Villa</button>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => handleClick("Flat")}
                                            style={filterdata.propertyType.includes('Flat') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ Flat</button>
                                    </>
                                ) : Filter.tab === "Plot/Land" ? (
                                    <div className='ms-1'>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Freehold')}
                                            style={filterdata.ownership.includes('Freehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Freehold</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Leasehold')}
                                            style={filterdata.ownership.includes('Leasehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Leasehold</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Co-operative Society')}
                                            style={filterdata.ownership.includes('Co-operative Society') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Co-operative Society</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Power of Attorney')}
                                            style={filterdata.ownership.includes('Power of Attorney') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Power of Attorney</button>
                                    </div>
                                ) : Filter.tab === "Commercial" ? (
                                    <div className=''>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Office')}
                                            style={filterdata.commproper.includes('Office') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Office</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Retail')}
                                            style={filterdata.commproper.includes('Retail') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Retail</button>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => handlecommproperty('Shop')}
                                            style={filterdata.commproper.includes('Shop') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Shop</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Godam')}
                                            style={filterdata.commproper.includes('Godam') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Godam</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handlecommproperty('Industry')}
                                            style={filterdata.commproper.includes('Industry') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Industry</button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                    <div className='Nbed'>
                        <div className='type-box p-2 d-flex justify-content-between align-items-center'
                            onClick={() => toggleVisibilitys("Nbed")}>
                            <div className='fw-bold'>{Filter.tab === "PG" ? 'Available For' : Filter.tab === "Plot/Land" ? "Approved By" : Filter.tab === "Commercial" ? "Ownership" : 'No. of Bedrooms'}</div>
                            <IoIosArrowDown />
                        </div>
                        {visibility.Nbed && (
                            <div className='container type-box1 pb-2'>
                                {Filter.tab === "Buy" || Filter.tab === "Rent" ? (
                                    <>
                                        <button className='btn btn-light type-btn mt-2 me-1' onClick={() => bedClick("1RK")}
                                            style={filterdata.bedrooms.includes('1RK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 RK</button>
                                        <button className='btn btn-light type-btn mt-2 me-1' onClick={() => bedClick("1BHK")}
                                            style={filterdata.bedrooms.includes('1BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+1 BHK</button>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => bedClick("2BHK")}
                                            style={filterdata.bedrooms.includes('2BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 2BHK</button>
                                        <button className='btn btn-light type-btn mt-2 me-1' onClick={() => bedClick("3BHK")}
                                            style={filterdata.bedrooms.includes('3BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 3BHK</button>
                                        <button className='btn btn-light type-btn mt-2' onClick={() => bedClick("4BHK")}
                                            style={filterdata.bedrooms.includes('4BHK') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>+ 4BHK</button>
                                    </>
                                ) : Filter.tab === "PG" ? (
                                    <div>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Girls')}
                                            style={filterdata.Availablefor.includes('Girls') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Girls</button>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Boys')}
                                            style={filterdata.Availablefor.includes('Boys') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Boys</button>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handleavailable('Any')}
                                            style={filterdata.Availablefor.includes('Any') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Any</button>
                                    </div>
                                ) : Filter.tab === "Plot/Land" ? (
                                    <div>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('N.A(Non-Agricultural)')}
                                            style={filterdata.approvedby.includes('N.A(Non-Agricultural)') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ N.A(Non-Agricultural)</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('N.A(in-process)')}
                                            style={filterdata.approvedby.includes('N.A(in-process)') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ N.A(in-process)</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('Collector Approved')}
                                            style={filterdata.approvedby.includes('Collector Approved') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Collector Approved</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleapprove('Corporation Approved')}
                                            style={filterdata.approvedby.includes('Corporation Approved') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Corporation Approved</button>
                                    </div>
                                ) : Filter.tab === "Commercial" ? (
                                    <div className='ms-1'>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Freehold')}
                                            style={filterdata.ownership.includes('Freehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Freehold</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Leasehold')}
                                            style={filterdata.ownership.includes('Leasehold') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Leasehold</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Co-operative Society')}
                                            style={filterdata.ownership.includes('Co-operative Society') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Co-operative Society</button>
                                        <button className='btn btn-light type-btn me-1 mt-2' onClick={() => handleowner('Power of Attorney')}
                                            style={filterdata.ownership.includes('Power of Attorney') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Power of Attorney</button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                    <div className='area'>
                        <div className='bdg-box1 type-box p-2 d-flex justify-content-between align-items-center'
                            onClick={() => toggleVisibilitys("area")}>
                            <div className='fw-bold'>{Filter.tab === 'PG' ? 'Room Type' : 'Area'}</div>
                            <IoIosArrowDown />
                        </div>
                        {visibility.area && (
                            <div className='bdg-box2 mt-2 pb-2'>
                                {Filter.tab === "Buy" || Filter.tab === "Rent" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial" ? (
                                    <>
                                        <MultiRangeSlider
                                            min={0}
                                            max={4000}
                                            step={100}
                                            minValue={filterdata.minarea}
                                            maxValue={filterdata.maxarea}
                                            onInput={(e) => {
                                                achange(e);
                                            }}
                                            className='area-slider'
                                            minCaption={`${filterdata.minarea} Sq-ft`}  // Proper formatting
                                            maxCaption={`${filterdata.maxarea} Sq-ft`}  // Proper formatting
                                        />
                                    </>
                                ) : Filter.tab === "PG" ? (
                                    <div className='ms-1'>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handleroomtype('Shared')}
                                            style={filterdata.roomtype.includes('Shared') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Shared</button>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handleroomtype('Private')}
                                            style={filterdata.roomtype.includes('Private') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >+ Private</button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                    <div className='locate'>
                        <div className='type-box p-2 d-flex justify-content-between align-items-center'
                            onClick={() => toggleVisibilitys("locate")}>
                            <div className='fw-bold'>Localities</div>
                            <IoIosArrowDown />
                        </div>
                        {visibility.locate && (<div className='container d-flex flex-column mt-2 mb-2'>
                            <div>
                                <input className="form-check-input me-2" type="checkbox" value="Nerul" id="Check1" onChange={handleLocationChange} />
                                <label className="form-check-label" for="Check1">
                                    Nerul
                                </label>
                            </div>
                            <div>
                                <input className="form-check-input me-2" type="checkbox" value="Sion" id="Check2" onChange={handleLocationChange} />
                                <label className="form-check-label" for="Check2">
                                    Sion
                                </label>
                            </div>
                            <div>
                                <input className="form-check-input me-2" type="checkbox" value="Thane" id="Check3" onChange={handleLocationChange} />
                                <label className="form-check-label" for="Check3">
                                    Thane
                                </label>
                            </div>
                            <div>
                                <input className="form-check-input me-2" type="checkbox" value="Bandra" id="Check4" onChange={handleLocationChange} />
                                <label className="form-check-label" for="Check4">
                                    Bandra
                                </label>
                            </div>
                        </div>
                        )}
                    </div>
                    <div className='rera'>
                        {(Filter.tab === "Buy" || Filter.tab === "Plot/Land" || Filter.tab === "Commercial") && (
                            <>
                                <div className='type-box p-2 d-flex justify-content-between align-items-center' onClick={() => toggleVisibilitys("rera")}>
                                    <div className='fw-bold'>RERA Approved</div>
                                    <IoIosArrowDown />
                                </div>
                                {visibility.rera && (
                                    <div className='container d-flex flex-wrap mb-2'>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handlerera("Yes")}
                                            style={filterdata.reraApproved.includes('Yes') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >Yes</button>
                                        <button className='btn btn-light type-btn me-1' onClick={() => handlerera("No")}
                                            style={filterdata.reraApproved.includes('No') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}} >No</button>
                                        <button className='btn btn-light type-btn' onClick={() => handlerera("I have Applied")}
                                            style={filterdata.reraApproved.includes('I have Applied') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>I have Applied</button>
                                        <button className='btn btn-light type-btn mt-2 me-1' onClick={() => handlerera("Not Applicable")}
                                            style={filterdata.reraApproved.includes('Not Applicable') ? { border: "1px solid darkorange", backgroundColor: "#FFE5B4" } : {}}>Not Applicable</button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    <div className='photos type-box p-2 d-flex justify-content-between'>
                        <div className='fw-bold text-nowrap'>Properties with Photos</div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="photos" checked={filterdata.photos} onChange={() => handlecheckpv('photos')} />
                        </div>
                    </div>
                    <div className='photos type-box p-2 d-flex justify-content-between mb-2'>
                        <div className='fw-bold text-nowrap'>Properties with Videos</div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" role="switch" id="videos" checked={filterdata.videos} onChange={() => handlecheckpv('videos')} />
                        </div>
                    </div>
                    <div className='mt-auto'>
                        <button className='btn apply-btn' onClick={() => setSearchTrigger((prev) => !prev)}>Apply Filter</button>
                    </div>
                </div>
                <div className='items-sec p-2'>
                    {Object.values(properties).some((arr) => arr.length > 0) ?
                        (
                            <>{properties.sell?.map((property) => (
                                <Propcard key={property._id} property={property} onViewNumber={handleViewNumber} handleSendsms={handleSms} handlevisits={handlevisit} />
                            ))}
                                {properties.rent?.map((property) => (
                                    <Rentcard key={property._id} property={property} onViewNumber={handleViewNumber} handleSendsms={handleSms} handlevisits={handlevisit} />
                                ))}
                                {properties.plot?.map((property) => (
                                    <Plotcard key={property._id} property={property} onViewNumber={handleViewNumber} handleSendsms={handleSms} handlevisits={handlevisit} />
                                ))}
                                {properties.pg?.map((property) => (
                                    <PGcard key={property._id} property={property} onViewNumber={handleViewNumber} handleSendsms={handleSms} handlevisits={handlevisit} />
                                ))}
                                {properties.commercial?.map((property) => (
                                    <Commcard key={property._id} property={property} onViewNumber={handleViewNumber} handleSendsms={handleSms} handlevisits={handlevisit} />
                                ))}
                            </>
                        ) : (
                            <div>No results found ...</div>
                        )}
                </div>
                <div className="modal owner-info" ref={modalRef} tabindex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Owner Information</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p className='mb-0'><strong>Name:</strong> {owner.name}</p>
                                <p className='mb-0'><strong>Phone:</strong> +91 {owner.phone}</p>
                                <p className='mb-0'><strong>Email:</strong> {owner.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search