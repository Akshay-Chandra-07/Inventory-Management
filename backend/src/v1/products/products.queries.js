const db = require("../../mysql/db");
const Products = require("../../models/productsModel");
const ProductToVendor = require("../../models/product_to_vendorModel");
const Vendors = require("../../models/vendorsModel");

class ProductQueries {
  static async getAllProducts() {}

  static async getPageProducts(
    pageNumber,
    pageCount,
    searchValue,
    searchFilters,
  ) {
    // try {
    //   const paginatedTable = await db
    //     .with("temporary_products", (qb) => {
    //       qb.select(
    //         "product_id",
    //         "product_name",
    //         "status",
    //         "unit_price",
    //         "quantity_in_stock",
    //         "product_image",
    //         "unit",
    //         "category_id",
    //       )
    //         .from("products")
    //         .where("status", "<>", "99")
    //         .offset((pageNumber - 1) * pageCount)
    //         .limit(pageCount);
    //     })
    //     .from("temporary_products as p")
    //     .join("categories as c", "p.category_id", "c.category_id")
    //     .join("product_to_vendor as pv", "p.product_id", "pv.product_id")
    //     .join("vendors as v", "pv.vendor_id", "v.vendor_id")
    //     .select(
    //       "p.product_id",
    //       "p.product_name",
    //       "p.status",
    //       "p.unit_price",
    //       "p.quantity_in_stock",
    //       "p.unit",
    //       "p.product_image",
    //       "c.category_id",
    //       "c.category_name",
    //       "v.vendor_id",
    //       "v.vendor_name",
    //     );
    //   return paginatedTable;

    try {
      let query = db
        .select(
          "p.product_id",
          "p.product_name",
          "p.status",
          "p.unit_price",
          "p.quantity_in_stock",
          "p.unit",
          "p.product_image",
          "c.category_name",
          "v.vendor_name",
        )
        .from("products as p")
        .join("categories as c", "p.category_id", "c.category_id")
        .join("product_to_vendor as pv", "p.product_id", "pv.product_id")
        .join("vendors as v", "pv.vendor_id", "v.vendor_id")
        .where("p.status", "<>", "99")
        .orderBy("p.product_id");
      // .offset((pageNumber - 1) * pageCount)
      // .limit(pageCount);

      if (searchValue) {
        query.where(function () {
          this.where("p.product_name", "like", `%${searchValue}%`)
            .orWhere("c.category_name", "like", `%${searchValue}%`)
            .orWhere("v.vendor_name", "like", `%${searchValue}%`);
        });
      }

      if (searchFilters) {
        if (searchFilters.productName) {
          query.where("p.product_name", "like", `%${searchValue}%`);
        }
        if (searchFilters.category) {
          query.where("c.category_name", "like", `%${searchValue}%`);
        }
        if (searchFilters.vendor) {
          query.where("v.vendor_name", "like", `%${searchValue}%`);
        }
      }
      return query;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getProductCount() {
    try {
      return await Products.query(db).count().where("status", "<>", "99");
    } catch (error) {
      console.log(error);
      return;
    }
  }

  static async getProductId(productName, user_id) {
    try {
      return await Products.query(db)
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
    console.log(
      productName,
      category_id,
      unit_price,
      quantity,
      unit,
      vendor_id,
    );
    const trx = await db.transaction();
    try {
      const product_id = await Products.query(trx).insert({
        product_name: productName,
        category_id: category_id,
        quantity_in_stock: parseInt(quantity),
        unit: unit,
        unit_price: parseInt(unit_price),
      });
      console.log(product_id.product_id);
      for (let i = 0; i < vendor_id.length; i++) {
        try {
          await ProductToVendor.query(trx).insert({
            vendor_id: vendor_id[i],
            product_id: product_id.product_id,
          });
        } catch (error) {
          console.log(error);
          await trx.rollback();
        }
      }

      await trx.commit();
      return [product_id.product_id];
    } catch (error) {
      await trx.rollback();
      console.log(error);
      return error;
    }
  }

  static async updateProductData(
    productName,
    category_id,
    unit_price,
    quantity,
    unit,
    vendor_id,
    productId,
  ) {
    const trx = await db.transaction();
    try {
      await Products.query(trx)
        .update({
          product_name: productName,
          category_id: category_id,
          quantity_in_stock: parseInt(quantity),
          unit: unit,
          unit_price: parseInt(unit_price),
        })
        .where("product_id", "=", productId);
      const inDbVendors = await ProductToVendor.query(trx)
        .select("product_to_vendor_id", "vendor_id")
        .where("product_id", "=", productId);
      for (let i = 0; i < vendor_id.length; i++) {
        const existing = await ProductToVendor.query(trx)
          .select("product_to_vendor_id")
          .where("vendor_id", "=", vendor_id[i])
          .andWhere("product_id", "=", productId);
        if (existing.length == 0) {
          try {
            await ProductToVendor.query(trx).insert({
              vendor_id: vendor_id[i],
              product_id: productId,
            });
          } catch (error) {
            console.log(error);
            await trx.rollback();
          }
        }
      }
      for (const dbVendor of inDbVendors) {
        let bool = false;
        for (const vendor of vendor_id) {
          if (dbVendor.vendor_id === vendor) {
            bool = true;
            break;
          }
        }

        if (!bool) {
          await ProductToVendor.query(trx)
            .delete()
            .where("product_to_vendor_id", "=", dbVendor.product_to_vendor_id);
        }
      }
      await trx.commit();
      return;
    } catch (error) {
      await trx.rollback();
      console.log(error);
      return error;
    }
  }

  static async insertProductUrlToTable(product_image, product_id) {
    console.log(product_image, product_id);
    try {
      return await Products.query(db)
        .patch({ product_image: product_image })
        .where("product_id", "=", product_id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async getVendorId(vendor_name) {
    try {
      const vendor_id = await Vendors.query(db)
        .select("vendor_id")
        .where("vendor_name", "=", vendor_name);
      return vendor_id[0].vendor_id;
    } catch (error) {
      next(new Error(error));
    }
  }

  static async updateProductQuantity(product_id, newQuantity) {
    try {
      await Products.query(db)
        .patch({ quantity_in_stock: newQuantity })
        .where("product_id", "=", product_id);
      return await db("products")
        .select("quantity_in_stock")
        .where("product_id", "=", product_id);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  static async deleteSingleProduct(product_id) {
    return await Products.query(db)
      .patch({ status: "99" })
      .where("product_id", "=", product_id);
  }

  static async insertAllProducts(data) {
    const trx = await db.transaction();
    try {
      for (let product of data) {
        const product_id = await Products.query(trx).insert({
          product_name: product.productName,
          category_id: product.categoryId,
          quantity_in_stock: product.quantityInStock,
          unit_price: product.unitPrice,
          unit: product.measure,
        });
        await ProductToVendor.query(trx).insert({
          product_id: product_id.product_id,
          vendor_id: product.vendorId,
        });
      }
      trx.commit();
      return;
    } catch (error) {
      await trx.rollback();
      console.log(error);
    }
  }
}

module.exports = ProductQueries;
