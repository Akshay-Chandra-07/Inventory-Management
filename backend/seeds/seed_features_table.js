/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('features').del()
  await knex('features').insert([
    { feature_name: 'file_upload'},
    { feature_name: 'file_download'},
    { feature_name: 'import_products'},
    { feature_name: 'add_product'},
    { feature_name: 'edit_product'},
    { feature_name: 'delete_product'},
    { feature_name: 'download_product'}
  ]);
};
