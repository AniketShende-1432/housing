const router = require("express").Router();
const multer = require('multer');
require('dotenv').config()
const cloudinary = require('../utlis/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const jwt = require("jsonwebtoken");
const path = require('path');
const Sell = require("../models/sell");
const User = require("../models/user");
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

const generateUniquePropertyId = async (prefix) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        const randomPart = Array.from({ length: 6 })
            .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
            .join('');
        uniqueId = `${prefix}${randomPart}`;

        // Check if the ID already exists in the database
        const existingProperty = await Promise.any([
            Sell.findOne({ propertyId: uniqueId }),
            Rent.findOne({ propertyId: uniqueId }),
            Plot.findOne({ propertyId: uniqueId }),
            PG.findOne({ propertyId: uniqueId }),
            Commercial.findOne({ propertyId: uniqueId })
        ]);
        if (!existingProperty) {
            isUnique = true;
        }
    }

    return uniqueId;
};

router.post("/sellproperty", upload.array('images', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const { price,type,propertyType,city,locality,society,bhk,furnishedType,carpetArea,carpetAreaUnit,superArea,
            superAreaUnit,possessionStatus,developer,societyArea,societyAreaUnit,amenities } = req.body;
            const images = req.files.map(file => file.path);
            const features = JSON.parse(JSON.stringify(req.body.features));
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const sell = new Sell({ price,type,propertyType,city,locality,society,bhk,furnishedType,carpetArea,carpetAreaUnit,superArea,
                superAreaUnit,possessionStatus,features,developer,societyArea,societyAreaUnit,amenities,images,propertyId,user:userId });
            
            await sell.save().then(()=>res.status(200).json({ message: 'Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { sell: sell } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/rentproperty", upload.array('images', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const rentData = {...req.body};
        const images = req.files.map(file => file.path);
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = rentData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const rent = new Rent({ ...rentData,images,features,propertyId,user:userId });
            
            await rent.save().then(()=>res.status(200).json({ message: 'Rent Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { rent: rent } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/plotproperty",upload.array('images', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const plotData = {...req.body};
        const images = req.files.map(file => file.path);
        const features = JSON.parse(JSON.stringify(req.body.features));
        const dimensions = JSON.parse(JSON.stringify(req.body.dimensions));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = 'PLT' // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const plot = new Plot({ ...plotData,images,features,dimensions,propertyId,user:userId });
            
            await plot.save().then(()=>res.status(200).json({ message: 'Plot Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { plot: plot } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/pgproperty",upload.array('images', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const pgData = {...req.body};
        const images = req.files.map(file => file.path);
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = pgData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const pg = new PG({ ...pgData,images,features,propertyId,user:userId });
            
            await pg.save().then(()=>res.status(200).json({ message: 'PG Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { pg: pg } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/commercialproperty",upload.array('images', 5), async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const commData = {...req.body};
        const images = req.files.map(file => file.path);
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = commData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const comm = new Commercial({ ...commData,images,features,propertyId,user:userId });
            
            await comm.save().then(()=>res.status(200).json({ message: 'Commercial Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { commercial: comm } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

module.exports = router;