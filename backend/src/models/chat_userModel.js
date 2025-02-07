const {Model} = require('objection')
const Users = require('./usersModel')
const Chats = require('./chatsModel')

class ChatUser extends Model{
    static get tableName(){
        return 'chat_user'
    }
    static get idColumn(){
        return 'chat_user_id'
    }

    static get jsonSchema(){
        return{
            type: "object",
            required : ["chat_name"],
            properties : {
                chat_user_id : {type:"integer"},
                chat_id : {type : "integer"},
                user_id : {type : "integer"},
                chat_name : {type : "string"}
            }
        }
    }

    static get relationMappings(){
        return{
            users : {
                relation : Model.HasManyRelation,
                modelClass : Users,
                join:{
                    from : "chat_user.user_id",
                    to : "users.user_id"
                }
            },
            chats : {
                relation : Model.HasManyRelation,
                modelClass : Chats,
                join:{
                    from: "chat_user.chat_id",
                    to:"chats.chat_id"
                }
            }
        }
    }
    
}

module.exports = ChatUser;