const mongoose = require('mongoose');

const commercialSchema = new mongoose.Schema({
    type: { type: String, required: true }, // Rent, Sell, etc.
    propertyType: { type: String, required: true }, // Office, Shop, Retail, etc.
    city: { type: String, required: true },
    locality: { type: String, required: true },
    projectName: { type: String, required: true}, // Name of Building/Project
    possessionStatus: { type: String, required: true }, // Under Construction, Ready to Move, Resell
    carpetArea: { type: Number, required: true },
    areaUnit: { type: String, required: true }, // Sq-ft, Sq-yrd, etc.
    ownership: { type: String, required: true }, // Freehold, Leasehold, etc.
    price: { type: Number, required: true }, // Selling price
    reraApproved:{type:String},
    reraNumber:{type:String},
    features: {
        washroom: { type: Number }, // e.g., Available, Not Available
        ageOfProperty: { type: String },
        totalFloors: { type: Number },
        floorNumber: { type: Number }
    },
    amenities: { type: [String] }, // e.g., Parking, Power Backup
    images: { type: [String] },
    video:{type: String},
    propertyId: { type: String, required: true },
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

module.exports = mongoose.model('Commercial', commercialSchema);
