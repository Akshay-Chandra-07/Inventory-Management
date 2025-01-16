const db = require("../../mysql/db");
const Users = require("../../models/usersModel");
const authService = require("./auth.service");
const authQueries = require("./auth.queries");
const bcrypt = require("bcryptjs");
const { accessTokenGenerator } = require("../../utils/access_token_generator");
const {
  refreshTokenGenerator,
} = require("../../utils/refresh_token_generator");

exports.register = async (req, res, next) => {
  username = await authService.generateUsername(req.body.email);
  password = await authService.passwordHashing(req.body.password);
  const checkUser = await authQueries.checkUser(req.body.email);
  if (checkUser.length > 0) {
    return res.status(200).json({ msg: "Email already registered" });
  } else {
    createUser = await authQueries.register(
      req.body.first_name,
      req.body.last_name,
      req.body.email,
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
  try {
    const checkCredentials = await authQueries.checkCredentials(user);

    if (checkCredentials.length == 0) {
      return res.status(200).json({ msg: "Invalid credentials" });
    }
    try {
      const boolPassword = await authService.comparePassword(
        password,
        checkCredentials[0].password,
      );
      if (boolPassword) {
        const accessToken = accessTokenGenerator(checkCredentials[0].user_id);
        const refreshToken = refreshTokenGenerator(checkCredentials[0].user_id);
        return res.status(200).json({
          msg: "User logged in!",
          accessToken: accessToken,
          refreshToken: refreshToken,
        });
      } else {
        return res.status(200).json({ msg: "Invalid Password" });
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
