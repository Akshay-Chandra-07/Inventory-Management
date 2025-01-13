/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products',(table)=>{
      table.increments('product_id').primary()
      table.string('product_name').notNullable()
      table.integer('category_id').unsigned().references('category_id').inTable('categories').onUpdate('cascade').onDelete('cascade')
      table.integer('quantity_in_stock').notNullable()
      table.integer('unit_price').notNullable()
      table.string('unit').nullable()
      table.text('product_image').nullable()
      table.enum('status',["0","1","2","99"]).defaultTo("0")
      table.timestamps(true,true)
    })
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('products')
  };
  