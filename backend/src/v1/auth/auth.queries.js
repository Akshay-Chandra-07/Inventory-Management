const db = require("../../mysql/db");
const Users = require("../../models/usersModel");

class AuthQueries {
  static async checkUser(email) {
    return await Users.query(db).select("user_id").where("email", "=", email);
  }

  static async register(first_name, last_name, email, username, password) {
    try {
      await Users.query(db).insert({
        first_name,
        last_name,
        email,
        username,
        password,
      });
      return true;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async checkCredentials(user) {
    return await Users.query(db)
      .select("user_id", "username", "email", "password")
      .where("email", "=", user)
      .orWhere("username", "=", user);
  }
  static async setRefreshToken(id, token) {
    console.log("setting token ", token);
    return await Users.query(db)
      .patch({ refresh_token: token })
      .where("user_id", "=", id);
  }

  static async getRefreshToken(id) {
    const token = await Users.query(db)
      .select("refresh_token")
      .where("user_id", "=", id);
    //  console.log("fetching token " ,token[0].refresh_token)
    console.log("fetfching", token[0].refresh_token);
    return token[0].refresh_token;
  }
}

module.exports = AuthQueries;
