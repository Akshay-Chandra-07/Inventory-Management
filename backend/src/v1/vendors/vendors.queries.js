const Vendors = require("../../models/vendorsModel");
const db = require("../../mysql/db");

class VendorQueries {
  static async getAllVendors() {
    return db("vendors").select("vendor_name");
  }

  static async getAllVendorsWithId(){
    return Vendors.query(db).select("vendor_id","vendor_name")
  }
}

module.exports = VendorQueries;
