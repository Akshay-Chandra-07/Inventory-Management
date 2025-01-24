const joi = require("joi");

const productCreationSchema = joi.object({
  product_name: joi.string().min(2).max(30).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be atleast 2 characters",
    "string.max": "Product name must be less than 30 characters",
  }),
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
  vendors: joi.array(),
});

const validateProductSchema = ({
  product_name,
  category_name,
  vendors,
  unit_price,
  quantity_in_stock,
  unit,
}) => {
  return productCreationSchema.validate(
    {
      product_name,
      category_name,
      vendors,
      unit_price,
      quantity_in_stock,
      unit,
    },
    { abortEarly: false },
  );
};

const getPageProductsSchema = joi.object({
  pageNumber: joi
    .number()
    .messages({ "number.base": "page number is required" }),
  pageCount: joi.number().messages({ "number.base": "page count is required" }),
  searchValue: joi.any(),
  searchFilters: joi.any(),
});

const validateGetPageProductsSchema = (data) => {
  return getPageProductsSchema.validate(data, { abortEarly: false });
};

const productUpdateSchema = joi.object({
  productName: joi.string().required(),
  category: joi.string().required(),
  quantity: joi.string().required(),
  vendors: joi.array().required(),
  unit: joi.string().required(),
  unitPrice: joi.number().required(),
  productId: joi.number().required(),
});

const validateProductUpdateSchema = (data) => {
  return productUpdateSchema.validate(data, { abortEarly: false });
};

const productUrlSchema = joi.object({
  product_image: joi.string().required(),
  product_id: joi.number().required(),
});

const validateProductUrlSchema = (data) => {
  return productUrlSchema.validate(data, { abortEarly: false });
};

const updateQuantitySchema = joi.object({
  p_id: joi.number().required(),
  newQuantity: joi.number().required(),
});

const validateUpdateQuantitySchema = (data) => {
  return updateQuantitySchema.validate(data, { abortEarly: false });
};

const deleteProductSchema = joi.object({
  product_id: joi.number().required(),
});

const validateDeleteProductSchema = (data) => {
  return deleteProductSchema.validate(data);
};

const excelDataSchema = joi.object({
  data: joi.array().required(),
});

const validateExcelDataSchema = (data) => {
  return excelDataSchema.validate(data);
};

module.exports = {
  validateProductSchema,
  validateGetPageProductsSchema,
  validateProductUpdateSchema,
  validateProductUrlSchema,
  validateUpdateQuantitySchema,
  validateDeleteProductSchema,
  validateExcelDataSchema,
};
