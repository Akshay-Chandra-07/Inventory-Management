const joi = require('joi')

const forgotPasswordSchema = joi.object({
    email : joi.string().required().email().messages({
        "string.empty" : "email is required",
        "string.format" : "Invalid email format"
    })
})

const validateForgotPasswordSchema = (data)=>{
    return forgotPasswordSchema.validate(data)
}

module.exports = {validateForgotPasswordSchema}