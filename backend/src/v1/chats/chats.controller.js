const { getSocketId, getIo } = require("../../utils/socket_config")
const userQueries = require("../users/user.queries")
const ChatsQueries = require("./chats.queries")



exports.getUserChats = async (req,res,next)=>{
    try{
        const data = await ChatsQueries.getUserChats(req.userId)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error fetching users"})
    }
}

exports.addUserToChat = async (req,res,next)=>{
    const {receiver_name,receiver_id} = req.body
    const sender_id = req.userId
    try{
        const senderData = await userQueries.getUserData(sender_id)
        await ChatsQueries.addUserToChat(senderData[0].username,receiver_name,sender_id,receiver_id)
        return res.status(201).json({msg:"Chat created"})
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error initiating chat"})
    }

}

exports.getChatMessages = async (req,res,next)=>{
    const chat_id = req.query.chat_id
    try{
        const data = await ChatsQueries.getChatMessages(chat_id)
        await ChatsQueries.markChatAsRead(req.userId,chat_id)
        const socketId = getSocketId(req.userId)
        const io = getIo()
        io.to(socketId).emit("onMarkedChatAsRead",req.query.chat_id)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error getting chat messages"})
    }
}

exports.createGroupChat = async (req,res,next)=>{
    const userIds = Object.keys(req.body.groupUsers)
    userIds.push(req.userId)
    try{
        await ChatsQueries.createGroupChat(userIds,req.body.groupName,req.userId)
        return res.status(201).json(userIds)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error creating group"})
    }
}

exports.getChatMembers = async (req,res,next)=>{
    try{
        const data = await ChatsQueries.getChatMembers(req.query.chat_id,req.userId)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error fetching members"})
    }
}

exports.getAllGroupChats = async (req,res,next)=>{
    try{
        const data = await ChatsQueries.getAllGroupChats(req.userId)
        return res.status(200).json(data)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error fetching groups"})
    }
}

exports.markChatAsRead = async (req,res,next)=>{
    try{
        await ChatsQueries.markChatAsRead(req.userId,req.body.chat_id)
        return res.status(200).json({msg:"Marked as read"})
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error marking as unread"})
    }
}

exports.joinGroup = async (req,res,next)=>{
    try{
        await ChatsQueries.joinGroup(req.userId,req.body.chat_id,req.body.chat_name)
        return res.status(200).json({msg:"Group joined"})
    }catch(error){
        console.log(error)
        return res.status(400).jos({msg:"Error joining group"})
    }
}

exports.leaveGroup = async (req,res,next)=>{
    try{
        await ChatsQueries.leaveGroup(req.userId,req.query.chatId)
        return res.status(200).json({msg:"Group left"})
    }catch(error){
        console.log(error)
        return res.status(400).jos({msg:"Error leaving group"})
    }
}

exports.deleteGroup = async (req,res,next)=>{
    try{
        await ChatsQueries.deleteGroup(req.query.chatId)
        return res.status(200).json({msg:"Group deleted"})
    }catch(error){
        console.log(error)
        return res.status(400).jos({msg:"Error deleting group"})
    }
}

exports.removeUserFromGroup = async(req,res,next)=>{
    try{
        await ChatsQueries.removeUserFromGroup(req.query.chatId,req.query.userId)
        const io = getIo()
        console.log(req.query.userId)
        const socketId = getSocketId(parseInt(req.query.userId))
        console.log(socketId)
        if(socketId){
            io.to(socketId).emit("onRemovedFromGroup",req.query.chatName)
        }
        return res.status(200).json({msg:"User removed"})
    }catch(error){
        console.log(error)
        return res.status(400).jos({msg:"Error removing user"})
    }
}