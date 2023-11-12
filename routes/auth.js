const express = require('express');
const {userCollection} = require('../schemas/customerSchema');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const { riderCollection } = require('../schemas/riders');
require('dotenv').config();


// Express Routes
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const customer = await userCollection.create({
            fullName,
            email,
            password: hashedPassword,
            role: 'customer',
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            res.status(400).json({ error: 'Email already in use' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const customer = await userCollection.findOne({ email });

        if (!customer || !(await bcrypt.compare(password, customer.password))) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign({ customerId: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.send({ 
            isUserLoggedInSuccessful: true,
            token
         });
         
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;