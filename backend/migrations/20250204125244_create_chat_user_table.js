/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("chat_user",(table)=>{
        table.increments('chat_user_id').primary()
        table.integer('chat_id').unsigned().references('chat_id').inTable('chats').onUpdate('cascade')
        table.integer('user_id').unsigned().references('user_id').inTable('users').onUpdate('cascade')
        table.timestamps(true,true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('chat_user')
};
