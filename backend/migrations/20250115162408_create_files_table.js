/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("files", (table) => {
    table.increments("file_id").primary(),
      table
        .integer("user_id")
        .unsigned()
        .references("user_id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
    table.string("file_name").notNullable(),
      table.string("file_size").notNullable(),
      table.string("file_type").notNullable(),
      table.text("file_url").notNullable(),
      table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("files");
};
