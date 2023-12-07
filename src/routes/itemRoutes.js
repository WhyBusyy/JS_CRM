const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemControllers");

router.get('/:ID', itemController.itemDetail);

module.exports = router;
