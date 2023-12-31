const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeControllers");

router.get('/:ID', storeController.storeDetail);

module.exports = router;
