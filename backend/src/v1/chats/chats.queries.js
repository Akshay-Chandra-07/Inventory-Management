const ChatUser = require("../../models/chat_userModel");
const Chats = require("../../models/chatsModel");
const Messages = require("../../models/messagesModel");
const db = require("../../mysql/db");

class ChatsQueries {
  static async getUserChats(user_id) {
    try {
      return await ChatUser.query(db)
        .select(
          "cu.chat_user_id",
          "cu.chat_id",
          "cu.chat_name",
          "cu.user_id",
          "cu.updated_at",
          "cu.is_read",
          "c.purpose",
          "c.created_by"
        )
        .from("chat_user as cu")
        .join("chats as c", "cu.chat_id", "c.chat_id")
        .where("user_id", "=", user_id)
        .orderBy("cu.updated_at", "desc");
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async addUserToChat(
    sender_name,
    receiver_name,
    sender_id,
    receiver_id
  ) {
    const chat_name = sender_name + "," + receiver_name;
    const trx = await db.transaction();
    try {
      const chat = await Chats.query(trx).insert({ chat_name: chat_name ,created_by:sender_id});
      await ChatUser.query(trx).insert({
        chat_id: chat.chat_id,
        user_id: sender_id,
        chat_name: receiver_name,
      });
      await ChatUser.query(trx).insert({
        chat_id: chat.chat_id,
        user_id: receiver_id,
        chat_name: sender_name,
      });
      await trx.commit();
      return chat.chat_id;
    } catch (error) {
      console.log(error);
      await trx.rollback();
      return error;
    }
  }

  static async getChatMessages(chat_id) {
    try {
      // return await Messages.query(db)
      //   .select("chat_id", "user_id", "message", "created_at")
      //   .where("chat_id", "=", chat_id)
      //   .orderBy("created_at", "asc");
      return await Messages.query(db).select("m.chat_id","m.user_id","m.message","m.created_at","u.username").from("messages as m").join("users as u","m.user_id","u.user_id").where("m.chat_id","=",chat_id).orderBy("m.created_at","asc")
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async getChatMembers(chat_id, userId) {
    try {
      const data = await ChatUser.query(db)
        .select("cu.chat_id", "cu.user_id", "u.username")
        .from("chat_user as cu")
        .join("users as u", "cu.user_id", "u.user_id")
        .where("cu.chat_id", "=", chat_id)
        .andWhere("cu.user_id", "<>", userId);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async addMessage(message, user_id, chat_id) {
    try {
      const message_id = await Messages.query(db).insert({
        chat_id: chat_id,
        user_id: user_id,
        message: message,
      });
      const mysqlFormattedDate = new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      await ChatUser.query(db)
        .patch({ is_read: "0", updated_at: mysqlFormattedDate })
        .where("user_id", "<>", user_id)
        .andWhere("chat_id", "=", chat_id);
      // return await Messages.query(db)
      //   .select("message_id", "chat_id", "user_id", "message", "created_at")
      //   .where("message_id", "=", message_id.message_id)
      //   .orderBy("created_at", "desc");
      return await Messages.query(db).select("m.chat_id","m.user_id","m.message","m.created_at","u.username").from("messages as m").join("users as u","m.user_id","u.user_id").where("m.message_id","=",message_id.message_id).orderBy("m.created_at","asc")
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async createGroupChat(userIds, groupName,userId) {
    const trx = await db.transaction();
    try {
      const group = await Chats.query(trx).insert({
        chat_name: groupName,
        purpose: "1",
        created_by : userId
      });
      console.log(group);
      await trx("chat_user").insert(
        userIds.map((userId) => ({
          chat_id: group.chat_id,
          user_id: parseInt(userId),
          chat_name: groupName,
        }))
      );
      trx.commit();
    } catch (error) {
      console.log(error);
      trx.rollback();
      return error;
    }
  }

  static async getAllGroupChats(userId) {
    try {
      const data = await Chats.query(db)
      .select("chat_id", "chat_name")
      .where("purpose", "=", "1")
      .andWhere("status","<>","99")
      .whereNotIn("chat_id", db("chat_user").select("chat_id").where("user_id","=",userId));
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async markChatAsRead(userId,chat_id){
    try{
        return await ChatUser.query(db).patch({is_read:"1"}).where("user_id","=",userId).andWhere("chat_id","=",chat_id)
    }catch(error){
        console.log(error)
        return error;
    }
  }

  static async joinGroup(userId,chat_id,chat_name){
    try{
      return await ChatUser.query(db).insert({chat_id:chat_id,user_id:userId,chat_name:chat_name})
    }catch(error){
      console.log(error)
      return error;
    }
  }

  static async leaveGroup(userId,chat_id){
    try{
      return await ChatUser.query(db).delete().where("chat_id","=",chat_id).andWhere("user_id","=",userId)
    }catch(error){
      console.log(error)
      return error;
    }
  }

  static async deleteGroup(chat_id){
    try{
      await ChatUser.query(db).delete().where("chat_id","=",chat_id)
      return await Chats.query(db).patch({status:"99"}).where("chat_id","=",chat_id)
    }catch(error){
      console.log(error)
      return error;
    }
  }

  static async removeUserFromGroup(chatId,userId){
    try{
      return await ChatUser.query(db).delete().where("chat_id","=",chatId).andWhere("user_id","=",userId)
    }catch(error){
      console.log(error)
      return error;
    }
  }
}

module.exports = ChatsQueries;
