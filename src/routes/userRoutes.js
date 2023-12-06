const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.get('/:ID', userController.userId);

module.exports = router;