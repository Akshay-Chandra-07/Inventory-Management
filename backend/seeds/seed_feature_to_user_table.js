/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('feature_to_user').del()
  await knex('feature_to_user').insert([
    {feature_id: 1, user_id: 6},
    {feature_id: 2, user_id: 6},
    {feature_id: 3, user_id: 6},
    {feature_id: 4, user_id: 6},
    {feature_id: 5, user_id: 6},
    {feature_id: 6, user_id: 6},
    {feature_id: 7, user_id: 6},
    {feature_id: 2, user_id: 7},
    {feature_id: 5, user_id: 7},
    {feature_id: 7, user_id: 7},
    {feature_id: 2, user_id: 8},
    {feature_id: 5, user_id: 8},
    {feature_id: 7, user_id: 8},
  ]);
};
