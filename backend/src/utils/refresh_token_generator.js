const jwt = require("jsonwebtoken");
const { encrypt } = require("./crypto");

exports.refreshTokenGenerator = (id) => {
  const encryptedId = encrypt({ id });
  return jwt.sign({ enc: encryptedId }, process.env.JWT_REFRESHSECRETKEY, {
    expiresIn: process.env.REFRESH_TIME,
  });
};
