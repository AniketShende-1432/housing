const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type :String,
        required : true,
    },
    email: {
        type :String,
        required : true,
        unique:true,
    },
    password: {
        type :String,
        required : true,
    },
    phone: {
        type: String,
        required: true,
    },
    usertype: {
        type :String,
        required:true,
    },
    agreement: {
        type: Boolean,
        required: true,   // Must agree to terms and conditions
    },
    coins: { type: Number, default: 5 },
    sell: [
        { type: mongoose.Types.ObjectId, ref: 'Sell' },
    ],
    rent: [
        { type: mongoose.Types.ObjectId, ref: 'Rent' },
    ],
    plot: [
        { type: mongoose.Types.ObjectId, ref: 'Plot' },
    ],
    pg: [
        { type: mongoose.Types.ObjectId, ref: 'PG' },
    ],
    commercial: [
        { type: mongoose.Types.ObjectId, ref: 'Commercial' },
    ],
},{ timestamps: true });

module.exports = mongoose.model("User",userSchema);