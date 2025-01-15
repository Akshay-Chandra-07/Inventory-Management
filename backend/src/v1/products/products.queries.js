const db = require('../../mysql/db')
const Products = require('../../models/productsModel')

class ProductQueries{
    static async getAllProducts(){
        
    }

    static async getPageProducts(pageNumber,pageCount){
        try{
            const paginatedTable = await Products.query(db).with(
                "temporary_products", Products.query(db).select(
                    "product_id",
                    "product_name",
                    "category_id",
                    "quantity_in_stock",
                    "unit_price",
                    "unit",
                    "product_image",
                    "created_at",
                    "updated_at"
                ).from("products").where("status","<>","99").offset((pageNumber-1)*pageCount).limit(pageCount)
            ).from("temporary_products as t")
            .join("categories as c","t.category_id","c.category_id")
            .join("product_to_vendor as pv","pv.product_id","t.product_id")
            .join("vendors as v","pv.vendor_id","v.vendor_id")
            .select(
                "t.product_id",
                "t.product_name",
                "t.category_id",
                "c.category_name",
                "v.vendor_id",
                "v.vendor_name",
                "t.quantity_in_stock",
                "t.unit",
                "t.created_at",
                "t.updated_at"
            )
            return paginatedTable
        }catch(error){
            console.log(error)
            return 
        }
    }

    static async getProductCount(){
        try{
            return await Products.query(db).resultSize()
        }catch(error){
            console.log(error)
            return
        }
    }
}

module.exports = ProductQueries