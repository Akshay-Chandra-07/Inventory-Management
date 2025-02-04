const { encrypt } = require("./crypto")

const encryptRole = (role)=>{
    return encrypt({role})
}

module.exports = {encryptRole}