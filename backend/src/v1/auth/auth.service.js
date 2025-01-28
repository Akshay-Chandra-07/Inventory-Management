const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer')

class AuthService {
  static async generateUsername(email) {
    return email.split("@")[0];
  }
  static async passwordHashing(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
  static async comparePassword(password, databasePassword) {
    return await bcrypt.compare(password, databasePassword);
  }
  static async sendEmail(details){
    const emailer = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    emailer.verify((error,message)=>{
      if(error){
        console.log(error)
        return
      }
      console.log("server ready")
    })

    emailer.sendMail(details,(error)=>{
      if(error){
        console.log(error)
      }
      return;
    })
  }
}

module.exports = AuthService;
