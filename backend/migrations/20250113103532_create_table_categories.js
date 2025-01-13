/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('categories',(table)=>{
        table.increments('category_id').primary(),
        table.string('category_name').notNullable(),
        table.text('description').nullable(),
        table.enum('status',["0","1","2","99"]).defaultTo("0"),
        table.timestamps(true,true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('categories')
};
