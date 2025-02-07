const {Model} = require('objection')
const Messages = require('./messagesModel')
const ChatUser = require('./chat_userModel')

class Chats extends Model{
    static get tableName(){
        return 'chats'
    }
    static get idColumn(){
        return 'chat_id'
    }

    static get jsonSchema(){
        return{
            type: "object",
            required : [],
            properties : {
                chat_id : {type : "integer"},
                chat_name : {type : "string"},
                purpose : {type : "string"},
                status : {type : "string"},
                created_by : {type : "integer"}
            }
        }
    }

    static get relationMappings(){
        return{
            messages : {
                relation : Model.HasManyRelation,
                modelClass : Messages,
                join:{
                    from : "chats.chat_id",
                    to : "messages.chat_id"
                }
            },
            chats : {
                relation : Model.HasManyRelation,
                modelClass : ChatUser,
                join:{
                    from: "chats.chat_id",
                    to:"chat_user.chat_id"
                }
            }
        }

    }
    
}

module.exports = Chats;