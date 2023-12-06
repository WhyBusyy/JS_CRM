const express = require("express");
const router = express.Router();
const oiController = require("../controllers/oiControllers");

router.get('/:ID', oiController.oiId);

module.exports = router;