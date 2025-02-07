const {Model} = require('objection')
const Users = require('./usersModel')
const Chats = require('./chatsModel')

class Messages extends Model{
    static get tableName(){
        return 'messages'
    }
    static get idColumn(){
        return 'message_id'
    }

    static get jsonSchema(){
        return{
            type: "object",
            required : ["message"],
            properties : {
                message_id : {type:"integer"},
                chat_id : {type : "integer"},
                user_id : {type : "integer"},
                message : {type:"string"}
            }
        }
    }

    static get relationMappings(){
        return{
            user : {
                relation: Model.BelongsToOneRelation,
                modelClass : Users,
                join : {
                    from: "messages.user_id",
                    to: "users.user_id"
                }
            },
            chat :{
                relation: Model.BelongsToOneRelation,
                modelClass : Chats,
                join: {
                    from:"messages.chat_id",
                    to:"chats.chat_id"
                }
            }

        }
    }
    
}

module.exports = Messages;