/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable("chats",(table)=>{
        table.increments('chat_id').primary(),
        table.string('chat_name').nullable(),
        table.enum('purpose',['0','1']).defaultTo('0')
        table.enum('status',['0','1','2','99']).defaultTo('0'),
        table.timestamps(true,true)
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable("chats")
};
