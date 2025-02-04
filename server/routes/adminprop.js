const router = require("express").Router();
const Sell = require("../models/sell");
const Rent = require("../models/rent");
const Plot = require("../models/plot");
const PG = require("../models/pg");
const Commercial = require("../models/commercial");
const multer = require('multer');
const cloudinary = require('../utlis/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { verifyAdmin } = require('../middleware/authadmin');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary, // Use the imported Cloudinary instance
    params: {
        folder: 'real-estate-properties', // Cloudinary folder name
    },
});
const upload = multer({ storage });

const propertyTypeToModel = {
    'Sell': Sell,
    'Rent': Rent,
    'PG': PG,
    'Plot/Land': Plot,
    'Commercial': Commercial,
};
// Route to fetch all properties
router.get('/properties', verifyAdmin, async (req, res) => {
    const { type, city, budget, rentBudget, propertyType, area, status } = req.query;
    try {
        let query = {};
        if (city) {
            query.$or = [
                { city : { $regex: city, $options: 'i' }},
                { propertyId : city},
            ]; // 
            // query.city = { $regex: city, $options: 'i' }; // Case-insensitive match for city
        }
        if (propertyType) {
            query.propertyType = propertyType; // Filter by specific propertyId if provided
        }
        if (Number(budget) > 0) {
            query.price = { $lte: budget }; // Filter by budget, assuming you want to find properties less than or equal to the budget
        }
        if (Number(rentBudget) > 0) {
            query.monthlyRent = { $lte: rentBudget }; // Filter by rentBudget
        }
        if (Number(area) > 0) {
            query.$or = [
                { carpetArea : {$lte: area }},
                { plotArea : {$lte: area }},
            ]; // Filter by area (greater than or equal to the specified area)
        }
        if (status) {
            query.status = status; // Filter by property status (if applicable)
        }
        if (type) {
            const PropertyModel = propertyTypeToModel[type]; // Get the model based on 'type'
            if (!PropertyModel) {
                return res.status(400).json({ message: 'Invalid property type' });
            }
            // Query the specific property type schema (e.g., Sell, Rent, PG, etc.)
            const properties = await PropertyModel.find(query);
            return res.status(200).json(properties);
        }
        // If no 'type' is provided, send all properties across all models
        const [sellProperties, pgProperties, rentProperties, plotProperties, commercialProperties] = await Promise.all([
            Sell.find(query),
            PG.find(query),
            Rent.find(query),
            Plot.find(query),
            Commercial.find(query)
        ]);
        // Combine all properties into one array
        const allProperties = [
            ...sellProperties,
            ...pgProperties,
            ...rentProperties,
            ...commercialProperties,
            ...plotProperties
        ];
        res.status(200).json(allProperties);  // 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching properties' });
    }
});

router.delete('/properties/:id', async (req, res) => {
    const { id } = req.params;
    const { propertyType } = req.body;

    try {
        let model;
        switch (propertyType) {
            case 'sell':
                model = Sell;
                break;
            case 'PG':
                model = PG;
                break;
            case 'Rent':
                model = Rent;
                break;
            case 'Plot':
                model = Plot;
                break;
            case 'Commercial':
                model = Commercial;
                break;
            default:
                return res.status(400).json({ message: 'Invalid property type' });
        }

        const deletedProperty = await model.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ message: 'Property not found' });
        }

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting property', error });
    }
});

router.put("/sellproperty/:propertyId",verifyAdmin, upload.array('newimages', 5), async (req, res) => {
    try {
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

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body,features:parsedFeatures,images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updaterentproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
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

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body,features:parsedFeatures,images: updatedImages });
        await property.save();
        res.status(200).json({ message: "Property updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updateplotproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
        const { propertyId } = req.params;
        const images = req.body.images || [];
        const features = JSON.parse(JSON.stringify(req.body.features));
        const dimensions = JSON.parse(JSON.stringify(req.body.dimensions));
       
        const newImages = req.files.map((file) => file.path);
        const imagesArray = Array.isArray(images) ? images : [images];

        const property = await Plot.findById(propertyId);
        if (!property) return res.status(404).json({ message: "Property not found" });

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body,features,dimensions,images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updatepgproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
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

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body,features:parsedFeatures,images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

router.put("/updatecommproperty/:propertyId", upload.array('newimages', 5), async (req, res) => {
    try {
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

        const updatedImages = [...imagesArray, ...newImages];

        Object.assign(property, { ...req.body,features:parsedFeatures,images: updatedImages });
        await property.save();

        res.status(200).json({ message: "Property updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating property" });
    }
});

module.exports = router;