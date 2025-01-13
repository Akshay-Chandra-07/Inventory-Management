const express = require('express')
const authController = require('./auth.controller')

const router = express.Router()


router.post('/signup',authController.register)

module.exports = router;