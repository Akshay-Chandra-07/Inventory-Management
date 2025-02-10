import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client'
import { environment } from 'src/environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: Socket
  constructor() { 
    this.socket = io(environment.serverUrl,{
      auth:{
        accessToken : sessionStorage.getItem('accesstoken')
      }
    })
    this.socket.on("connect",()=>{
      console.log("socket connected")
    })
    this.socket.on("disconnect",()=>{
      console.log("Disconnected")
    })
  }

  onStatusUpdate():Observable<any>{
    return new Observable((observer)=>{
      this.socket.on('statusUpdate',(data:any)=>{
        console.log(data)
        observer.next(data)
      })
    })
  }

  onNotification(){
    return new Observable((observer)=>{
      this.socket.on('pushNotification',(data:any)=>{
        observer.next(data)
      })
    })
  }

  onCountUpdate(){
    return new Observable((observer)=>{
      this.socket.on('countUpdate',(data:any)=>{
        observer.next(data)
      })
    })
  }

  reportUpdate(){
    return new Observable((observer)=>{
      this.socket.on('reportUpdate',(data:any)=>{
        observer.next(data)
      })
    })
  }

  onSendMessage(message:string,user_id:number,username:string,chat_id:number){
    this.socket.emit('sendMessage',{message:message,user_id:user_id,username:username,chat_id:chat_id})
  }

  onReceiveMessage(){
    return new Observable((observer)=>{
      this.socket.on('receiveMessage',(data:any)=>{
        observer.next(data)
      })
    })
  }

  onJoinRoom(roomId:number){
    this.socket.emit("onJoinRoom",{roomId:roomId})
  }

  onLeaveRoom(roomId:number){
    this.socket.emit("onLeaveRoom",{roomId:roomId})
  }

  onSendGroupMessage(message:string,user_id:number,chat_id:number){
    this.socket.emit("sendGroupMessage",{message:message,user_id:user_id,chat_id:chat_id})
  }

  onReceiveGroupMessage(){
    return new Observable((observer)=>{
      this.socket.on("receiveGroupMessage",(data:any)=>{
        observer.next(data)
      })
    })
  }

  onMarkedChatAsRead(){
    return new Observable((observer)=>{
      this.socket.on("onMarkedChatAsRead",(data:any)=>{
        observer.next(data)
      })
    })
  }

  onRemovedFromGroup(){
    return new Observable((observer)=>{
      this.socket.on("onRemovedFromGroup",(data:any)=>{
        observer.next(data)
      })
    })
  }

}
