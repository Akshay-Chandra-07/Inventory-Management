const dotenv = require('dotenv').config({path:'../.env'})
console.log('')
const config = {  
  client : "mysql2",
  connection : {
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME
  },
  migrations : {
    directory : '../../migrations'
  },
  seeds : {
    directory : '../../seeds'
  }
}


module.exports = config