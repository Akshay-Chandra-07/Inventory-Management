const joi = require("joi");

const userCreationSchema = joi.object({
  first_name: joi.string().required().min(3).max(20).messages({
    "string.first_name": "First name must be a string",
    "string.min": "Firstname must be atleast 3 characters",
    "string.max": "Firstname must be maximum of 20 characters",
    "string.empty": "Firstname is required",
  }),
  last_name: joi.string().required().min(3).max(20).messages({
    "string.last_name": "First name must be a string",
    "string.min": "Lastname must be atleast 3 characters",
    "string.max": "Lastname must be maximum of 20 characters",
    "string.empty": "Lastname is required",
  }),
  email: joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: joi.string().min(3).required().messages({
    "string.empty": "Password is requried",
    "string.min": "Password must be 3 characters",
  }),
  role: joi.string().required().messages({
    "string.empty": "Please select role"
  }),
  location: joi.string().required().messages({
    "string.empty": "Please select role"
  })
});

const validateUserCreation = (data) => {
  return userCreationSchema.validate(data, { abortEarly: false });
};

module.exports = { validateUserCreation };
