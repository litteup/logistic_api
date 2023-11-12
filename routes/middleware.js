const express = require('express');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');


// Authentication middleware
// app.use((req, res, next) => {
//     const token = req.header('Authorization');

//     if (!token) {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ error: 'Invalid token' });
//         }

//         req.user = decoded;
//         next();
//     });
// });

function isUserLoggedIn(req,res,next){
    
    try {

        const authorizationHeader = req.headers.authorization;

        if(!authorizationHeader) return res.status(401).send("no-authorization-header");
        
        let value = authorizationHeader.split(" ");

        let tokenType = value[0];

        let tokenValue = value[1];

        if(tokenType == "Bearer"){
            const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
            req.decoded = decoded;
            console.log(req.decoded);
            next();
            return;
    
        }

        res.status(401).send("not-authorized");

    } catch (error) {
        console.log(`User not logged in.\n${error}`);        
    }
};

//function for who can create task - users less riders

function createOrders(req,res, next){
    if(req.decoded.role == 'user' ){
        next();
    }else{
        res.status(401).send("You are not authorized to place orders.");
    }
};

module.exports = {
    isUserLoggedIn,
    createOrders
    //ioAuthController
}