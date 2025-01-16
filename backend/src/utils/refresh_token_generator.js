const jwt = require("jsonwebtoken");

exports.refreshTokenGenerator = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_REFRESHSECRETKEY, {
    expiresIn: process.env.REFRESH_TIME,
  });
};
