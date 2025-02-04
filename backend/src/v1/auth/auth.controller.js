const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const authService = require("./auth.service");
const authQueries = require("./auth.queries");
const bcrypt = require("bcryptjs");
const {encryptRole} = require('../../utils/encryptRole')
const { accessTokenGenerator } = require("../../utils/access_token_generator");
const {
  refreshTokenGenerator,
} = require("../../utils/refresh_token_generator");

const { validateUserCreation } = require("./dto/userCreation.dto");
const { validateUserLogin } = require("./dto/userLogin.dto");
const { validateForgotPasswordSchema } = require("./dto/forgorPassword.dto");
const { resetTokenGenerator } = require("../../utils/reset_token_generator");
const { validateResetToken } = require("../../utils/validate_reset_token");

exports.register = async (req, res, next) => {
  const validated = validateUserCreation(req.body);
  if (validated.error) {
    console.log(validated.error.message);
    return res.status(400).json({ msg: validated.error.message });
  }
  username = await authService.generateUsername(req.body.email);
  password = await authService.passwordHashing(req.body.password);
  const checkUser = await authQueries.checkUser(req.body.email);
  if (checkUser.length > 0) {
    return res.status(400).json({ msg: "Email already registered" });
  } else {
    createUser = await authQueries.register(
      req.body.first_name,
      req.body.last_name,
      req.body.email,
      req.body.role,
      username,
      password,
    );
    if (createUser == true) {
      return res.status(201).json({ msg: "User created" });
    } else {
      return res.status(400).json({ msg: "Error creating user", createUser });
    }
  }
};

exports.login = async (req, res, next) => {
  const { user, password } = req.body;
  const validated = validateUserLogin(req.body);
  if (validated.error) {
    console.log(validated.error.message);
    return res.status(401).json({ msg: validated.error.message });
  }
  try {
    const checkCredentials = await authQueries.checkCredentials(user);

    if (checkCredentials.length == 0) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    try {
      const boolPassword = await authService.comparePassword(
        password,
        checkCredentials[0].password,
      );
      if (boolPassword) {
        const accessToken = accessTokenGenerator(checkCredentials[0].user_id,checkCredentials[0].role);
        const refreshToken = refreshTokenGenerator(checkCredentials[0].user_id,checkCredentials[0].role);
        const encryptedRole = encryptRole(checkCredentials[0].role)
        await authQueries.setRefreshToken(
          checkCredentials[0].user_id,
          refreshToken,
        );
        return res.status(200).json({
          msg: "User logged in!",
          accessToken: accessToken,
          role : encryptedRole
        });
      } else {
        return res.status(400).json({ msg: "Invalid Password" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

exports.forgotPassword = async (req,res,next)=>{
  const {email} = req.body;
  // const validated = validateForgotPasswordSchema(email)
  // if(validated.error){
  //   return res.status(401).json({msg:validated.error.message})
  // }
  const bool = await authQueries.checkUser(email)
  if(bool[0].user_id){
    const reset_token = resetTokenGenerator(bool[0].user_id)
    const clientUrl = process.env.CLIENT_URL
    const resetLink = `${clientUrl}?token=${reset_token}&email=${email}`
    const mailDetails = {
      from : process.env.EMAIL,
      to : email,
      subject : "Password reset link",
      text : `Click to reset password : ${resetLink}`
    }
    authService.sendEmail(mailDetails)
    return res.status(200).json({msg:"Email sent"})
  }else{
    return res.status(400).json({msg:"error"})
  }
}

exports.resetPassword = async(req,res,next)=>{
  const {password,token} = req.body
  const user_id = validateResetToken(token)
  if(user_id){
    const hashedPassword = await authService.passwordHashing(password)
    await authQueries.updateUserPassword(hashedPassword,user_id)
    return res.status(200).json({msg:"Password updated successfully"})
  }
  return res.status(401).json({msg:"Cannot update password"})
}
