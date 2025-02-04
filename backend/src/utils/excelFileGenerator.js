const xlsx = require("xlsx");
const { faker } = require("@faker-js/faker");
 
const vendors = ["Vendor A", "Vendor B", "Vendor C", "Vendor D","Vendor F"];
const categories = [
  "Fruits",
  "Vegetables",
  "Dairy",
  "Sweets",
  "Beverages",
  "Snacks",
  "Grains",
  "Spices",
  "Frozen Foods",
  "Health Foods",
  "Fast Foods"
];
const unit = ["kg", "grams", "liters", "ml", "pack", "unit"];
 
function generateProducts(count) {
  const products = [];
  for (let i = 0; i < count; i++) {
    const product = {
      product_name: faker.commerce.productName(),
      unit_price: faker.number.int({ min: 10, max: 1000 }),
      quantity_in_stock: faker.number.int({ min: 1, max: 100 }),
      unit: faker.helpers.arrayElement(unit),
      category_name: faker.helpers.arrayElement(categories),
      vendors: faker.helpers
        .arrayElements(vendors, faker.number.int({ min: 1, max: 4 }))
        .join(", "),
    };
    products.push(product);
  }
  return products;
}
 
const products = generateProducts(5000);
 
const worksheet = xlsx.utils.json_to_sheet(products);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Products");
 
xlsx.writeFile(workbook, "products_with_errors.xlsx");
 
console.log("Excel file 'products.xlsx' generated successfully!");