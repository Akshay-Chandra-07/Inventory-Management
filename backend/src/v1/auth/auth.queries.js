const db = require('../../mysql/db')
const Users = require('../../models/usersModel')

class AuthQueries{
    static async checkUser(email){
        return await Users.query(db).select("user_id").where("email","=",email)
    }
    static async register(first_name,last_name,email,username,password){        
        try{
            await Users.query(db).insert({first_name,last_name,email,username,password})
            return true
        }catch(error){
            console.log(error);
            return error;
        }
    }
}

module.exports = AuthQueries
