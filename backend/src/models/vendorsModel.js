const { Model } = require("objection");

class Vendors extends Model {
  static get tableName() {
    return "vendors";
  }

  static get idColumn() {
    return "vendor_id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "vendor_id",
        "vendor_name",
        "contact_name",
        "address",
        "city",
        "postal_code",
        "country",
        "phone",
      ],
      properties: {
        vendor_id: { type: "integer" },
        vendor_name: { type: "string" },
        contact_name: { type: "string" },
        address: { type: "text" },
        city: { type: "string" },
        postal_code: { type: "string" },
        country: { type: "text" },
        phone: { type: "text" },
      },
    };
  }
}

module.exports = Vendors;
