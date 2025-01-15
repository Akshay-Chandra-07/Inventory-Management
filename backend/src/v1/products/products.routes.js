const express = require('express')
const { validateToken } = require('../../middleware/http_middleware/tokenValidator')
const productController = require('./products.controller')

const router = express.Router()

router.get('/get-page-products',validateToken,productController.getPageProducts)
router.get('/get-product-count',validateToken,productController.getProductCount)

module.exports = router