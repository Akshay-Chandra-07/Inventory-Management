const { Model } = require("objection");
const Files = require("./filesModel");

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
  }

  static get jsonSchema() {
    console.log("schema");
    return {
      type: "object",
      required: [
        "user_id",
        "first_name",
        "last_name",
        "username",
        "password",
        "email",
      ],
      properties: {
        user_id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        username: { type: "string" },
        password: { type: "string" },
        email: { type: "string" },
        profile_url: { type: "text" },
        thumbnail: { type: "text" },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.HasManyRelation,
        modelClass: Files,
        join: {
          from: "user_id",
          to: "files.user_id",
        },
      },
    };
  }
}

module.exports = Users;
