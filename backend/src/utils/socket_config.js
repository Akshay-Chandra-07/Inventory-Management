const socketIo = require('socket.io')
const {decrypt} = require('./crypto')
const jwt = require('jsonwebtoken')

let io = undefined;
let userSocketMap = new Map()
let socketUserMap = new Map()
exports.initializeSocket = (server)=>{
    io = socketIo(server,{
        cors:{
            origin: "http://localhost:4200"
        },
    })
    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);
      const accessToken = socket.handshake.auth.accessToken
        const decoded = jwt.decode(accessToken, process.env.JWT_TOKENSECRETKEY)
        const decryptedToken = JSON.parse(decrypt(decoded.enc))
        const user_id = decryptedToken.id
        const socketId = socket.id
        userSocketMap.set(user_id,socketId)
        socketUserMap.set(socketId,user_id)
      socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.id);
          userSocketMap.delete(user_id)
          socketUserMap.delete(socketId)
      });
    });
}

exports.getIo = ()=>{
    if(io){
        return io
    }
}

exports.getSocketId = (user_id)=>{
    return userSocketMap.get(user_id)
}