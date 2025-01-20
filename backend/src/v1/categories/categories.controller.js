const CategoriesQueries = require("./categories.queries");

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await CategoriesQueries.getAllCategories();
    return res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};
