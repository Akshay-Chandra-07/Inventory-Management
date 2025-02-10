const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const Files = require("../../models/filesModel");
const FeatureToUser = require("../../models/feature_to_userModel");

class AuthQueries {
  static async checkUser(email) {
    return await Users.query(db).select("user_id").where("email", "=", email);
  }

  static async register(first_name, last_name, email,role, username, password,location) {
    const trx = await db.transaction()
    try {
      const createUser = await Users.query(db).insert({
        first_name,
        last_name,
        email,
        role,
        username,
        password,
        location
      });
      let featureArray = []
      if(role=="3"){
        featureArray = [
          {feature_id:1,user_id:createUser.user_id},
          {feature_id:2,user_id:createUser.user_id},
          {feature_id:3,user_id:createUser.user_id},
          {feature_id:4,user_id:createUser.user_id},
          {feature_id:5,user_id:createUser.user_id},
          {feature_id:6,user_id:createUser.user_id},
          {feature_id:7,user_id:createUser.user_id}
        ]
      }else if(role=="2"){
        featureArray = [
          {feature_id:2,user_id:createUser.user_id},
          {feature_id:5,user_id:createUser.user_id},
          {feature_id:7,user_id:createUser.user_id}
        ]
      }
      await trx('feature_to_user').insert(featureArray)
      await trx.commit()
      return true
    } catch (error) {
      await trx.rollback()
      console.log(error)
      return false;
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

  static async setResetToken(email,reset_token){
    try{
      return await Users.query(db)
      .patch({ refresh_token: reset_token })
      .where("email", "=", email);
    }catch(error){
      console.log(error)
    }
  }

  static async getResetToken(token){
    const data = await Users.query(db).select("refresh_token").where("refresh_token","=",token)
    return data;
  }
  
}

module.exports = AuthQueries;
