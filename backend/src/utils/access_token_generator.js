const jwt = require('jsonwebtoken')

exports.accessTokenGenerator = async (id)=>{
    return jwt.sign({id:id},process.env.JWT_TOKENSECRETKEY, {expiresIn:process.env.TOKEN_TIME})
}