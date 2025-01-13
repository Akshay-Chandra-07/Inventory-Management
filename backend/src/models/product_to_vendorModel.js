const {Model} = require('objection')
const Products = require('./productsModel')

class ProductToVendor extends Model{
    static get tableName(){
        return 'product_to_vendor'
    }

    static get idColumn(){
        return 'product_to_vendor_id'
    }

    static get relationMappings(){
        return {
            products : {
                relation : Model.BelongsToOneRelation,
                modelClass : Products,
                join : {
                    from : "product_to_vendor.product_id",
                    to : "products.product_id"
                }
            }
        }
    }
}

module.exports = ProductToVendor