const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Rent, PG, etc.
    propertyType: { type: String, required: true }, // Flat, Villa, PG
    city: { type: String, required: true },
    locality: { type: String, required: true },
    societyName: { type: String, required: true },
    roomType: { type: String, required: true }, // e.g., Shared, Private
    capacity: { type: Number, required: true },
    furnishedType: { type: String, required: true }, // Fully Furnished, Semi Furnished
    carpetArea: { type: Number },
    areaUnit: { type: String }, // Sq-ft, Sq-yrd
    availableFor: { type: String, required: true }, // e.g., Girls, Boys, Any
    monthlyRent: { type: Number, required: true },
    securityDeposit: { type: Number, required: true },
    availableFrom: { type: Date, required: true },
    durationOfAgreement: { type: String },
    features: {
        bedrooms: { type: Number },
        balconies: { type: Number },
        bathrooms: { type: Number },
        ageOfProperty: { type: String },
        totalFloors: { type: Number },
        floorNumber: { type: Number }
    },
    amenities: { type: [String] }, // Washing Machine, Sofa, etc.
    images: { type: [String] },
    video:{type: String},
    propertyId: { type: String ,required:true},
    visits: { type: Number, default: 0 },
    lastVisitTime: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Inactive'],default: 'Active'},
    StatusUpdatedAt: { type: Date, default: Date.now },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PG', pgSchema);
