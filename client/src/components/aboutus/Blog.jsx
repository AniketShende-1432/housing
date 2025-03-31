import React from 'react'
import blog1 from '../../assets/blog1.webp';
import blog2 from '../../assets/blog2.jpg';
import blog3 from '../../assets/blog3.jpg';

const Blog = () => {
    return (
        <div>
            <div>
                <div className='h-blog fw-bold fs-4 text-center text-decoration-underline'>Blogs</div>
                <div className='container-fluid container-lg'>
                    <div className='fw-bold fs-5 text-decoration-underline'>Real Estate Tips From Expert</div>
                    <div className='d-flex flex-sm-row flex-column justify-content-between mt-2 blog-div'>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog1} className="card-img-top img-fluid" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody rounded fw-bold p-1 py-0 w-25 text-center'>RERA</div>
                                <p className="card-text fw-bold mb-2 mt-2">RERA Haryana 2025 : Projects Search, Registration & Complaints</p>
                                <div className='fw-light fst-italic'>March 25,2025 <span className='text-danger'>by Jasmine Khurana</span></div>
                            </div>
                        </div>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog2} className="card-img-top" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody rounded fw-bold p-1 py-0 w-25 text-center'>RERA</div>
                                <p className="card-text fw-bold mb-2 mt-2">MahaRERA 2025 : Maharashtra Registration, Projects & Complaints</p>
                                <div className='fw-light fst-italic'>March 24,2025 <span className='text-danger'>by Jasmine Khurana</span></div>
                            </div>
                        </div>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog3} className="card-img-top" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody rounded fw-bold p-1 py-0 w-25 text-center'>RERA</div>
                                <p className="card-text fw-bold mb-2 mt-2">RERA Complaint Online Filling : Registration & Check RERA Complaints Status</p>
                                <div className='fw-light fst-italic'>March 28,2025 <span className='text-danger'>by Anirudh Singh</span></div>
                            </div>
                        </div>
                    </div>
                    <div className='fw-bold fs-5 mt-4 text-decoration-underline'>Home/House Tips From Expert</div>
                    <div className='d-flex flex-sm-row flex-column justify-content-between mt-3 blog-div'>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog2} className="card-img-top" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody rounded fw-bold p-1 py-0 w-25 text-center'>Vastu</div>
                                <p className="card-text fw-bold mb-2 mt-2">Vastu Tips for Home in 2025 - Basic Principles and Tips</p>
                                <div className='fw-light fst-italic'>March 24,2025 <span className='text-danger'>by Jasmine Khurana</span></div>
                            </div>
                        </div>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog3} className="card-img-top" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody1 rounded fw-bold p-1 py-0 w-50 text-center'>CELEB Homes</div>
                                <p className="card-text fw-bold mb-2 mt-2">Celebrity House Address,Value, Inside View and Photos</p>
                                <div className='fw-light fst-italic'>March 28,2025 <span className='text-danger'>by Anirudh Singh</span></div>
                            </div>
                        </div>
                        <div className="card blog-card" style={{ width: "18rem" }}>
                            <img src={blog1} className="card-img-top" alt="blog-img" />
                            <div className="card-body blog-card-body">
                                <div className='h-cbody1 rounded fw-bold p-1 py-0 w-50 text-center'>Feng Shui</div>
                                <p className="card-text fw-bold mb-2 mt-2">Top 20+ Feng Shui Paintings For Urban Homes</p>
                                <div className='fw-light fst-italic'>March 26,2025 <span className='text-danger'>by Ruchi Gohri</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Blog