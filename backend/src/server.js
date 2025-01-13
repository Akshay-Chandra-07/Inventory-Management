const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config({path:"./src/.env"})
require('./mysql/db')
// app.use(cors('http://localhost:4200'));

const app = express()
app.use(express.json())



app.use('/v1',require('./v1/v1Routes'))


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Listening to port ${process.env.PORT}`);
})