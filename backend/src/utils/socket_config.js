const socketIo = require("socket.io");
const { decrypt } = require("./crypto");
const jwt = require("jsonwebtoken");
const userQueries = require("../v1/users/user.queries");
const ChatsQueries = require("../v1/chats/chats.queries");

let io = undefined;
let userSocketMap = new Map();
let socketUserMap = new Map();
exports.initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:4200",
    },
  });
  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    const accessToken = socket.handshake.auth.accessToken;
    const decoded = jwt.decode(accessToken, process.env.JWT_TOKENSECRETKEY);
    const decryptedToken = JSON.parse(decrypt(decoded.enc));
    const user_id = decryptedToken.id;
    const socketId = socket.id;
    userSocketMap.set(user_id, socketId);
    socketUserMap.set(socketId, user_id);
    socket.on('sendMessage',async (data)=>{
        const receiver_id = await userQueries.getUserIdByUsername(data.username)
        const receiver_socket = userSocketMap.get(receiver_id[0].user_id)
        try{
            const msgData = await ChatsQueries.addMessage(data.message,data.user_id,data.chat_id)
            if(receiver_socket){
                console.log("emitting to receiver",receiver_socket)
                socket.to(receiver_socket).emit("receiveMessage",{
                    message:msgData
                })
            }
        }catch(error){
            console.log(error)
        }
    })
    socket.on("onJoinRoom",(data)=>{
      socket.join(data.roomId)
    })
    socket.on("sendGroupMessage",async (data)=>{
      try{
        const msgData = await ChatsQueries.addMessage(data.message,data.user_id,data.chat_id)
        socket.to(data.chat_id).emit("receiveGroupMessage",{
          message:msgData
        })
      }catch(error){
        console.log(error)
      }
    })
    socket.on("onLeaveRoom",(data)=>{
      socket.leave(data.roomId)
    })
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      userSocketMap.delete(user_id);
      socketUserMap.delete(socketId);
    });
  });
};

exports.getIo = () => {
  if (io) {
    return io;
  }
};

exports.getSocketId = (user_id) => {
  console.log(user_id)
  console.log(userSocketMap)
  return userSocketMap.get(user_id);
};
