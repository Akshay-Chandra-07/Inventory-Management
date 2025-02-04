const joi = require('joi')

const rowSchema = joi.object({
    product_name: joi.string().min(2).max(30).required().messages({
    "string.empty": "Product name is required",
    "string.min": "Product name should be atleast 2 characters",
    "string.max": "Product name must be less than 30 characters",
    }),
    category_name : joi.string().required(),
    vendors : joi.string().required(),
    unit: joi
        .string()
        .max(10)
        .messages({ "string.max": "unit length must be less than 10 characters" }),
    quantity_in_stock : joi.number().required(),
    unit_price : joi.number().required()
})

const validateRowSchema = (data)=>{
    return rowSchema.validate(data,{abortEarly: false})
}

module.exports = validateRowSchema