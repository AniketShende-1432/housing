const express = require("express");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utlis/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Sell = require("../models/sell");
const Rent = require("../models/rent");
const Plot = require("../models/plot");
const PG = require("../models/pg");
const Commercial = require("../models/commercial");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Use the imported Cloudinary instance
    params: {
        folder: 'real-estate-properties', // Cloudinary folder name
    },
});

const upload = multer({ storage });

router.get('/userproperties', async (req, res) => {
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
            .populate('sell')
            .populate('rent')
            .populate('plot')
            .populate('pg')
            .populate('commercial');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Combine all property arrays into one
        const allProperties = {
            sell: user.sell,
            rent: user.rent,
            plot: user.plot,
            pg: user.pg,
            commercial: user.commercial,
        };

        res.status(200).json(allProperties);
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ message: "Server Error. Please try again later." });
    }
});

router.put("/updateproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const parsedFeatures = Object.fromEntries(
            Object.entries(features).map(([key, value]) => {
                // Convert "null" or empty strings to null, otherwise parse as number
                return [key, value === "null" || value === "" ? null : Number(value)];
            })
        );
        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await Sell.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body, features: parsedFeatures, images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updaterentproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const parsedFeatures = Object.fromEntries(
            Object.entries(features).map(([key, value]) => {
                // Convert "null" or empty strings to null, otherwise parse as number
                return [key, value === "null" || value === "" ? null : Number(value)];
            })
        );
        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await Rent.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body, features: parsedFeatures, images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updateplotproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const dimensions = JSON.parse(JSON.stringify(req.body.dimensions));

        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await Plot.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body, features, dimensions, images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updatepgproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const parsedFeatures = Object.fromEntries(
            Object.entries(features).map(([key, value]) => {
                // Convert "null" or empty strings to null, otherwise parse as number
                return [key, value === "null" || value === "" ? null : Number(value)];
            })
        );
        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await PG.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body, features: parsedFeatures, images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updatecommproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const parsedFeatures = Object.fromEntries(
            Object.entries(features).map(([key, value]) => {
                // Convert "null" or empty strings to null, otherwise parse as number
                return [key, value === "null" || value === "" ? null : Number(value)];
            })
        );
        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await Commercial.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        if (property.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body, features: parsedFeatures, images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.delete('/deleteproperty/:propertyId', async (req, res) => {
    const { propertyId } = req.params;
    const token = req.cookies.authToken;
    if (!token) {
        return res.status(401).json({ message: "Please login first." });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        // Delete the property from the properties collection
        let property;
        let propertyType;
        if (req.body.propertyType === 'sell') {
            property = await Sell.findByIdAndDelete(propertyId);
            propertyType = 'sell';
        } else if (req.body.propertyType === 'Rent') {
            property = await Rent.findByIdAndDelete(propertyId);
            propertyType = 'rent';
        } else if (req.body.propertyType === 'PG') {
            property = await PG.findByIdAndDelete(propertyId);
            propertyType = 'pg';
        } else if (req.body.propertyType === 'Commercial') {
            property = await Commercial.findByIdAndDelete(propertyId);
            propertyType = 'commercial';
        } else if (req.body.propertyType === 'Plot') {
            property = await Plot.findByIdAndDelete(propertyId);
            propertyType = 'plot';
        }

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Remove the property from the user's related properties array
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the property from the correct array (e.g., sell, rent, etc.)
        user[propertyType] = user[propertyType].filter(id => id.toString() !== propertyId);
        await user.save();

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
});

const Modelmap = {
    sell: Sell,
    Rent: Rent,
    Plot: Plot,
    PG: PG,
    Commercial: Commercial
};

router.put("/increment-visit/:propertyType/:propertyId", async (req, res) => {
    try {
        const { propertyType, propertyId } = req.params;
        const Model = Modelmap[propertyType];
        const property = await Model.findByIdAndUpdate(
            propertyId,
            { $inc: { visits: 1 } }, // Increment visit count
            { new: true }
        );
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.json({ success: true, visits: property.visits });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/property-visit/:propertyType/:propertyId", async (req, res) => {
    try {
        const { propertyType, propertyId } = req.params;
        const Model = Modelmap[propertyType];

        if (!Model) {
            return res.status(400).json({ error: "Invalid property type" });
        }

        const property = await Model.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        const now = new Date();
        const lastVisitTime = property.lastVisitTime || new Date(0); // Default to old date if null

        const minutesPassed = (now - lastVisitTime) / (1000 * 60);
        if (minutesPassed < 5) {
            return res.status(400).json({ error: "Wait 15 minutes before refreshing again." });
        }
        // Increment visits and update timestamp
        property.visits += 1;
        property.lastVisitTime = now;

        await property.save();

        res.json({ success: true, visits: property.visits, lastVisitTime: property.lastVisitTime });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

router.put("/property-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { status, propertyType } = req.body;
        const Model = Modelmap[propertyType];
        let updatedProperty;
        if (status === 'Active') {
            updatedProperty = await Model.findByIdAndUpdate(
                id,
                { status, StatusUpdatedAt: new Date(), },
                { new: true }
            );
        } else {
            updatedProperty = await Model.findByIdAndUpdate(
                id,
                { status },
                { new: true }
            );
        }
        if (!updatedProperty) return res.status(404).json({ error: "Property not found" });

        res.json({ message: "Status updated successfully", property: updatedProperty });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


module.exports = router;