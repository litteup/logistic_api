const mongoose = require('mongoose');


const orderSchema = new mongoose.Schema({
    address:{
        type: String,
        required: true,
    },
    destinationAddress:{
        type: String,
        required: true,
    },
    itemWeight:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:["pending", "in-trasit","completed"],
        default: "pending"
    }, 
    riderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "riders",
        default: null
    },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customers"
    }, 
    costOfShipping:{
        type: String,
        default: "N1,000"
    }

}, {timestamps: true});


const ordersCollection = mongoose.model("orders", orderSchema);


module.exports = {
    ordersCollection
}