const { Model } = require("objection");
const Products = require("./productsModel");

class Categories extends Model {
  static get tableName() {
    return "categories";
  }

  static get idColumn() {
    return "category_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["category_id", "category_name"],
      properties: {
        category_id: { type: "integer" },
        category_name: { type: "string" },
        "description ": { type: "text" },
        file_type: { type: "string" },
        file_image: { type: "text" },
      },
    };
  }

  static get relationMappings() {
    return {
      products: {
        relation: Model.HasManyRelation,
        modelClass: Products,
        join: {
          from: "categories.product_id",
          to: "products.product_id",
        },
      },
    };
  }
}

module.exports = Categories;
