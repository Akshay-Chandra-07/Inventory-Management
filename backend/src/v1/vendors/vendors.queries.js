const db = require("../../mysql/db");

class VendorQueries {
  static async getAllVendors() {
    return db("vendors").select("vendor_name");
  }
}

module.exports = VendorQueries;
