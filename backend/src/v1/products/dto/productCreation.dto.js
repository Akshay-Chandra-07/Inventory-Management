const joi = require("joi");

const productCreationSchema = joi.object({
  product_name: joi
    .string()
    .min(2)
    .max(30)
    .required()
    .messages({
      "string.empty": "Product name is required",
      "string.min": "Product name should be atleast 2 characters",
      "string.max": "Product name must be less than 30 characters",
    }),
  category_id: joi.number(),
  quantity_in_stock: joi
    .number()
    .required()
    .messages({ "number.base": "quantity in stock is required" }),
  unit_price: joi
    .number()
    .required()
    .messages({ "number.base": "unit price is required" }),
  unit: joi
    .string()
    .max(10)
    .messages({ "string.max": "unit length must be less than 10 characters" }),
  product_image: joi.string(),
  category_name: joi.string(),
  vendor_name: joi.string(),
});

const validateProductSchema = (data) => {
  return productCreationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateProductSchema };
