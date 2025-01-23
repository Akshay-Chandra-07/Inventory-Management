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
    console.log(err);
    return null;
  }
}

function getUserid(token) {
  try {
    console.log(token);
    const decoded = jwt.decode(token, process.env.JWT_TOKENSECRETKEY);
    console.log(decoded);
    const decrypted_obj = JSON.parse(decrypt(decoded.enc));
    console.log("in get userid", decrypted_obj.id);
    return decrypted_obj.id;
  } catch (err) {
    console.log(err);
    return null;
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
        const newToken = validateAndSend(refresh[0].refresh_token, req);
        if (newToken != null) {
          console.log("new token generated");
          res.setHeader("Authorization", newToken);
          // res.setHeader('Cache-Control', 'no-store');
          next();
        } else {
          console.log("Invalid refresh");
          return res
            .status(401)
            .json({ message: "Refresh token is also invalid", bool: false });
        }
      } else if (err) {
        return res.status(401).json({ message: "Invalid token", bool: false });
      } else {
        const decrypted_obj = JSON.parse(decrypt(decoded.enc));
        req.userId = decrypted_obj.id;
        next();
      }
    });
  } else {
    res.json({ message: "Token not found", bool: false });
  }
};

module.exports = { validateToken };
