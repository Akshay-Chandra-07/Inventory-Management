const express = require("express");
const {
  validateToken,
} = require("../../middleware/http_middleware/tokenValidator");
const categoriesController = require("./categories.controller");
const router = express.Router();

router.get(
  "/get-all-categories",
  validateToken,
  categoriesController.getAllCategories,
);

module.exports = router;
