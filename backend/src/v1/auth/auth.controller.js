const db = require('../../mysql/db')
const Users = require('../../models/usersModel')
const authService = require('./auth.service')
const authQueries = require('./auth.queries')
const bcrypt = require('bcryptjs')

exports.register = async (req,res,next)=>{
    username = await authService.generateUsername(req.body.email)
    password = await authService.passwordHashing(req.body.password)
    console.log(username,password);
    const checkUser = await authQueries.checkUser(req.body.email)
    if(checkUser.length>0){
        return res.status(200).json({msg:"Email already registered"})
    }else{
        createUser = await authQueries.register(req.body.first_name,req.body.last_name,req.body.email,username,password)
        console.log(createUser);
        if(createUser==true){
            return res.status(201).json({msg:"User created"})
        }else{
            return res.status(400).json({msg:"Error creating user",createUser})
        }
    }
}