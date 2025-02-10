const express = require("express");
const userController = require("./user.controller");
// const {
//   parseForm,
// } = require("../../middleware/file_handler/formidableMiddleware");
const {
  validateToken,
} = require("../../middleware/http_middleware/tokenValidator");

const router = express.Router();

router.get("/get-presigned-url", validateToken, userController.getUrl);
router.patch("/upload-url-to-db", validateToken, userController.updateUrlToDb);
router.post("/upload-file-to-db", validateToken, userController.uploadFileToDb);
router.get("/get-files-of-user", validateToken, userController.getUserFiles);
// router.post('/upload-profile-picture',validateToken,parseForm(),userController.uploadProfilePicture)
router.get("/get-user-data", validateToken, userController.getUserData);
router.get("/get-excel-product-files",validateToken,userController.getExcelProductFiles)
router.get('/get-all-users',validateToken,userController.getAllUsers)
router.get('/get-allowed-features',validateToken,userController.getAllowedFeatures)
router.get('/get-all-features',userController.getAllFeatures)
router.get('/get-all-users-from-location',validateToken,userController.getAllUsersFromLocation)
router.delete('/remove-user-feature',validateToken,userController.removeUserFeature)
router.post('/add-user-feature',validateToken,userController.addUserFeature)

module.exports = router;
