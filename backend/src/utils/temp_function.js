const Products = require("../models/productsModel")
const db = require("../mysql/db")
const {faker} = require('@faker-js/faker')

exports.insertProductToVendor = async()=>{
    const trx = await db.transaction()
    const productIds = await Products.query(db).select("product_id").where("product_id",">",229895)
    let vendors = []
    for(let i=0;i<productIds.length;i++){
        vendors.push(faker.helpers.arrayElements([1,2,3,4,5]))
    }
    let productToVendor = []
    for(let i=0;i<productIds.length;i++){
        for(let j=0;j<vendors[i].length;j++){
            productToVendor.push({
                product_id: productIds[i].product_id, 
                vendor_id: vendors[i][j]
            });
        }
    }
    try{
        await trx.batchInsert('product_to_vendor', productToVendor, 1000);
        await trx.commit()
    }catch(error){
        console.log(error)
        (await trx).rollback()
    }
}