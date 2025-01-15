const productsQueries = require('./products.queries')
const productsService = require('./products.service')

exports.getPageProducts = async (req,res,next)=>{
    const {pageNumber,pageCount} = req.query
    try{
        const rawProducts = await productsQueries.getPageProducts(pageNumber,pageCount)
        const cleanedProducts = await productsService.cleanProducts(rawProducts)
        return res.status(200).json({msg:"All products fetched",cleanedProducts})
    }catch(error){
        console.log(error)
        return res.status(400).json({msg:"Error fetching files"})
    }
}

exports.getProductCount = async (req,res,next)=>{
    try{
        const count = await productsQueries.getProductCount()
        console.log(count);
        
        res.status(200).json(count)
    }catch(error){
        console.log(error)
        res.status(400).json({msg:"Error fetching count"})
    }
}