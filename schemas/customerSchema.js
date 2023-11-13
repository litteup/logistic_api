const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }, 
    role:{
        type: String,
        enum:["customer","rider"],
        required: true
    }

}, {timestamps: true});


const userCollection = mongoose.model("customers", customerSchema);


module.exports = {
    userCollection
}