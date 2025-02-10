/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("features",(table)=>{
    table.increments("feature_id").primary()
    table.string("feature_name").notNullable(),
    table.enum("status",["0","1","2","99"]).defaultTo("0")
    table.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("features")
};
