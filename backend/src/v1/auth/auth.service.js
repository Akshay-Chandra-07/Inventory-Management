const bcrypt = require('bcryptjs')

class AuthService {
    static async generateUsername(email){
        return email.split('@')[0]
    }
    static async passwordHashing(password){
        const hashedPassword = await bcrypt.hash(password,10)
        return hashedPassword
    }
}

module.exports = AuthService