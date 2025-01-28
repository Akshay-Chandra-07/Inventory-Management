const jwt = require('jsonwebtoken');
const { decrypt } = require('./crypto');

exports.validateResetToken = (token)=>{
    const id = jwt.verify(token,process.env.JWT_RESETSECRETKEY, (error,decoded)=>{
        if(error){
            return;
        }
        const decrypted_obj = JSON.parse(decrypt(decoded.enc))
        return decrypted_obj.id;
    })

    return id;
}