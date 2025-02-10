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
  "/get-all-products",
  validateToken,
  productController.getAllProducts,
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

router.put(
  "/update-product-data-in-db",
  validateToken,
  productController.updateProductData,
);

router.patch(
  "/insert-image-url-to-product-db",
  validateToken,
  productController.insertProductUrlToTable,
);
router.patch(
  "/delete-single-product",
  validateToken,
  productController.deleteSingleProduct,
);

router.patch(
  "/update-quantity",
  validateToken,
  productController.updateQuantityInTable,
);

router.post(
  "/insert-excel-products",
  validateToken,
  productController.insertExcelProducts,
);



module.exports = router;
