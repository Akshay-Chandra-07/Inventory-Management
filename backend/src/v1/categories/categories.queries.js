const Categories = require("../../models/categoriesModel");
const db = require("../../mysql/db");

class CategoriesQueries {
  static async getCategoryId(category_name) {
    try {
      const category_id = await Categories.query(db)
        .select("category_id")
        .where("category_name", "=", category_name);
      return category_id[0].category_id;
    } catch (error) {
      return error;
    }
  }
  static async getAllCategories() {
    return await Categories.query(db).select("category_name");
  }

  static async getAllCategoriesWithId(){
    return await Categories.query(db).select("category_id","category_name")
  }
}

module.exports = CategoriesQueries;
