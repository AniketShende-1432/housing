const mongoose = require('mongoose');

const PropertyViewSchema = new mongoose.Schema({
    propertyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: "type" // Dynamic reference based on propertyType
      },
      type: { 
        type: String, 
        required: true,
      },
      owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true // Stores the owner of the property
      },
      views: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User who viewed
          viewedAt: { type: Date, default: Date.now } // Timestamp of the view
        }
      ]

}, { timestamps: true });

module.exports = mongoose.model('PropertyView', PropertyViewSchema);