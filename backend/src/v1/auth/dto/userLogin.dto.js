const joi = require("joi");

const userLoginSchema = joi.object({
  credentials: joi
    .alternatives()
    .try(joi.string().email(), joi.string().min(4))
    .required(),
  password: joi.string().required().min(3),
});

const validateUserLogin = (data) => {
  return userLoginSchema.validate(data, { abortEarly: false });
};

module.exports = validateUserLogin();
