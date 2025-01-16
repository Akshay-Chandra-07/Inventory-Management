/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary(),
      table.string("first_name").notNullable(),
      table.string("last_name").notNullable(),
      table.string("username").unique().notNullable(),
      table.string("password").notNullable(),
      table.string("email").unique().notNullable(),
      table.text("profile_pic").nullable(),
      table.text("thumbnail").nullable(),
      table.enum("status", ["0", "1", "2", "99"]).defaultTo("0"),
      table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
