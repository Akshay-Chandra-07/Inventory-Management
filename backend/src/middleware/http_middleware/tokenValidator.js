const jwt = require("jsonwebtoken");
const generateAccessToken = require("../../utils/access_token_generator");

exports.validateToken = (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  const refresh = req.headers.refresh;
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKENSECRETKEY, (err, decoded) => {
      if (err instanceof jwt.TokenExpiredError) {
        const newToken = validateAndSend(refresh, req);
        if (newToken != null) {
          console.log("Token Generated");
          res.set("Authorization", newToken);
          next();
        } else {
          console.log("Invalid refresh");
          return res.json({
            message: "Refresh token is also invalid",
            bool: false,
          });
        }
      } else if (err) {
        return res.json({ message: "Invalid token", bool: false });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    res.json({ message: "Token not found", bool: false });
  }
};

function validateAndSend(refresh, req) {
  try {
    result = jwt.verify(refresh, process.env.JWT_REFRESHSECRETKEY);
    const newToken = generateAccessToken.accessTokenGenerator(result.id);
    req.userId = result.id;
    return newToken;
  } catch (err) {
    return null;
  }
}
