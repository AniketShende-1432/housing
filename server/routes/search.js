const router = require("express").Router();
const Sell = require("../models/sell");
const Rent = require("../models/rent");
const Plot = require("../models/plot");
const PG = require("../models/pg");
const Commercial = require("../models/commercial");
const User = require("../models/user");
const PropertyView = require("../models/PropertyView");
require('dotenv').config()
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require('twilio');

const modelMapping = {
  sell: Sell,
  rent: Rent,
  plot: Plot,
  pg: PG,
  commercial: Commercial
};
const contactModel = {
  sell: Sell,
  Rent: Rent,
  Plot: Plot,
  PG: PG,
  Commercial: Commercial
};

const getProperties = async (modelName, filters, res) => {
  try {
    const model = modelMapping[modelName];  // Get the model dynamically
    if (!model) {
      return res.status(400).json({ message: "Invalid property type" });
    }
    const arrayFields = ["localities", "propertyType", "bedrooms", "roomtype", "Availablefor", "ownership", "approvedby", "commproper", "reraApproved"];
    arrayFields.forEach((field) => {
      if (filters[field]) {
        filters[field] = filters[field].split(",");
      }
    });
    const query = {};
    if (filters.minbudget && filters.maxbudget && (modelName !== 'rent' && modelName !== 'pg')) {
      query.price = {
        $gte: filters.minbudget,  // Greater than or equal to minbudget
        $lte: filters.maxbudget,  // Less than or equal to maxbudget
      };
    }
    if (filters.minrent !== undefined && filters.maxrent !== undefined && (modelName === 'rent' || modelName === 'pg')) {
      query.monthlyRent = {
        $gte: filters.minrent,  // Greater than or equal to minbudget
        $lte: filters.maxrent,  // Less than or equal to maxbudget
      };
    }
    if (filters.propertyType && filters.propertyType.length > 0) {
      query.propertyType = { $in: filters.propertyType };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.commproper && filters.commproper.length > 0) {
      query.propertyType = { $in: filters.commproper };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.city) {
      query.$or = [
        { city: { $regex: filters.city, $options: "i" } },  // Case-insensitive city match
        { locality: { $regex: filters.city, $options: "i" } }  // Case-insensitive search in locality array
      ];
    }
    if (filters.roomtype && filters.roomtype.length > 0) {
      query.roomType = { $in: filters.roomtype }  // Filter by locality
    }
    if (filters.Availablefor && filters.Availablefor.length > 0) {
      query.availableFor = { $in: filters.Availablefor };  // Filter by locality
    }
    if (filters.ownership && filters.ownership.length > 0) {
      if (modelName === 'plot') {
        query.ownershipType = { $in: filters.ownership };  // Filter by property type (e.g., 'Flat', 'Villa')
      } else {
        query.ownership = { $in: filters.ownership };  // Filter by property type (e.g., 'Flat', 'Villa')
      }
    }
    if (filters.approvedby && filters.approvedby.length > 0) {
      query.approvedBy = { $in: filters.approvedby };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.localities && filters.localities.length > 0) {
      query.$or = [
        ...(query.$or || []),  // Keep previous $or conditions if any
        ...filters.localities.map(locality => ({
          locality: { $regex: locality, $options: "i" }  // Add localities to $or array
        }))
      ];
    }
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      query.bhk = { $in: filters.bedrooms };  // Filter by number of bedrooms (e.g., '1BHK', '2BHK')
    }
    if (filters.reraApproved && filters.reraApproved.length > 0) {
      query.reraApproved = { $in: filters.reraApproved };  // Filter by number of bedrooms (e.g., '1BHK', '2BHK')
    }
    if (filters.minarea !== undefined && filters.maxarea !== undefined) {
      if (modelName === 'plot') {
        query.plotArea = {
          $gte: filters.minarea,  // Allow 0 as a valid minimum value
          $lte: filters.maxarea,
        };
      } else {
        query.carpetArea = {
          $gte: filters.minarea,  // Allow 0 as a valid minimum value
          $lte: filters.maxarea,
        };
      }
    }
    if (filters.photos === 'true') {
      query.images = { $exists: true, $not: { $size: 0 } }; // Filter properties with at least one photo
    }
    if (filters.videos === 'true') {
      query.video = { $ne: null }; // Filter properties with at least one video
    }
    const sortmethod = { visits: -1 }
    query.status = 'Active';
    const properties = await model.find(query).sort(sortmethod);  // Fetch all properties from the selected model
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

router.get('/properties/:type', (req, res) => {
  const { type } = req.params;
  const filters = req.query;
  getProperties(type, filters, res);
});

// Example Node.js/Express endpoint to get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/sendsms', async (req, res) => {
  const { type, propertyId, userId } = req.body;
  const model = contactModel[type];
  try {
    const property = await model.findOne({ propertyId: propertyId }).populate('user'); // Property has a reference to the user (owner)
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const owner = property.user;
    const user = await User.findById(userId);  // The logged-in user (the interested buyer)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // 2. Prepare the message
    const message = `ShelterBIG,\nHello ${owner.name},\n\nUser ${user.name} is interested in buying your property at ${property.locality}, ${property.city}. Contact details: +91 ${user.phone}, ${user.email}.`;
    // 3. Send SMS using Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    phoneNumber = `+91 ${owner.phone}` // Use your Twilio SID and Auth Token here
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,  // Your Twilio number
      to: phoneNumber,  // Property owner's phone number
    });
    res.status(200).json({ message: 'Your Information is send to Owner' });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ message: 'Failed to send SMS' });
  }
});

router.post("/add-viewdata", async (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(200).json({ message: "Please Login first" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { p_id, type } = req.body;
    const propertyModel = contactModel[type];

    const property = await propertyModel.findById(p_id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    const ownerId = property.user; // Assuming each property schema has an `owner` field
    // Check if a view entry already exists for this property
    let propertyView = await PropertyView.findOne({ propertyId:p_id });
    if (!propertyView) {
      // If no entry exists, create a new one
      propertyView = new PropertyView({
        propertyId: p_id,
        type:propertyModel,
        owner: ownerId,
        views: [{ userId, viewedAt: new Date() }]
      });
    } else {
      // Check if user has already viewed this property
      const hasViewed = propertyView.views.some(view => view.userId.toString() === userId);
      if (!hasViewed) {
        // Add new view to the array
        propertyView.views.push({ userId, viewedAt: new Date() });
      }
    }
    await propertyView.save();
    res.status(200).json({ message: "View recorded successfully" });

  } catch (error) {
    console.error("Error adding view:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;