/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("product_to_vendor").del();
  await knex("product_to_vendor").insert([
    { vendor_id: 1, product_id: 1 },
    { vendor_id: 2, product_id: 1 },
    { vendor_id: 3, product_id: 2 },
    { vendor_id: 4, product_id: 2 },
    { vendor_id: 5, product_id: 3 },
    { vendor_id: 1, product_id: 3 },
    { vendor_id: 2, product_id: 4 },
    { vendor_id: 3, product_id: 4 },
    { vendor_id: 4, product_id: 5 },
    { vendor_id: 5, product_id: 5 },
    { vendor_id: 1, product_id: 6 },
    { vendor_id: 2, product_id: 6 },
    { vendor_id: 3, product_id: 7 },
    { vendor_id: 4, product_id: 7 },
    { vendor_id: 5, product_id: 8 },
    { vendor_id: 1, product_id: 8 },
    { vendor_id: 2, product_id: 9 },
    { vendor_id: 3, product_id: 9 },
    { vendor_id: 4, product_id: 10 },
    { vendor_id: 5, product_id: 10 },
    { vendor_id: 1, product_id: 11 },
    { vendor_id: 2, product_id: 11 },
    { vendor_id: 3, product_id: 12 },
    { vendor_id: 4, product_id: 12 },
    { vendor_id: 5, product_id: 13 },
    { vendor_id: 1, product_id: 13 },
    { vendor_id: 2, product_id: 14 },
    { vendor_id: 3, product_id: 14 },
    { vendor_id: 4, product_id: 15 },
    { vendor_id: 5, product_id: 15 },
    { vendor_id: 1, product_id: 16 },
    { vendor_id: 2, product_id: 16 },
    { vendor_id: 3, product_id: 17 },
    { vendor_id: 4, product_id: 17 },
    { vendor_id: 5, product_id: 18 },
    { vendor_id: 1, product_id: 18 },
    { vendor_id: 2, product_id: 19 },
    { vendor_id: 3, product_id: 19 },
    { vendor_id: 4, product_id: 20 },
    { vendor_id: 5, product_id: 20 },
  ]);
};
