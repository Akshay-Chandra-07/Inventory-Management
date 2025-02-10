const { Model } = require("objection");
const Files = require("./filesModel");
const Notifications = require("./notificationModel");
const Messages = require("./messagesModel");
const ChatUser = require("./chat_userModel");
const FeatureToUser = require("./feature_to_userModel");

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["first_name", "last_name", "username", "password", "email"],
      properties: {
        user_id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        profile_url: { type: "string" },
        thumbnail: { type: "string" },
        role: { type: "string" },
        location: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: Files,
        join: {
          from: "users.user_id",
          to: "files.user_id",
        },
      },
      notification: {
        relation: Model.HasManyRelation,
        modelClass: Notifications,
        join: {
          from: "users.user_id",
          to: "notifications.user_id",
        },
      },
      messages: {
        relation: Model.HasManyRelation,
        modelClass: Messages,
        join: {
          from: "users.user_id",
          to: "messages.user_id",
        },
      },
      chats: {
        relation: Model.HasManyRelation,
        modelClass: ChatUser,
        join: {
          from: "users.user_id",
          to: "chat_user.user_id",
        },
      },
      features: {
        relation: Model.HasManyRelation,
        modelClass: FeatureToUser,
        join: {
          from: "users.user_id",
          to: "feature_to_user.user_id",
        },
      },
    };
  }
}

module.exports = Users;
