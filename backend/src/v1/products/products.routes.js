const express = require("express");
const {
  validateToken,
} = require("../../middleware/http_middleware/tokenValidator");
const productController = require("./products.controller");

const router = express.Router();

router.get(
  "/get-page-products",
  validateToken,
  productController.getPageProducts,
);
router.get(
  "/get-product-count",
  validateToken,
  productController.getProductCount,
);
router.post(
  "/insert-product-data-to-db",
  validateToken,
  productController.insertProductData,
);
router.patch(
  "/insert-image-url-to-product-db",
  validateToken,
  productController.insertProductUrlToTable,
);

module.exports = router;
