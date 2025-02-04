// import Notifications from "../../models/notificationModel"
// import db from "../../mysql/db"
const Notifications = require('../../models/notificationModel')
const db = require("../../mysql/db")

class NotificationQueries{
    static async getUserNotifications(user_id){
        try{
            const notificationData = await Notifications.query(db).select("notification_id","user_id","message","status","created_at").where("user_id","=",user_id).andWhere("status","<>","99")
            return notificationData;
        }catch(error){
            console.log(error)
            return error
        }
    }
    static async createUserNotification(message,user_id){
        try{
            const data = await Notifications.query(db).insert({message:message,user_id:user_id})
            return data.notification_id
        }catch(error){
            console.log(error)
            return error
        }
    }
    static async getNotificationById(notificationId){
        try{
            const data = await Notifications.query(db).select("notification_id","user_id","message","status","created_at").where("notification_id",'=',notificationId)
            return data;
        }catch(error){
            console.log(error)
            return error;
        }
    }
    static async deleteOldNotifications(){
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        try{
            await Notifications.query(db).patch({status:"99"}).where('created_at','<', tenDaysAgo.toISOString())
        }catch(error){
            console.log(error)
            return error
        }
    }

    static async updateStatus(id){
        try{
            await Notifications.query(db).patch({status:"2"}).where("notification_id",'=',id)
            return;
        }catch(error){
            console.log(error)
            return error
        }
    }
}

module.exports = NotificationQueries