const jwt = require("jsonwebtoken");
const { encrypt } = require("./crypto");

exports.resetTokenGenerator = (id) => {
    const encryptedId = encrypt({id})
    return jwt.sign({enc:encryptedId},process.env.JWT_RESETSECRETKEY,{ expiresIn: process.env.RESET_TIME})
}