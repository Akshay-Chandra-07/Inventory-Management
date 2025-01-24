const joi = require("joi");

const userLoginSchema = joi.object({
  user: joi.alternatives().try(joi.string().email(), joi.string().min(4)),
  password: joi
    .string()
    .required()
    .min(3)
    .messages({ "string.empty": "Password is required" }),
});

const validateUserLogin = (data) => {
  return userLoginSchema.validate(data, { abortEarly: false });
};

module.exports = { validateUserLogin };
