const db = require('../../mysql/db')
const Users = require('../../models/usersModel')

class userQueries{
    static async uploadProfilePicture(url,id){
        return await Users.query(db).update({'profile_pic':url}).where('user_id','=',id)
    }

    static async getUserData(id){
        return await Users.query(db).select("first_name","last_name","email","username","profile_pic").where("user_id","=",id)
    }
}

module.exports = userQueries