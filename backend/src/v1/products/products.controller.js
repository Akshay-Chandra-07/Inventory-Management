const CategoriesQueries = require("../categories/categories.queries");
const ProductQueries = require("./products.queries");
const productsQueries = require("./products.queries");
const productsService = require("./products.service");
const { validateProductSchema } = require("./dto/productCreation.dto");

exports.getPageProducts = async (req, res, next) => {
  const { pageNumber, pageCount, searchValue, searchFilters } = req.query;
  try {
    const rawProducts = await productsQueries.getPageProducts(
      pageNumber,
      pageCount,
      searchValue,
      searchFilters,
    );
    const cleanedProducts = await productsService.cleanProducts(
      pageNumber,
      pageCount,
      rawProducts,
    );
    return res
      .status(200)
      .json({ msg: "All products fetched", cleanedProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error fetching files" });
  }
};

exports.getProductCount = async (req, res, next) => {
  try {
    const count = await productsQueries.getProductCount();

    res.status(200).json(count);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Error fetching count" });
  }
};

exports.insertProductData = async (req, res, next) => {
  const { productName, quantity, unit, vendors, unitPrice, category } =
    req.body;
  let category_id = "";
  let vendor_id = [];
  const product_name = productName;
  const unit_price = unitPrice;
  const quantity_in_stock = quantity;
  const category_name = category;
  // const productValidation = validateProductSchema({product_name,category_name,vendor_name,unit_price,quantity_in_stock,unit})
  // if(productValidation.error){
  //   console.log(productValidation.error.message)
  //   return res.status(400).json({msg:productValidation.error.message})
  // }
  try {
    category_id = await CategoriesQueries.getCategoryId(category);
  } catch (error) {
    return res.status(400).json({ msg: "Category not found" });
  }
  try {
    for (let i = 0; i < vendors.length; i++) {
      vendor_id.push(await ProductQueries.getVendorId(vendors[i]));
    }
  } catch (error) {
    return res.status(400).json({ msg: "Vendor not found" });
  }
  try {
    const product_name = productName;
    const unit_price = unitPrice;
    const quantity_in_stock = quantity;
    const productValidation = validateProductSchema({
      product_name,
      category_id,
      unit_price,
      quantity_in_stock,
      unit,
    });
    if (productValidation.error) {
      console.log(productValidation.error.message);
      return res.status(400).json({ msg: productValidation.error.message });
    }
    const productId = await productsQueries.insertProductDataToDb(
      productName,
      category_id,
      unitPrice,
      quantity,
      unit,
      vendor_id,
    );
    return res.status(201).json({ msg: "Product created", productId });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Error creating product" });
  }
};

exports.updateProductData = async (req, res, next) => {
  const {
    productName,
    category,
    quantity,
    vendors,
    unit,
    unitPrice,
    productId,
  } = req.body;
  let vendor_id = [];
  let category_id = "";
  try {
    category_id = await CategoriesQueries.getCategoryId(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Category not found" });
  }
  try {
    for (let i = 0; i < vendors.length; i++) {
      vendor_id.push(await ProductQueries.getVendorId(vendors[i]));
    }
  } catch (error) {
    return res.status(400).json({ msg: "Vendor not found" });
  }
  try {
    await productsQueries.updateProductData(
      productName,
      category_id,
      unitPrice,
      quantity,
      unit,
      vendor_id,
      productId,
    );
    return res.status(200).json({ msg: "Product updated" });
  } catch (error) {
    return res.status(400).json({ msg: "Error updating product" });
  }
};
exports.insertProductUrlToTable = async (req, res, next) => {
  const product_image = process.env.s3_URL + req.body.url;
  const product_id = req.body.product_id[0];
  try {
    await ProductQueries.insertProductUrlToTable(product_image, product_id);
    res.status(201).json({ msg: "Product Image inserted successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Error uploading image url" });
  }
};

exports.updateQuantityInTable = async (req, res, next) => {
  const { p_id, newQuantity } = req.body;
  try {
    const productQuantity = await ProductQueries.updateProductQuantity(
      p_id,
      newQuantity,
    );
    res.status(200).json(productQuantity);
  } catch (error) {
    next(error);
  }
};

exports.deleteSingleProduct = async (req, res, next) => {
  console.log("coming");
  const { product_id } = req.body;
  console.log(product_id);
  try {
    await productsQueries.deleteSingleProduct(product_id);
    return res.status(200).json({ msg: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

exports.insertExcelProducts = async (req, res, next) => {
  const { data } = req.body;
  console.log(data);
  try {
    await productsQueries.insertAllProducts(data);
    return res.status(201).json({ msg: "Products inserted successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// exports.getSingleProduct = async (req,res,next)=>{
//   const {productId} = req.params
//   try{
//     const productQuantity = await ProductQueries.getSingleProduct(productId)
//     console.log(productQuantity)
//     res.status(200).json(productQuantity)
//   }catch(error){
//     next(error)
//   }
// }
