const router = require("express").Router();
const PropertyView = require("../models/PropertyView");
require('dotenv').config();
const User = require("../models/user");
const jwt = require("jsonwebtoken");

router.get('/userpropertiesId', async (req, res) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(200).json({ message: "Please login first." });
    }

    try {
        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        // Fetch user with populated properties
        const user = await User.findById(userId)
            .populate('sell','propertyId')
            .populate('rent','propertyId')
            .populate('plot','propertyId')
            .populate('pg','propertyId')
            .populate('commercial','propertyId');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Combine all property arrays into one
        const allPropertyIds = {
          sell: user.sell,
          rent: user.rent,
          plot: user.plot,
          pg: user.pg,
          commercial: user.commercial,
      };

      res.status(200).json(allPropertyIds);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Server Error. Please try again later." });
    }
});

router.get("/my-property-views/:propertyId", async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: "Please login first" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id; // Logged-in user ID (owner of properties)
      const {propertyId} = req.params;
      // Fetch all PropertyView records where the owner is the logged-in user
      const propertyViews = await PropertyView.find({ owner: userId, propertyId })
        .populate("propertyId") // Populate property details
        .populate("views.userId"); // Populate user details (who viewed)
  
      res.status(200).json({ propertyViews });
  
    } catch (error) {
      console.error("Error fetching property views:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  module.exports = router;
  