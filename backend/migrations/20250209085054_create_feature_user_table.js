/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("feature_to_user",(table)=>{
    table.increments("feature_to_user_id").primary()
    table.integer("feature_id").unsigned().references("feature_id").inTable("features").onUpdate("cascade").onDelete("cascade")
    table.integer("user_id").unsigned().references("user_id").inTable("users").onUpdate("cascade").onDelete("cascade")
    table.enum("status",["0","1","2","99"]).defaultTo("0")
    table.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("feature_to_user")
};
