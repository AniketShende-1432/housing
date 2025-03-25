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

// const imageStorage = new CloudinaryStorage({
//     cloudinary: cloudinary, // Use the imported Cloudinary instance
//     params: {
//         folder: 'real-estate-properties', // Cloudinary folder name
//         resource_type: 'image', // This is required for video uploads
//     },
// });
// const videoStorage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'real-estate-properties/videos',
//         resource_type: 'video', // This is required for video uploads
//     },
// });
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isImage = file.mimetype.startsWith("image/");
        return {
            folder: isImage ? 'real-estate-properties' : 'real-estate-properties/videos',
            resource_type: isImage ? 'image' : 'video',
        };
    }
});
const upload = multer({ storage });
const uploadFields = upload.fields([
    { name: 'images', maxCount: 5 },  // Allow up to 5 images
    { name: 'video', maxCount: 1 }   // Allow only 1 video
])
// const uploadVideo = multer({ storage: videoStorage });

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

router.post("/sellproperty",uploadFields,async (req, res) => {        
    try {
        const token = req.cookies.authToken;
        const { price,type,propertyType,city,locality,society,bhk,furnishedType,carpetArea,carpetAreaUnit,superArea,
            superAreaUnit,possessionStatus,developer,societyArea,societyAreaUnit,reraApproved,reraNumber,amenities } = req.body;
            // const images = req.files.map(file => file.path);
            const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
            // const video = req.file.path;
            const video = req.files['video'] ? req.files['video'][0].path:null;
            const features = JSON.parse(JSON.stringify(req.body.features));
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const sell = new Sell({ price,type,propertyType,city,locality,society,bhk,furnishedType,carpetArea,carpetAreaUnit,superArea,
                superAreaUnit,possessionStatus,features,developer,societyArea,societyAreaUnit,reraApproved,reraNumber,amenities,images,video,propertyId,user:userId });
            
            await sell.save().then(()=>res.status(200).json({ message: 'Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { sell: sell } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/rentproperty", uploadFields, async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const rentData = {...req.body};
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const video = req.files['video'] ? req.files['video'][0].path:null;
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = rentData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const rent = new Rent({ ...rentData,images,video,features,propertyId,user:userId });
            
            await rent.save().then(()=>res.status(200).json({ message: 'Rent Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { rent: rent } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/plotproperty",uploadFields, async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const plotData = {...req.body};
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const video = req.files['video'] ? req.files['video'][0].path:null;
        const features = JSON.parse(JSON.stringify(req.body.features));
        const dimensions = JSON.parse(JSON.stringify(req.body.dimensions));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = 'PLT' // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const plot = new Plot({ ...plotData,images,video,features,dimensions,propertyId,user:userId });
            
            await plot.save().then(()=>res.status(200).json({ message: 'Plot Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { plot: plot } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/pgproperty",uploadFields, async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const pgData = {...req.body};
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const video = req.files['video'] ? req.files['video'][0].path:null;
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = pgData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const pg = new PG({ ...pgData,images,video,features,propertyId,user:userId });
            
            await pg.save().then(()=>res.status(200).json({ message: 'PG Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { pg: pg } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

router.post("/commercialproperty",uploadFields, async (req, res) => {
    try {
        const token = req.cookies.authToken;
        const commData = {...req.body};
        const images = req.files['images'] ? req.files['images'].map(file => file.path) : [];
        const video = req.files['video'] ? req.files['video'][0].path:null;
        const features = JSON.parse(JSON.stringify(req.body.features));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const existingUser = await User.findById(userId);
        const prefix = commData.propertyType.substring(0, 3).toUpperCase(); // Use first 3 letters of propertyType
        const propertyId = await generateUniquePropertyId(prefix);
        if(existingUser){
            const comm = new Commercial({ ...commData,images,video,features,propertyId,user:userId });
            
            await comm.save().then(()=>res.status(200).json({ message: 'Commercial Property posted successfully'}));
            
            await User.findByIdAndUpdate(userId, { $push: { commercial: comm } });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error posting property' });
    };

});

module.exports = router;