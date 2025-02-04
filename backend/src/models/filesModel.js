const { Model } = require("objection");
const Users = require("./usersModel");

class Files extends Model {
  static get tableName() {
    return "files";
  }

  static get idColumn() {
    return "file_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["file_name", "file_size", "file_type", "file_url"],
      properties: {
        file_id: { type: "integer" },
        user_id: { type: "integer" },
        file_name: { type: "string" },
        file_size: { type: "integer" },
        file_type: { type: "string" },
        file_image: { type: "string" },
        error_file: { type: "string" },
        purpose: { type: "string"},
        total_rows : {type : "integer"},
        accepted_rows : {type : "integer"}
      },
    };
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
