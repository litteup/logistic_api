const express = require("express");
const router = express.Router();

const riderOnly = require('../utils/riderOnly');
const isUserLoggedIn = require('../utils/isUserLoggedIn');

const fetchAllOrders = require('../controllers/shipping/fetchAll');

router.use(isUserLoggedIn);
router.use(riderOnly);

// Route to get the list of all shipping requests by a customer
router.get('/view-all', fetchAllOrders);

module.exports = router;