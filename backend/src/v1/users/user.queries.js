const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const Files = require("../../models/filesModel");
const FeatureToUser = require("../../models/feature_to_userModel");
const Features = require("../../models/featuresModel");

class userQueries {
  static async uploadProfilePicture(url, id) {
    return await Users.query(db)
      .patch({ profile_pic: url })
      .where("user_id", "=", id);
  }

  static async getUserData(id) {
    return await Users.query(db)
      .select("first_name", "last_name", "email", "username", "profile_pic","role","location")
      .where("user_id", "=", id);
  }

  static async getUserLocation(userId){
    return await Users.query(db).select("location").where("user_id","=",userId)
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
  
  static async getAllowedFeatures(user_id){
    try{
      return await FeatureToUser.query(db).select("feature_id").where("user_id","=",user_id).andWhere("status","<>","99")
    }catch(error){
      console.log(error)
      return;
    }
  }

  static async getAllFeatures(){
    try{
      return await Features.query(db).select("feature_id","feature_name").where("status","<>","99")
    }catch(error){
      console.log(error)
      return;
    }
  }

  static async getAllUsersFromLocation(user_id){
    try{
      const location = await Users.query(db).select("location").where("user_id","=",user_id)

      // await Users.query(db).select("username","role").where("location","=",location).andWhere("user_id","<>",user_id)
      return await FeatureToUser.query(db)
                    .select("f.feature_id","f.user_id","u.username","u.role").from("feature_to_user as f").leftJoin("users as u","u.user_id","f.user_id").where("u.location","=",location[0].location).andWhere("f.user_id","<>",user_id).andWhere("f.status","<>","99")
    }catch(error){
      console.log(error)
      return;
    }
  }

  static async removeUserFeature(featureId,userId){
    try{
      return await FeatureToUser.query(db).patch({status:"99"}).where("feature_id","=",featureId).andWhere("user_id","=",userId)
    }catch(error){
      console.log(error)
      return;
    }
  }
  
  static async addUserFeature(featureId,userId){
    try{
      return await FeatureToUser.query(db).insert({feature_id:featureId,user_id:userId})
    }catch(error){
      console.log(error)
      return;
    }
  }
}

module.exports = userQueries;
