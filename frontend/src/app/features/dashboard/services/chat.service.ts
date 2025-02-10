import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private _http:HttpClient) { }
  apiUrl = environment.apiUrl
  getAllUsers(){
    return this._http.get(`${this.apiUrl}/users/get-all-users`)
  }

  getUserChats(){
    return this._http.get(`${this.apiUrl}/chats/get-user-chats`)
  }

  addUserToChat(receiver_name:string,receiver_id:number){
    return this._http.post(`${this.apiUrl}/chats/add-user-to-chat`,{receiver_name,receiver_id})
  }

  getChatMessages(chat_id:number){
    return this._http.get(`${this.apiUrl}/chats/get-chat-messages?chat_id=${chat_id}`)
  }

  getChatMembers(chat_id:number){
    return this._http.get(`${this.apiUrl}/chats/get-chat-members?chat_id=${chat_id}`)
  }

  createGroupChat(groupUsers:any,groupName:string){
    return this._http.post(`${this.apiUrl}/chats/create-group`,{groupUsers,groupName})
  }

  getAllGroups(){
    return this._http.get(`${this.apiUrl}/chats/get-all-groups`)
  }

  markChatAsRead(chat_id:number){
    return this._http.patch(`${this.apiUrl}/chats/mark-chat-as-read`,{chat_id})
  }

  joinGroup(chat_id:number,chat_name:string){
    return this._http.post(`${this.apiUrl}/chats/join-group`,{chat_id,chat_name})
  }

  leaveGroup(chat_id:number){
    return this._http.delete(`${this.apiUrl}/chats/leave-group?chatId=${chat_id}`)
  }

  deleteGroup(chat_id:number){
    return this._http.delete(`${this.apiUrl}/chats/delete-group?chatId=${chat_id}`)
  }

  removeUserFromGroup(chat_id:number,user_id:number,chat_name:string){
    return this._http.delete(`${this.apiUrl}/chats/remove-user-from-group?chatId=${chat_id}&userId=${user_id}&chatName=${chat_name}`)
  }
}
