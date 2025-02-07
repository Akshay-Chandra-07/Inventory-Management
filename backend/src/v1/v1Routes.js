const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth/auth.routes"));
router.use("/users", require("./users/user.routes"));
router.use("/products", require("./products/products.routes"));
router.use("/vendors", require("./vendors/vendors.routes"));
router.use("/categories", require("./categories/categories.routes"));
router.use("/files", require("./files/files.routes"));
router.use("/notifications",require('./notifications/notifications.routes'));
router.use("/chats",require('./chats/chats.routes'))
module.exports = router;
