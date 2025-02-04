const db = require("../../mysql/db");
const Users = require("../../models/usersModel");

class AuthQueries {
  static async checkUser(email) {
    return await Users.query(db).select("user_id").where("email", "=", email);
  }

  static async register(first_name, last_name, email,role, username, password) {
    try {
      await Users.query(db).insert({
        first_name,
        last_name,
        email,
        role,
        username,
        password,
      });
      return true;
    } catch (error) {
      return error;
    }
  }

  static async checkCredentials(user) {
    return await Users.query(db)
      .select("user_id", "username", "email", "password","role")
      .where("email", "=", user)
      .orWhere("username", "=", user);
  }
  static async setRefreshToken(id, token) {
    return await Users.query(db)
      .patch({ refresh_token: token })
      .where("user_id", "=", id);
  }

  static async getRefreshToken(id) {
    const token = await Users.query(db)
      .select("refresh_token")
      .where("user_id", "=", id);
    return token[0].refresh_token;
  }

  static async updateUserPassword(password,user_id){
    return await Users.query(db).patch({password:password}).where("user_id",'=',user_id)
  }
  
}

module.exports = AuthQueries;
