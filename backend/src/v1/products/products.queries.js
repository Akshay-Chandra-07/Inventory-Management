const db = require("../../mysql/db");
const Products = require("../../models/productsModel");

class ProductQueries {
  static async getAllProducts() {}

  static async getPageProducts(pageNumber, pageCount) {
    // try {
    //   const paginatedTable = await Products.query(db)
    //     .with(
    //       "temporary_products",
    //       Products.query(db)
    //         .select(
    //           "product_id",
    //           "product_name",
    //           "category_id",
    //           "quantity_in_stock",
    //           "unit_price",
    //           "unit",
    //           "product_image",
    //           "created_at",
    //           "updated_at"
    //         )
    //         .from("products")
    //         .where("status", "<>", "99")
    //         .offset((pageNumber - 1) * pageCount)
    //         .limit(pageCount)
    //     )
    //     .from("temporary_products as t")
    //     .join("categories as c", "t.category_id", "c.category_id")
    //     .join("product_to_vendor as pv", "pv.product_id", "t.product_id")
    //     .join("vendors as v", "pv.vendor_id", "v.vendor_id")
    //     .select(
    //       "t.product_id",
    //       "t.product_name",
    //       "t.category_id",
    //       "c.category_name",
    //       "v.vendor_id",
    //       "v.vendor_name",
    //       "t.quantity_in_stock",
    //       "t.unit",
    //       "t.created_at",
    //       "t.updated_at"
    //     );
    //   return paginatedTable;
    // } catch (error) {
    //   console.log(error);
    //   return;
    // }

    try {
      const paginatedTable = await db
        .with("temporary_products", (qb) => {
          qb.select(
            "product_id",
            "product_name",
            "status",
            "unit_price",
            "quantity_in_stock",
            "product_image",
            "unit",
            "category_id",
          )
            .from("products")
            .where("status", "<>", "99")
            .offset((pageNumber - 1) * pageCount)
            .limit(pageCount);
        })
        .from("temporary_products as p")
        .join("categories as c", "p.category_id", "c.category_id")
        .join("product_to_vendor as pv", "p.product_id", "pv.product_id")
        .join("vendors as v", "pv.vendor_id", "v.vendor_id")
        .select(
          "p.product_id",
          "p.product_name",
          "p.status",
          "p.unit_price",
          "p.quantity_in_stock",
          "p.unit",
          "p.product_image",
          "c.category_name",
          "v.vendor_id",
          "v.vendor_name",
        );
      return paginatedTable;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getProductCount() {
    try {
      return await db("products").count().where("status", "<>", "99");
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getProductId(productName, user_id) {
    try {
      return await db("products")
        .select("product_id")
        .where("product_name", "=", productName);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async insertProductDataToDb(
    productName,
    category_id,
    unit_price,
    quantity,
    unit,
    vendor_id,
  ) {
    const trx = await db.transaction();
    try {
      const product_id = await trx("products").insert({
        product_name: productName,
        category_id: category_id,
        quantity_in_stock: quantity,
        unit: unit,
        unit_price: unit_price,
      });
      await trx("product_to_vendor").insert({ vendor_id, product_id });

      await trx.commit();
      return product_id;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      return error;
    }
  }

  static async insertProductUrlToTable(product_image, product_id) {
    try {
      return await db("products")
        .update({ product_image: product_image })
        .where("product_id", "=", product_id);
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getVendorId(vendor_name) {
    try {
      const vendor_id = await db("vendors")
        .select("vendor_id")
        .where("vendor_name", "=", vendor_name);
      return vendor_id[0].vendor_id;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

module.exports = ProductQueries;
