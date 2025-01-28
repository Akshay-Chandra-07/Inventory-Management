const jwt = require("jsonwebtoken");
const { decrypt } = require("../../utils/crypto");
const AuthQueries = require("../../v1/auth/auth.queries");
const generateAccessToken = require("../../utils/access_token_generator");

function validateAndSend(refresh, req) {
  try {
    const result = jwt.verify(refresh, process.env.JWT_REFRESHSECRETKEY);
    decrypted_obj = JSON.parse(decrypt(result.enc));
    const newToken = generateAccessToken.accessTokenGenerator(decrypted_obj.id);
    req.userId = decrypted_obj.id;
    return newToken;
  } catch (err) {
    return err;
  }
}

function getUserid(token) {
  try {
    const decoded = jwt.decode(token, process.env.JWT_TOKENSECRETKEY);
    const decrypted_obj = JSON.parse(decrypt(decoded.enc));
    return decrypted_obj.id;
  } catch (err) {
    return err;
  }
}

const validateToken = (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  let refresh = req.headers.refresh;
  if (token && token.startsWith("Bearer")) {
    token = token.split(" ")[1];
    jwt.verify(token, process.env.JWT_TOKENSECRETKEY, async (err, decoded) => {
      if (err instanceof jwt.TokenExpiredError) {
        const userid = getUserid(token);
        refresh = await AuthQueries.getRefreshToken(userid);
        const newToken = validateAndSend(refresh, req);
        if (newToken != null) {
          res.setHeader("Authorization", newToken);
          next();
        } else {
          return res
            .status(401)
            .json({ message: "Refresh token is also invalid" });
        }
      } else if (err) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        const decrypted_obj = JSON.parse(decrypt(decoded.enc));
        req.userId = decrypted_obj.id;
        next();
      }
    });
  } else {
    res.json({ message: "Token not found" });
  }
};

module.exports = { validateToken };
