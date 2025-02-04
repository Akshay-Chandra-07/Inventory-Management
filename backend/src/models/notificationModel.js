const {Model} = require('objection')
const Users = require('./usersModel')

class Notifications extends Model{
    static get tableName(){
        return 'notifications'
    }
    static get idColumn(){
        return 'notification_id'
    }

    static get jsonSchema(){
        return{
            type:'object',
            required : ['message'],
            properties : {
                notification_id : {type:'integer'},
                user_id : {type : 'integer'},
                message : { type : 'string'},
            }
        }
    }

    static get relationMappings(){
        return{
            notification : {
                relation : Model.BelongsToOneRelation,
                modelClass : Users,
                join :{
                    from : "notifications.user_id",
                    to : "users.user_id"
                }
            }
        }
    }
}

module.exports = Notifications