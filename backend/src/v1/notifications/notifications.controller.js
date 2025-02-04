const NotificationQueries = require("./notifications.queries")

exports.getUserNotifications = async(req,res,next)=>{
    try{
        const notificationData = await NotificationQueries.getUserNotifications(req.userId)
        return res.status(200).json(notificationData)
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error fetching user notifications"})
    }
}

exports.updateStatus = async (req,res,next)=>{
    try{
        await NotificationQueries.updateStatus(req.body.id)
        return res.status(200).json({msg:"Marked as read"})
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error marking as read"})
    }
}
// exports.deleteOldNotifications = async(req,res,next)=>{
    
// }

// exports.createUserNotification = async(req,res,next)=>{
    
// }