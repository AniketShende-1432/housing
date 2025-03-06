const mongoose = require('mongoose');

const SellpropertySchema = new mongoose.Schema({
    type: { type: String, required: true },
    //Location
    propertyType: { type: String, required: true }, // e.g., Flat, Villa, etc.
    city: { type: String, required: true }, // City where the property is located
    locality: { type: String, required: true }, // Locality of the property
    society: { type: String ,required:true}, // Name of the society/project
    // Property Details
    bhk: { type: String, required: true }, // e.g., 1BHK, 2BHK
    furnishedType: { type: String, required: true }, // Fully Furnished, Semi Furnished, Unfurnished
    possessionStatus: { type: String, required: true }, // e.g., Under Construction, Ready to Move
    price: { type: Number, required: true }, // Price of the property
    // Area Details
    carpetArea: { type: Number, required: true }, // Carpet area
    carpetAreaUnit: { type: String, required: true }, // Unit for carpet area, e.g., Sq-ft, Sq-yrd
    superArea: { type: Number }, // Super area
    superAreaUnit: { type: String }, // Unit for super area, e.g., Sq-ft, Sq-yrd
    features: {
        bedrooms: { type: Number }, // Number of bedrooms
        bathrooms: { type: Number }, // Number of bathrooms
        balconies: { type: Number }, // Number of balconies
        floorNumber: { type: Number }, // Floor where the property is located
        totalFloors: { type: Number }, // Total number of floors
        ageOfProperty: { type: Number }, // Age of the property, e.g., "5 years"
    },
    developer:{type:String},
    societyArea:{type:Number},
    societyAreaUnit: { type: String },
    amenities: { type: [String] }, // Array of selected amenities (e.g., ['Parking', 'Gym', 'Wi-Fi'])
    images: { type: [String] },
    propertyId: { type: String },
    visits: { type: Number, default: 0 },
    lastVisitTime: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Inactive'],default: 'Active'},
    StatusUpdatedAt: { type: Date, default: Date.now },
    user: { 
        type: mongoose.Types.ObjectId, ref: 'User', 
    }, 

}, { timestamps: true });

module.exports = mongoose.model('Sell', SellpropertySchema);