const { Model } = require("objection");
const Categories = require("./categoriesModel");
const ProductToVendor = require("./product_to_vendorModel");

class Products extends Model {
  static get tableName() {
    return "products";
  }

  static get idColumn() {
    return "product_id";
  }

  static get relationMappings() {
    return {
      categories: {
        relation: Model.BelongsToOneRelation,
        modelClass: Categories,
        join: {
          from: "products.product_id",
          to: "categories.product_id",
        },
      },
      product_to_vendor: {
        relation: Model.HasManyRelation,
        modelClass: ProductToVendor,
        join: {
          from: "products.product_id",
          to: "product_to_vendor.product_id",
        },
      },
    };
  }
}

module.exports = Products;
