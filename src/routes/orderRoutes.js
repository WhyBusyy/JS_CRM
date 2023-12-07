const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderControllers");

router.get('/:ID', orderController.orderDetail);

module.exports = router;