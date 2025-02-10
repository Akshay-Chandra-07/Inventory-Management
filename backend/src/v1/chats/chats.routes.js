const express = require('express')
const { validateToken } = require('../../middleware/http_middleware/tokenValidator')
const chatsController = require('./chats.controller')
const router = express.Router()

router.get('/get-user-chats',validateToken,chatsController.getUserChats)
router.post('/add-user-to-chat',validateToken,chatsController.addUserToChat)
router.get('/get-chat-messages',validateToken,chatsController.getChatMessages)
router.post('/create-group',validateToken,chatsController.createGroupChat)
router.get('/get-chat-members',validateToken,chatsController.getChatMembers)
router.get('/get-all-groups',validateToken,chatsController.getAllGroupChats)
router.patch('/mark-chat-as-read',validateToken,chatsController.markChatAsRead)
router.post('/join-group',validateToken,chatsController.joinGroup)
router.delete('/leave-group',validateToken,chatsController.leaveGroup)
router.delete('/delete-group',validateToken,chatsController.deleteGroup)
router.delete('/remove-user-from-group',validateToken,chatsController.removeUserFromGroup)

module.exports = router