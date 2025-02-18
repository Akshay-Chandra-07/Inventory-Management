const db = require("../../mysql/db");
const Products = require("../../models/productsModel");
const ProductToVendor = require("../../models/product_to_vendorModel");
const Vendors = require("../../models/vendorsModel");

class ProductQueries {
  static async getAllProducts() {
    try {
      return await Products.query(db).select(
        "product_id",
        "product_name",
        "status",
        "unit_price",
        "quantity_in_stock",
        "unit",
        "category_id",
      );
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  
  static async bulkInsert(products){
    const trx =await db.transaction()
      try{
        const insertedProducts = await trx.batchInsert('products', products.map(row => {
          return {
            product_name: row.product_name,
            category_id: row.category_id,
            quantity_in_stock: row.quantity_in_stock,
            unit: row.unit,
            unit_price: row.unit_price
          };
        }), 1000);
        const firstId = insertedProducts[0]
        const allInsertedProducts = await Products.query().select("product_id").where('product_id', '>=', firstId).limit(products.length);
        let productToVendor = []
        allInsertedProducts.forEach((product, i) => {
          const vendors = products[i].vendors; 
          vendors.forEach((vendor_id) => {
            productToVendor.push({
              product_id: product.product_id, 
              vendor_id: vendor_id
            });
          });
        });
        if (productToVendor.length > 0) {
          await trx.batchInsert('product_to_vendor', productToVendor, 1000);
        }
        await trx.commit()
        return true
      }catch(error){
        console.log(error)
        await trx.rollback()
        return false
      }
}
  

  static async getPageProducts(
    pageNumber,
    pageCount,
    searchValue,
    searchFilters,
    location
  ) {
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
          "u.location",
          "c.category_name",
          db.raw("JSON_ARRAYAGG(v.vendor_name) as vendors")
        )
        .from("products as p")
        .join("categories as c", "p.category_id", "c.category_id")
        .join("product_to_vendor as pv", "p.product_id", "pv.product_id")
        .join("vendors as v", "pv.vendor_id", "v.vendor_id")
        .join("users as u","p.added_by","u.user_id")
        .where("p.status", "<>", "99")
        .andWhere("u.location","=",location)
        .groupBy("p.product_id")
        .orderBy("p.product_id")
      // if (searchValue) {
      //   query.where(function () {
      //     this.where("p.product_name", "like", `%${searchValue}%`)
      //       .orWhere("c.category_name", "like", `%${searchValue}%`)
      //       .orWhere("v.vendor_name", "like", `%${searchValue}%`);
      //   });
      //   if (searchFilters && searchFilters.length === 1) {
      //     if (searchFilters.includes("ProductName")) {
      //       query.where("p.product_name", "like", `%${searchValue}%`);
      //     }
      //     if (searchFilters.includes("Category")) {
      //       query.where("c.category_name", "like", `%${searchValue}%`);
      //     }
      //     if (searchFilters.includes("Vendor")) {
      //       query.where("v.vendor_name", "like", `%${searchValue}%`);
      //     }
      //   } else if (searchFilters && searchFilters.length === 2) {
      //     if (
      //       searchFilters.includes("ProductName") &&
      //       searchFilters.includes("Category")
      //     ) {
      //       query
      //         .where("p.product_name", "like", `%${searchValue}%`)
      //         .orWhere("c.category_name", "like", `%${searchValue}%`);
      //     } else if (
      //       searchFilters.includes("ProductName") &&
      //       searchFilters.includes("Vendor")
      //     ) {
      //       query
      //         .where("p.product_name", "like", `%${searchValue}%`)
      //         .orWhere("v.vendor_name", "like", `%${searchValue}%`);
      //     } else if (
      //       searchFilters.includes("Category") &&
      //       searchFilters.includes("Vendor")
      //     ) {
      //       query
      //         .where("c.category_name", "like", `%${searchValue}%`)
      //         .orWhere("v.vendor_name", "like", `%${searchValue}%`);
      //     }
      //   }
      // }

      if (searchValue) {
        query.andWhere(function () {
          if (!searchFilters || searchFilters.length === 0) {
            this.where("p.product_name", "like", `%${searchValue}%`)
              .orWhere("c.category_name", "like", `%${searchValue}%`)
              .orWhere("v.vendor_name", "like", `%${searchValue}%`);
          } else {
            searchFilters.forEach((filter) => {
              if (filter === "ProductName") {
                this.orWhere("p.product_name", "like", `%${searchValue}%`);
              }
              if (filter === "Category") {
                this.orWhere("c.category_name", "like", `%${searchValue}%`);
              }
              if (filter === "Vendor") {
                this.orWhere("v.vendor_name", "like", `%${searchValue}%`);
              }
            });
          }
        });
      }
      query.offset((pageNumber - 1) * pageCount)
            .limit(pageCount)
      return query;
    } catch (error) {
      return error;
    }
  }

  static async getProductCount() {
    try {
      return await Products.query(db).count().where("status", "<>", "99");
    } catch (error) {
      return error;
    }
  }

  static async getProductId(productName, user_id) {
    try {
      return await Products.query(db)
        .select("product_id")
        .where("product_name", "=", productName);
    } catch (error) {
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
    user_id
  ) {
    const trx = await db.transaction();
    try {
      const product_id = await Products.query(trx).insert({
        product_name: productName,
        category_id: category_id,
        quantity_in_stock: parseInt(quantity),
        unit: unit,
        unit_price: parseInt(unit_price),
        added_by:user_id
      });
      for (let i = 0; i < vendor_id.length; i++) {
        try {
          await ProductToVendor.query(trx).insert({
            vendor_id: vendor_id[i],
            product_id: product_id.product_id,
          });
        } catch (error) {
          await trx.rollback();
        }
      }

      await trx.commit();
      return [product_id.product_id];
    } catch (error) {
      await trx.rollback();
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
      return error;
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
      return error;
    }
  }

  static async addProductData(curRow,category_id,validVendors){
    const trx = await db.transaction()
    try{
      const product_id = await Products.query(trx).insert({
        product_name: curRow['product_name'],
        category_id: category_id,
        quantity_in_stock: curRow['quantity_in_stock'],
        unit_price: curRow['unit_price'],
        unit: curRow['unit'],
      });
      for(let i=0;i<validVendors.length;i++){
        await ProductToVendor.query(trx).insert({
          product_id: product_id.product_id,
          vendor_id: validVendors[i],
        })
      }
      trx.commit()
      return;
    }catch(error){
      console.log(error)
      await trx.rollback()
      return error;
    }
  }
}

module.exports = ProductQueries;
