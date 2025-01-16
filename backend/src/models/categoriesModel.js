const { Model } = require("objection");
const Products = require("./productsModel");

class Categories extends Model {
  static get tableName() {
    return "categories";
  }

  static get idColumn() {
    return "category_id";
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
