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
    console.log(sessionStorage.getItem('accesstoken'))
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
    console.log(this.socket)
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

}
