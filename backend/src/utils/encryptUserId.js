const { encrypt } = require("./crypto")

const encryptUserId = (UserId)=>{
    return encrypt({UserId})
}

module.exports = {encryptUserId}