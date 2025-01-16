const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const Files = require("../../models/filesModel");

class userQueries {
  static async uploadProfilePicture(url, id) {
    return await Users.query(db)
      .update({ profile_pic: url })
      .where("user_id", "=", id);
  }

  static async getUserData(id) {
    return await Users.query(db)
      .select("first_name", "last_name", "email", "username", "profile_pic")
      .where("user_id", "=", id);
  }

  static async uploadFile(file_name, file_size, file_type, file_url, user_id) {
    return await Files.query(db).insert({
      file_name,
      file_size,
      file_type,
      file_url,
      user_id,
    });
  }

  static async getUserFiles(user_id) {
    return await Files.query(db)
      .select("file_id", "file_name", "file_size", "file_type", "file_url")
      .where("user_id", "=", user_id);
  }
}

module.exports = userQueries;
