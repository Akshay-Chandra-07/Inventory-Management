/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('messages',(table)=>{
    table.increments('message_id').primary()
    table.integer('chat_id').unsigned().references('chat_id').inTable('chats').onUpdate('cascade')
    table.integer('user_id').unsigned().references('user_id').inTable('users').onUpdate('cascade')
    table.text('message').notNullable()
    table.enum('status',['0','1','2','99']).defaultTo('0')
    table.timestamps(true,true)
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('messages')
};
