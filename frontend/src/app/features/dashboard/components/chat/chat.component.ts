import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CryptoService } from 'src/app/core/services/crypto.service';
import { ChatService } from '../../services/chat.service';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SocketService } from 'src/app/core/services/socket.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  role:any;
  allUsers:any;
  userChats:any;
  chatMessages:any;
  chatMembers:any;
  curChat:any;
  allGroups:any;
  loggedInId:any;

  groupUsers:any = {}
  @Output() toggler = new EventEmitter<string>();

  constructor(
    private cryptoService:CryptoService,
    private chatService: ChatService,
    private errorService: ErrorHandlerService,
    private socketService: SocketService,
    private toastService:NgToastService,
  ) { }

  ngOnInit(): void {
    this.role = this.cryptoService.getRole()['role']
    this.loggedInId = this.cryptoService.getUserId()['UserId']
    this.fetchAllUsers()
    this.fetchUserChats()
    this.fetchAllGroups()
    this.socketService.onReceiveMessage().subscribe({
      next:(data:any)=>{
        this.appendingMessageToChat(data)
      },error:(error:Error)=>{
        console.log(error)
      }
    })
    this.socketService.onReceiveGroupMessage().subscribe({
      next:(data:any)=>{
        this.appendingMessageToChat(data)
      },error:(error:Error)=>{
        console.log(error)
      }
    })
    this.socketService.onMarkedChatAsRead().subscribe({
      next:(data:any)=>{
        console.log(data)
        for(let i =0 ;i<this.userChats.length;i++){
          if(this.userChats[i].chat_id == data){
            this.userChats[i].is_read = "1"
          }
        }
      },error:(error:Error)=>{
        console.log(error)
      }
    })
  }

  messageForm = new FormGroup({
    message:new FormControl('',[Validators.required])
  })

  createGroupForm = new FormGroup({
    groupName : new FormControl('',[Validators.required])
  })

  changeToInventoryComponent(){
    this.toggler.emit("Inventory")
  }

  changeToCartComponent(){
    this.toggler.emit("Cart")
  }

  changeToExcelFilesComponent(){
    this.toggler.emit("Files")
  }

  appendingMessageToChat(data:any){
    console.log(data.message)
    console.log(this.curChat)
    console.log(data.message[0].chat_id)
    if(this.curChat.chat_id == data.message[0].chat_id){
      this.chatMessages.push(data.message[0])
      this.onMarkChatAsRead(data.message[0].chat_id)
    }else{
      this.fetchUserChats()
    }
  }

  fetchAllUsers(){
    this.chatService.getAllUsers().subscribe({
      next:(data:any)=>{
        this.allUsers = data
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  fetchUserChats(){
    this.chatService.getUserChats().subscribe({
      next:(data:any)=>{
        this.userChats = data
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  onNewChat(user_name:string,user_id:number){
    this.chatService.addUserToChat(user_name,user_id).subscribe({
      next:(data:any)=>{
        this.fetchUserChats()
      },error:(error:Error)=>{
        this.errorService.handleError(error)
      }
    })
  }

  getChatMessages(chat_name:string,chat_id:number,user_id:number,purpose:string,created_by:number){
    if (!this.curChat || this.curChat.chat_id !== chat_id) {
      if(this.curChat && this.curChat.purpose == "1"){
        this.socketService.onLeaveRoom(this.curChat.chat_id)
      }
      this.curChat = { chat_id, chat_name, user_id ,purpose,created_by};
      this.chatService.getChatMessages(this.curChat.chat_id).subscribe({
        next: (data: any) => {
          console.log(data);
          this.chatMessages = data;
        },
        error: (error: Error) => this.errorService.handleError(error),
      });
      if(this.curChat.purpose == "1"){
        this.socketService.onJoinRoom(this.curChat.chat_id)
        this.chatService.getChatMembers(this.curChat.chat_id).subscribe({
          next: (data: any) => {
            console.log(data);
            this.chatMembers = data;
          },
          error: (error: Error) => this.errorService.handleError(error),
        })
      }
    }
  }

  onMarkChatAsRead(chat_id:number){
    this.chatService.markChatAsRead(chat_id).subscribe({
      next:(data:any)=>{
        console.log(data)
      },error:(error:Error)=>{
        console.log(error)
      }
    })
  }
  
  onSendMessage(){
    if(this.curChat.purpose == "0"){
      this.socketService.onSendMessage(this.messageForm.controls.message.value!,this.curChat.user_id,this.curChat.chat_name,this.curChat.chat_id)
    }else{
      this.socketService.onSendGroupMessage(this.messageForm.controls.message.value!,this.curChat.user_id,this.curChat.chat_id)
    }
    if(!this.chatMessages){
      this.chatMessages = []
    }
    this.chatMessages.push({
      chat_id:this.curChat.chat_id,
      user_id:this.curChat.user_id,
      message:this.messageForm.controls.message.value!,
      created_at: new Date().toISOString()
    })
    this.messageForm.reset()
  }

  onAddGroupUser(user:any,user_id:number){
    if(!this.groupUsers){
      this.groupUsers = {}
    }
    this.groupUsers[user_id] = user
    console.log(this.groupUsers)
  }

  onRemoveGroupUser(user_id:number){
    delete this.groupUsers[user_id]
    console.log(this.groupUsers)
  }
  
  onSubmitCreateGroup(){
    console.log(this.groupUsers)
    this.chatService.createGroupChat(this.groupUsers,this.createGroupForm.controls.groupName.value!).subscribe({
      next: (data: any) => {
        console.log(data);
        this.fetchUserChats()
        this.groupUsers = {}
      },
      error: (error: Error) => this.errorService.handleError(error),
    })
  }

  onCloseCreateGroup(){
    this.groupUsers={};
  }

  fetchAllGroups(){
    this.chatService.getAllGroups().subscribe({
      next: (data: any) => {
        console.log(data);
        this.allGroups = data;
      },
      error: (error: Error) => this.errorService.handleError(error),
    })
  }

  joinGroup(chat_id:number,chat_name:string){
    this.chatService.joinGroup(chat_id,chat_name).subscribe({
      next:(data:any)=>{
        console.log(data)
        this.fetchUserChats()
      }
    })
  }

  onSendGroupMessage(message:string,user_id:number,chat_id:number){
    this.socketService.onSendGroupMessage(message,user_id,chat_id)
  }

  onLeaveGroup(chat_id:number){
    this.socketService.onLeaveRoom(chat_id)
    this.chatService.leaveGroup(chat_id).subscribe({
      next:(data:any)=>{
        this.fetchUserChats()
        this.curChat = {}
        this.chatMessages = undefined
      }
    })
  }

  onDeleteGroup(chat_id:number){
    this.chatService.deleteGroup(chat_id).subscribe({
      next: (data: any) => {
        this.toastService.info({detail:"Group deleted",duration:2000})
        this.fetchUserChats()
        this.curChat = {}
        this.chatMessages = undefined        
      },
      error: (error: Error) => this.errorService.handleError(error),
    })
  }
}
