import React from 'react'
import './About.css';

const FAQs = () => {
    const faqs = [
        {
            id: "collapseOne",
            question: "How to Register ?",
            answer:
                'To register on ShelterBig, click the "Sign Up" button, enter your email, phone number, and password, and verify your phone number via OTP. Once registered, you can log in, post properties, and explore listings.',
        },
        {
            id: "collapseTwo",
            question: "How to change my account password ?",
            answer:
                "To change your password on ShelterBig, go to your Profile Page, navigate to the Change Password section, enter your current password, then your new password, and confirm it. Click Save to update your password.",
        },
        {
            id: "collapseThree",
            question: "How to modify my profile ?",
            answer:
                "To modify your profile on ShelterBig, go to your Profile Page, update the pre-filled details (such as name, phone number, or profile picture), and click Save to apply the changes.",
        },
    ];
    const search = [
        {
            id: "collapseFour",
            question: "How to use different search options ?",
            answer:
                'ShelterBig offers multiple search options to help users find properties easily. You can search by location (city, locality), property type - rent, buy, PG, commercial ,Plot .ShelterBigs Advanced Search allows users to refine property searches using multiple filters. Users can search by price range, BHK type (1BHK, 2BHK, etc.), carpet area, location.',
        },
        {
            id: "collapseFive",
            question: " Why 'No records' found displayed on search result page ?",
            answer:
                "'No records found' appears when no properties match your search criteria. Try adjusting filters like price range, BHK type, location, or amenities to get more results.",
        },
    ];
    const post = [
        {
            id: "collapseSix",
            question: "How to add my property for sale or rent on ShelterBIG.com ?",
            answer:
                'To add your property on ShelterBig, In the Profile Page, the navbar provides options for posting properties like Sell, Rent, PG, Commercial, Plot, etc. Users can select the desired category, fill out the form, and submit their property listing.',
        },
        {
            id: "collapseSeven",
            question: "How to edit / add info / modify / remove property listing ?",
            answer:
                "In the Manage Properties section, you can edit, update, or delete your property listing. Simply select the property, make the necessary changes, and save the updates.",
        },
    ];
    return (
        <div className='container'>
            <div className='fw-bold fs-5 text-decoration-underline text-center f-head mt-2'>FAQ's</div>
            <div>
                <div className='fw-bold mb-2'>Registration</div>
                <div className="accordion border-bottom border-secondary" id="accordionExample">
                    {faqs.map((faq) => (
                        <div className="accordion-item" key={faq.id}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed border-top border-secondary" // Ensure all buttons start collapsed
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${faq.id}`}
                                    aria-expanded="false" // Ensure all are initially collapsed
                                    aria-controls={faq.id}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div
                                id={faq.id}
                                className="accordion-collapse collapse" // No "show" class initially
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">{faq.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='fw-bold mb-2 mt-2'>Search</div>
                <div className="accordion border-bottom border-secondary" id="accordionExample">
                    {search.map((faq) => (
                        <div className="accordion-item" key={faq.id}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed border-top border-secondary" // Ensure all buttons start collapsed
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${faq.id}`}
                                    aria-expanded="false" // Ensure all are initially collapsed
                                    aria-controls={faq.id}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div
                                id={faq.id}
                                className="accordion-collapse collapse" // No "show" class initially
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">{faq.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='fw-bold mb-2 mt-2'>Add Your Property</div>
                <div className="accordion border-bottom border-secondary" id="accordionExample">
                    {post.map((faq) => (
                        <div className="accordion-item" key={faq.id}>
                            <h2 className="accordion-header">
                                <button
                                    className="accordion-button collapsed border-top border-secondary" // Ensure all buttons start collapsed
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${faq.id}`}
                                    aria-expanded="false" // Ensure all are initially collapsed
                                    aria-controls={faq.id}
                                >
                                    {faq.question}
                                </button>
                            </h2>
                            <div
                                id={faq.id}
                                className="accordion-collapse collapse" // No "show" class initially
                                data-bs-parent="#accordionExample"
                            >
                                <div className="accordion-body">{faq.answer}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FAQs