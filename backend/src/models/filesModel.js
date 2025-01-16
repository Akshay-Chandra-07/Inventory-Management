const { Model } = require("objection");
const Users = require("./usersModel");

class Files extends Model {
  static get tableName() {
    return "files";
  }

  static get idColumn() {
    return "file_id";
  }

  static get relationMappings() {
    return {
      files: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: "files.user_id",
          to: "users.user_id",
        },
      },
    };
  }
}

module.exports = Files;
