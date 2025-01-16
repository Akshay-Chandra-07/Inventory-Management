/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("vendors", (table) => {
    table.increments("vendor_id").primary(),
      table.string("vendor_name").notNullable(),
      table.string("contact_name").notNullable(),
      table.text("address").notNullable(),
      table.string("city").notNullable(),
      table.string("postal_code").notNullable(),
      table.string("country").notNullable(),
      table.string("phone").notNullable(),
      table.enum("status", ["0", "1", "2", "99"]).defaultTo("0"),
      table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("vendors");
};
