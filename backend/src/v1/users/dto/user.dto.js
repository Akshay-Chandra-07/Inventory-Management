const joi = require("joi");

const updateUrlSchema = joi.object({
  profilePictureUrl: joi.string().required(),
  userId: joi.number().required(),
});

const validateUpdateUrlSchema = (data) => {
  return updateUrlSchema.validate(data, { abortEarly: false });
};

const updateFileSchema = joi.object({
  file_name: joi.string().required(),
  file_size: joi.number().required(),
  file_type: joi.string().required(),
  file_url: joi.string().required(),
  user_id: joi.number().required(),
  purpose : joi.string()
});

const validateUpdateFileSchema = (data) => {
  return updateFileSchema.validate(data, { abortEarly: false });
};

module.exports = { validateUpdateFileSchema, validateUpdateUrlSchema };
