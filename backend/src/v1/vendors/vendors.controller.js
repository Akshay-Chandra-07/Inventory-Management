const VendorQueries = require("./vendors.queries");

exports.getAllVendors = async (req, res, next) => {
  try {
    const categories = await VendorQueries.getAllVendors();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
