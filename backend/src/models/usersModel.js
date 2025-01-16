const { Model } = require("objection");
const Files = require("./filesModel");

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get idColumn() {
    return "user_id";
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
