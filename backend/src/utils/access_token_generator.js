const jwt = require("jsonwebtoken");
const { encrypt } = require("./crypto");

exports.accessTokenGenerator = (id,role) => {
  const encryptedId = encrypt({ id,role });
  return jwt.sign({ enc: encryptedId }, process.env.JWT_TOKENSECRETKEY, {
    expiresIn: process.env.TOKEN_TIME,
  });
};
