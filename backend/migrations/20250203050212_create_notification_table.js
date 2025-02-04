/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("notifications",(table)=>{
    table.increments('notification_id').primary()
    table.integer('user_id').unsigned().references('user_id').inTable('users').onUpdate('cascade').onDelete('cascade')
    table.string('message').notNullable()
    table.enum('status',['0','1','2','99']).defaultTo('0')
    table.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('notifications')
};
