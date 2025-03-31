import React from 'react'
import { FcLock } from "react-icons/fc";
import './About.css';

const Privacy = () => {
    return (
        <>
            <div className='container d-flex flex-column align-items-center'>
                <div className='prv-div d-flex flex-column align-items-center justify-content-center p-2 w-50 mt-4'>
                    <FcLock className='fs-1' />
                    <div className='fw-bold fs-4'>ShelterBIG Policy</div>
                </div>
                <div className='text-start w-100 mt-4'>
                    <div className='fw-bold fs-5'>Privacy Policy</div>
                    <p className='prv-parag'>We, at Info Edge India Limited and our affiliated companies worldwide, are committed to respecting your online privacy and recognize your need for appropriate protection and management of any personally identifiable information you share with us.</p>
                    <p className='prv-parag'>This Privacy Policy (“Policy”) governs our website available at ShelteBIG.com and our mobile application (collectively, the “Platform”). The Policy describes how Info Edge India Limited (hereinafter referred to as the “Company”) collects, uses, discloses and transfers personal data of users while browsing the Platform or availing specific services therein (the “Services”).</p>
                    <p className='prv-parag'>This Policy describes how we process personal data of all users of our Platform or Services, including buyers, renters, owners, dealers, brokers, and website visitors.</p>
                    <p className='prv-parag'>“Personal Data” means any data about an individual who is identifiable by or in relation to such data.By providing your consent to this Policy, either on the Platform or through other means, or accessing the Platform and Services, you consent to the Company’s processing of your Personal Data in accordance with this Policy. Where required, for processing your Personal Data for distinct purposes, we seek your consent separately on the Platform or through other means.</p>
                    <p className='preserve'>
                    {`This Privacy Policy is divided into the following sections:
  
        1. Personal Data we collect
        2. How we use your Personal Data
        3. Who we share your Personal Data with
        4. Data storage and retention
        5. Your rights
        6. Data protection practices
        7. Third party websites, apps and services
        8. Children
        9. Changes to the privacy policy
        10. How to contact us – Grievance office`}
                    </p>
                </div>
            </div>
        </>
    )
}

export default Privacy