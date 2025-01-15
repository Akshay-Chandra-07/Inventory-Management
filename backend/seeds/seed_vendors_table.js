/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('vendors').del()
  await knex('vendors').insert(
    [
      {
        "vendor_id": 1,
        "vendor_name": "Vendor A",
        "contact_name": "John Doe",
        "address": "123 Vendor St, Suite 101, City ABC",
        "city": "City ABC",
        "postal_code": "12345",
        "country": "Country X",
        "phone": "+1234567890"
      },
      {
        "vendor_id": 2,
        "vendor_name": "Vendor B",
        "contact_name": "Jane Smith",
        "address": "456 Supplier Ave, Block B, City DEF",
        "city": "City DEF",
        "postal_code": "23456",
        "country": "Country Y",
        "phone": "+2345678901"
      },
      {
        "vendor_id": 3,
        "vendor_name": "Vendor C",
        "contact_name": "Alice Johnson",
        "address": "789 Distribution Rd, Warehouse 3, City GHI",
        "city": "City GHI",
        "postal_code": "34567",
        "country": "Country Z",
        "phone": "+3456789012"
      },
      {
        "vendor_id": 4,
        "vendor_name": "Vendor D",
        "contact_name": "Bob Brown",
        "address": "101 Market St, Unit 5, City JKL",
        "city": "City JKL",
        "postal_code": "45678",
        "country": "Country W",
        "phone": "+4567890123"
      },
      {
        "vendor_id": 5,
        "vendor_name": "Vendor E",
        "contact_name": "Eve Davis",
        "address": "202 Sales Blvd, Floor 2, City MNO",
        "city": "City MNO",
        "postal_code": "56789",
        "country": "Country V",
        "phone": "+5678901234"
      }
    ]
    
  );
};
