const jwt = require('jsonwebtoken');
const { decrypt } = require('./crypto');
const AuthQueries = require('../v1/auth/auth.queries');

exports.validateResetToken = async (token)=>{
    try{
        return jwt.verify(token,process.env.JWT_RESETSECRETKEY, async (error,decoded)=>{
            const dbResetToken = await AuthQueries.getResetToken(token)
            if(error){
                throw error
            }
            if(dbResetToken.length>0){
                const decrypted_obj = JSON.parse(decrypt(decoded.enc))
                return decrypted_obj.id;
            }else{
                return;
            }
        })
    }catch(error){
        console.log(error)
        return
    }
}