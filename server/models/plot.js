const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
    type: { type: String, required: true,}, // e.g., Sell
    city: { type: String, required: true },
    locality: { type: String, required: true },
    societyName: { type: String, required: true },
    plotArea: { type: Number, required: true }, // e.g., 1200
    areaUnit: { type: String, required: true }, // e.g., Sq-ft, Sq-yrd
    price: { type: Number, required: true }, // Selling price
    possessionBy: { type: String, required: true }, // e.g., Immediate, Within 6 Months
    ownershipType: { type: String, required: true }, // e.g., Freehold, Leasehold
    approvedBy: { type: String }, // e.g., N.A(Non-Agricultural), Corporation Approved
    dimensions: {
        length: { type: String, required: true },
        breadth: { type: String, required: true },
    },
    features: {
        floorAllowed: { type: Number }, // Number of floors allowed
        boundaryWall: { type: Boolean }, // e.g., true for Yes
        openSides: { type: String }, // e.g., 1, 2, 3, or more
    }, // Nested object for plot features
    amenities: { type: [String] }, // Array of amenities (e.g., Water Storage, Rain Water Harvesting)
    overlooking: { type: [String] }, // Array of views (e.g., Pool, Park, Main Road)
    images: { type: [String] }, // Array of image URLs
    propertyId: { type: String },
    user: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to User model
}, { timestamps: true });

module.exports = mongoose.model('Plot', plotSchema);
