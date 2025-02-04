const jwt = require("jsonwebtoken");
const { encrypt } = require("./crypto");

exports.refreshTokenGenerator = (id,role) => {
  const encryptedId = encrypt({ id,role });
  return jwt.sign({ enc: encryptedId }, process.env.JWT_REFRESHSECRETKEY, {
    expiresIn: process.env.REFRESH_TIME,
  });
};
