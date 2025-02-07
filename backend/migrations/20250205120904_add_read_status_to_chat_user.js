/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("chat_user",(table)=>{
        table.enum('is_read',["0","1"]).defaultTo("1")
      })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("chat_user",(table)=>{
        table.dropColumn('is_read')
      })
};
