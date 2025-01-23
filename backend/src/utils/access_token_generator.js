const jwt = require("jsonwebtoken");
const { encrypt } = require("./crypto");

exports.accessTokenGenerator = (id) => {
  console.log("in access genrator", typeof id);
  const encryptedId = encrypt({ id });
  return jwt.sign({ enc: encryptedId }, process.env.JWT_TOKENSECRETKEY, {
    expiresIn: process.env.TOKEN_TIME,
  });
};
