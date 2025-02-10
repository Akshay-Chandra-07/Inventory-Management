/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable("products",(table)=>{
        table.integer("added_by").notNullable().defaultTo(1)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.alterTable("products",(table)=>{
        table.dropColumn("added_by")
    })
};
