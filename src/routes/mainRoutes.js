const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainControllers');

router.get('/user', mainController.userRoute);
router.get('/order', mainController.orderRoute);
router.get('/order_item', mainController.oiRoute);
router.get('/item', mainController.itemRoute);
router.get('/store', mainController.storeRoute);

module.exports = router;