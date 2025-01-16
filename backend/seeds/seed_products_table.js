/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("products").del();
  await knex("products").insert([
    {
      product_name: "Maggie",
      category_id: "1",
      quantity_in_stock: "200",
      unit_price: "20",
      unit: "grams",
    },
    {
      product_name: "Rice",
      category_id: "1",
      quantity_in_stock: "150",
      unit_price: "30",
      unit: "grams",
    },
    {
      product_name: "Pasta",
      category_id: "1",
      quantity_in_stock: "300",
      unit_price: "50",
      unit: "grams",
    },
    {
      product_name: "Oil",
      category_id: "2",
      quantity_in_stock: "100",
      unit_price: "120",
      unit: "milliliters",
    },
    {
      product_name: "Sugar",
      category_id: "2",
      quantity_in_stock: "250",
      unit_price: "40",
      unit: "grams",
    },
    {
      product_name: "Salt",
      category_id: "2",
      quantity_in_stock: "500",
      unit_price: "10",
      unit: "grams",
    },
    {
      product_name: "Tea",
      category_id: "3",
      quantity_in_stock: "180",
      unit_price: "60",
      unit: "grams",
    },
    {
      product_name: "Coffee",
      category_id: "3",
      quantity_in_stock: "120",
      unit_price: "200",
      unit: "grams",
    },
    {
      product_name: "Biscuits",
      category_id: "4",
      quantity_in_stock: "450",
      unit_price: "25",
      unit: "pieces",
    },
    {
      product_name: "Chocolates",
      category_id: "4",
      quantity_in_stock: "350",
      unit_price: "80",
      unit: "grams",
    },
    {
      product_name: "Milk",
      category_id: "5",
      quantity_in_stock: "500",
      unit_price: "40",
      unit: "milliliters",
    },
    {
      product_name: "Cheese",
      category_id: "5",
      quantity_in_stock: "250",
      unit_price: "150",
      unit: "grams",
    },
    {
      product_name: "Butter",
      category_id: "5",
      quantity_in_stock: "180",
      unit_price: "100",
      unit: "grams",
    },
    {
      product_name: "Lemon",
      category_id: "6",
      quantity_in_stock: "400",
      unit_price: "10",
      unit: "pieces",
    },
    {
      product_name: "Apple",
      category_id: "6",
      quantity_in_stock: "350",
      unit_price: "80",
      unit: "grams",
    },
    {
      product_name: "Banana",
      category_id: "6",
      quantity_in_stock: "500",
      unit_price: "20",
      unit: "pieces",
    },
    {
      product_name: "Tomato",
      category_id: "7",
      quantity_in_stock: "600",
      unit_price: "30",
      unit: "grams",
    },
    {
      product_name: "Potato",
      category_id: "7",
      quantity_in_stock: "500",
      unit_price: "25",
      unit: "grams",
    },
    {
      product_name: "Onion",
      category_id: "7",
      quantity_in_stock: "300",
      unit_price: "40",
      unit: "grams",
    },
    {
      product_name: "Carrot",
      category_id: "7",
      quantity_in_stock: "200",
      unit_price: "50",
      unit: "grams",
    },
  ]);
};
