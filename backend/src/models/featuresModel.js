const { Model } = require("objection");
const FeatureToUser = require("./feature_to_userModel");

class Features extends Model {
  static get tableName() {
    return "features";
  }

  static get idColumn() {
    return "feature_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["feature_name"],
      properties: {
        feature_id: { type: "integer" },
        feature_name: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      feature: {
        relation: Model.HasManyRelation,
        modelClass: FeatureToUser,
        join: {
          from: "features.feature_id",
          to: "feature_to_user.feature_id",
        },
      },
    };
  }
}

module.exports = Features;
