const { Model } = require("objection");

class Vendors extends Model {
  static get tableName() {
    return "vendors";
  }

  static get idColumn() {
    return "vendor_id";
  }
}

module.exports = Vendors;
