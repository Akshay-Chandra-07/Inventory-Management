const express = require('express')
const router = express.Router()

router.use('/auth',require('./auth/auth.routes'))
router.use('/users',require('./users/user.routes'))
router.use('/products',require('./products/products.routes'))
module.exports = router;