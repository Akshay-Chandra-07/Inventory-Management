/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("categories").del();
  await knex("categories").insert([
    {
      category_name: "Snacks",
      description:
        "Packaged and ready-to-eat snacks like chips, biscuits, and noodles.",
    },
    {
      category_name: "Beverages",
      description: "Drinks like soft drinks, coffee, tea, and juices.",
    },
    {
      category_name: "Dairy",
      description: "Milk, cheese, butter, and other dairy products.",
    },
    {
      category_name: "Sweets",
      description: "Chocolates, candies, and other sweet treats.",
    },
    {
      category_name: "Fruits",
      description: "Fresh fruits like apples, bananas, lemons, and berries.",
    },
    {
      category_name: "Vegetables",
      description:
        "Fresh vegetables including tomatoes, potatoes, onions, and carrots.",
    },
    {
      category_name: "Grains",
      description: "Rice, wheat, oats, and other grain-based products.",
    },
    {
      category_name: "Spices",
      description:
        "Spices and seasonings for cooking including salt, pepper, and others.",
    },
    {
      category_name: "Frozen Foods",
      description: "Frozen meals, snacks, and vegetables.",
    },
    {
      category_name: "Health Foods",
      description: "Healthy and organic foods like oats, quinoa, and nuts.",
    },
  ]);
};
