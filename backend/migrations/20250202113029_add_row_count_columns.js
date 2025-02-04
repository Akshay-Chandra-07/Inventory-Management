const { table } = require("../src/mysql/db");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("files",(table)=>{
        table.integer('total_rows').nullable()
        table.integer('accepted_rows').nullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("files",(table)=>{
    table.dropColumns('total_rows','accepted_rows')
  })
};
