const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const Files = require("../../models/filesModel");

class userQueries {
  static async uploadProfilePicture(url, id) {
    return await Users.query(db)
      .patch({ profile_pic: url })
      .where("user_id", "=", id);
  }

  static async getUserData(id) {
    return await Users.query(db)
      .select("first_name", "last_name", "email", "username", "profile_pic")
      .where("user_id", "=", id);
  }

  static async uploadFile(file_name, file_size, file_type, file_url, user_id,purpose) {
    return await Files.query(db).insert({
      file_name,
      file_size,
      file_type,
      file_url,
      user_id,
      purpose,
    });
  }

  static async getUserFiles(user_id) {
    return await Files.query(db)
      .select("file_id", "file_name", "file_size", "file_type", "file_url")
      .where("purpose","=","0");
  }
  static async getExcelProductFiles(user_id){
    return await Files.query(db)
      .select("file_id", "file_name", "file_size", "file_type", "file_url","created_at","error_file","status","total_rows","accepted_rows")
      .where("user_id", "=", user_id).andWhere("purpose","=","1");
  }

  static async getAllUsers(user_id){
    try{
      return await Users.query(db).select("user_id","first_name","last_name","username","profile_pic").where("user_id","<>",user_id)
    }catch(error){
      console.log(error)
      return;
    }
  }

  static async getUserIdByUsername(username){
    try{
      return await Users.query(db).select("user_id").where("username","=",username)
    }catch(error){
      console.log(error)
      return;
    }
  }
}

module.exports = userQueries;
