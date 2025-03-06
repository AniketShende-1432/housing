const mongoose = require('mongoose');

const rentSchema = new mongoose.Schema({
    type: { type: String, required: true }, // e.g., Rent
    propertyType: { type: String, required: true }, // e.g., Flat, Villa
    city: { type: String, required: true },
    locality: { type: String, required: true },
    societyName: { type: String, required:true},
    bhk: { type: String, required: true }, // e.g., 1BHK, 2BHK
    furnishedType: { type: String, required: true }, // e.g., Fully Furnished, Semi Furnished
    carpetArea: { type: Number, required: true },
    areaUnit: { type: String, required: true }, // e.g., Sq-ft, Sq-yrd
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    availableFrom: { type: Date, required: true },
    willingToRent: { type: [String] }, // e.g., Family, Single Men, Single Women
    durationOfAgreement: { type: String, required: true },

    features: { 
        bedrooms: { type: Number },
        balconies: { type: Number },
        bathrooms: { type: Number },
        ageOfProperty: { type: String },
        totalFloors: { type: Number },
        floorNumber: { type: Number }
    }, // Nested object for property features
    amenities: { type: [String]}, // Combined amenities
    images: { type: [String] }, // Array of image URLs
    propertyId: { type: String },
    visits: { type: Number, default: 0 },
    lastVisitTime: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Inactive'],default: 'Active'},
    StatusUpdatedAt: { type: Date, default: Date.now },
    user: { 
        type: mongoose.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to User model
}, { timestamps: true });

module.exports = mongoose.model('Rent', rentSchema);
