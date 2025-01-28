const CategoriesQueries = require("../categories/categories.queries");
const ProductQueries = require("./products.queries");
const productsQueries = require("./products.queries");
const productsService = require("./products.service");
const {
  validateProductSchema,
  validateGetPageProductsSchema,
  validateProductUpdateSchema,
  validateProductUrlSchema,
  validateUpdateQuantitySchema,
  validateDeleteProductSchema,
  validateExcelDataSchema,
} = require("./dto/productCreation.dto");

exports.getPageProducts = async (req, res, next) => {
  const { pageNumber, pageCount, searchValue, searchFilters } = req.query;
  const filters = JSON.parse(searchFilters);
  const validated = validateGetPageProductsSchema({
    pageNumber,
    pageCount,
    searchValue,
    searchFilters,
  });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
  try {
    const rawProducts = await productsQueries.getPageProducts(
      pageNumber,
      pageCount,
      searchValue,
      filters,
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
    return res.status(400).json({ msg: "Error fetching files" });
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const data = await ProductQueries.getAllProducts();
    return res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: "error fetching products" });
  }
};

exports.getProductCount = async (req, res, next) => {
  try {
    const count = await productsQueries.getProductCount();

    res.status(200).json(count);
  } catch (error) {
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
  const productValidation = validateProductSchema({
    product_name,
    category_name,
    vendors,
    unit_price,
    quantity_in_stock,
    unit,
  });
  if (productValidation.error) {
    return res.status(400).json({ msg: productValidation.error.message });
  }
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
  const validated = validateProductUpdateSchema({
    productName,
    category,
    quantity,
    vendors,
    unit,
    unitPrice,
    productId,
  });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
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
  const validated = validateProductUrlSchema({ product_image, product_id });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
  try {
    await ProductQueries.insertProductUrlToTable(product_image, product_id);
    res.status(201).json({ msg: "Product Image inserted successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Error uploading image url" });
  }
};

exports.updateQuantityInTable = async (req, res, next) => {
  const { p_id, newQuantity } = req.body;
  const validated = validateUpdateQuantitySchema({ p_id, newQuantity });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
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
  const { product_id } = req.body;
  const validated = validateDeleteProductSchema({ product_id });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
  try {
    await productsQueries.deleteSingleProduct(product_id);
    return res.status(200).json({ msg: "Product deleted" });
  } catch (error) {
    next(error);
  }
};

exports.insertExcelProducts = async (req, res, next) => {
  const { data } = req.body;
  const validated = validateExcelDataSchema({ data });
  if (validated.error) {
    return res.status(400).json({ msg: validated.error.message });
  }
  try {
    await productsQueries.insertAllProducts(data);
    return res.status(201).json({ msg: "Products inserted successfully" });
  } catch (error) {
    next(error);
  }
};
