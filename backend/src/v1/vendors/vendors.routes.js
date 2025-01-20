const express = require("express");
const {
  validateToken,
} = require("../../middleware/http_middleware/tokenValidator");
const vendorController = require("./vendors.controller");

const router = express.Router();

router.get("/get-all-vendors", validateToken, vendorController.getAllVendors);

module.exports = router;
