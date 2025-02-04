const express = require('express')
const { validateToken } = require('../../middleware/http_middleware/tokenValidator')
const notificationController = require('./notifications.controller')
const router = express.Router()

router.get('/get-user-notifications',validateToken,notificationController.getUserNotifications)
router.patch('/update-status',validateToken,notificationController.updateStatus)
// router.delete('/delete-old-notifications',notificationController.deleteOldNotifications)
// router.post('/create-user-notification')

module.exports = router
