const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/auth.routes"));
router.use("/users", require("./users/user.routes"));
router.use("/products", require("./products/products.routes"));
router.use("/vendors", require("./vendors/vendors.routes"));
router.use("/categories", require("./categories/categories.routes"));
module.exports = router;
