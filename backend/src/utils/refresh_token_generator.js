const jwt = require('jsonwebtoken')

exports.refreshTokenGenerator = async (id)=>{
    return jwt.sign({id:id},process.env.JWT_REFRESHSECRETKEY, {expiresIn:process.env.REFRESH_TIME})
}