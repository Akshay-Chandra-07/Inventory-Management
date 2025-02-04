/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("files",(table)=>{
        table.text('error_file').nullable(),
        table.enum("status",["0","1","2","99"]).defaultTo("0"),
        table.enum("purpose",["0","1"]).defaultTo("0")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("files",(table)=>{
    table.dropColumns('error_file','status','purpose')
  })
};
