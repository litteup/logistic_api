const express = require('express');
const {userCollection} = require('../schemas/customerSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ordersCollection } = require('../schemas/orders');
require('dotenv').config();
const {isUserLoggedIn, createOrders} = require('../routes/middleware')


router.use(isUserLoggedIn);

router.post('/order', async (req, res) => {
    const {customerId} = req.decoded;
    console.log(req.decoded)
    try {
        const { address, destinationAddress, itemWeight } = req.body;
        const order = await ordersCollection.create({
            customerId,
            address,
            destinationAddress,
            itemWeight,
        });

        io.emit('orderStatusChange', { orderId: order._id, status: order.status });
        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// List of a customer's shipping request

router.get("/", async(req,res)=>{

    let customerOrders = await ordersCollection.find({customerId: req.decoded.customerId},"address destinationAddress itemWeight status");

    let formattedCustomerOrder = {};

    customerOrders.forEach(order => {
        // formattedCustomerOrder.Address = order.address;
        // formattedCustomerOrder.Destination_Address = order.destinationAddress;
        // formattedCustomerOrder.Weight = order.itemWeight;
        // formattedCustomerOrder.Status = order.status;
        console.log(order)
    });

    res.send({
        "Total orders": customerOrders.length,
        "Order": customerOrders
        
    });
});



module.exports = router;