const jwt = require("jsonwebtoken");

exports.accessTokenGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_TOKENSECRETKEY, {
    expiresIn: process.env.TOKEN_TIME,
  });
};
