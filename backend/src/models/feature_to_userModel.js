const { Model } = require("objection");
const Features = require("./featuresModel");
const Users = require("./usersModel");

class FeatureToUser extends Model {
  static get tableName() {
    return "feature_to_user";
  }
  static get idColumn() {
    return "feature_to_user_id";
  }
  static get jsonSchema() {
    return {
      type: "object",
      required: ["feature_id", "user_id"],
      properties: {
        feature_to_user_id: { type: "integer" },
        feature_id: { type: "integer" },
        user_id: { type: "integer" },
      },
    };
  }
  static get relationMappings() {
    return {
      features: {
        relation: Model.BelongsToOneRelation,
        modelClass: Features,
        join: {
          from: "feature_to_user.feature_id",
          to: "features.feature_id",
        },
      },
      users: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: "feature_to_user.user_id",
          to: "users.user_id",
        },
      },
    };
  }
}

module.exports = FeatureToUser;
