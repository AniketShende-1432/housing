const router = require("express").Router();
const Sell = require("../models/sell");
const Rent = require("../models/rent");
const Plot = require("../models/plot");
const PG = require("../models/pg");
const Commercial = require("../models/commercial");

const modelMapping = {
  sell: Sell,
  rent: Rent,
  plot: Plot,
  pg: PG,
  commercial: Commercial
};

const getProperties = async (modelName, filters,res) => {
  try {
    const model = modelMapping[modelName];  // Get the model dynamically
    if (!model) {
      return res.status(400).json({ message: "Invalid property type" });
    }
    const arrayFields = ["localities", "propertyType", "bedrooms","roomtype","Availablefor","ownership","approvedby","commproper"];
    arrayFields.forEach((field) => {
      if (filters[field]) {
        filters[field] = filters[field].split(",");
      }
    });
    const query = {};
    if (filters.budget) {
      query.price = { $lte: filters.budget };  // Filter for price
    }
    if(filters.rentBudget){
      query.monthlyRent = {$lte: filters.rentBudget};
    }
    if (filters.propertyType && filters.propertyType.length > 0) {
      query.propertyType = { $in: filters.propertyType };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.commproper && filters.commproper.length > 0) {
      query.propertyType = { $in: filters.commproper };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.city) {
      query.city = filters.city;  // Filter by locality
    }
    if (filters.roomtype && filters.roomtype.length > 0) {
      query.roomType = { $in: filters.roomtype }  // Filter by locality
    }
    if (filters.Availablefor && filters.Availablefor.length > 0) {
      query.availableFor = { $in: filters.Availablefor };  // Filter by locality
    }
    if (filters.ownership && filters.ownership.length > 0) {
      if(modelName==='plot'){
        query.ownershipType = { $in: filters.ownership };  // Filter by property type (e.g., 'Flat', 'Villa')
      }else{
        query.ownership = { $in: filters.ownership };  // Filter by property type (e.g., 'Flat', 'Villa')
      }
    }
    if (filters.approvedby && filters.approvedby.length > 0) {
      query.approvedBy = { $in: filters.approvedby };  // Filter by property type (e.g., 'Flat', 'Villa')
    }
    if (filters.localities && filters.localities.length > 0) {
      query.locality = { $in: filters.localities };  // Filter by locality
    }
    if (filters.bedrooms && filters.bedrooms.length > 0) {
      query.bhk = { $in: filters.bedrooms };  // Filter by number of bedrooms (e.g., '1BHK', '2BHK')
    }
    if (filters.area) {
      if (modelName === 'plot') {
        query.plotArea = {$lte: filters.area};
      } else {
        query.carpetArea = {$lte: filters.area}
      }
    }
    const properties = await model.find(query);  // Fetch all properties from the selected model
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

module.exports = router;