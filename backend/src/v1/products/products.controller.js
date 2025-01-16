const CategoriesQueries = require("../categories/categories.queries");
const ProductQueries = require("./products.queries");
const productsQueries = require("./products.queries");
const productsService = require("./products.service");

exports.getPageProducts = async (req, res, next) => {
  const { pageNumber, pageCount } = req.query;
  try {
    const rawProducts = await productsQueries.getPageProducts(
      pageNumber,
      pageCount,
    );
    const cleanedProducts = await productsService.cleanProducts(rawProducts);
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
  const { productName, quantity, unit, vendor, unitPrice, category } = req.body;
  try {
    const category_id = await CategoriesQueries.getCategoryId(category);
    console.log(category_id);
    try {
      console.log(vendor);
      const vendor_id = await ProductQueries.getVendorId(vendor);
      console.log(vendor_id);
      try {
        const productId = await productsQueries.insertProductDataToDb(
          productName,
          category_id,
          unitPrice,
          quantity,
          unit,
          vendor_id,
        );
        res.status(201).json({ msg: "Product created", productId });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "Error creating product" });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ msg: "Vendor not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "Category not found" });
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
